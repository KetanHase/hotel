import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, TextField, Button, Typography, Breadcrumbs, Link, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Divider } from '@mui/material';
import axios from 'axios';
import { Book } from '../interfaces/Book';
import { Category } from '../interfaces/Category';
import { Language } from '../interfaces/Language';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import InputAdornment from '@mui/material/InputAdornment'; 

interface AddProProps {
  book?: Partial<Book> | null ;   
  handleClose: () => void;
}


const AddPro: React.FC<AddProProps> = ({ book, handleClose }) => {
  const [formData, setFormData] = useState<Partial<Book>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const {id} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (book) {
      setFormData(book);
      if (book.imageFile) {
        setCurrentImage(`http://localhost:8081/uploads/${book.imageFile}`);
      }
    }
  }, [book]);

  useEffect(() => {
    if (formData.id) {
      axios.get(`http://localhost:8081/books/${formData.id}`)
        .then(response => {
          const book = response.data;
          setFormData(book);
          setCurrentImage(`http://localhost:8081/uploads/${book.imageFile}`);
        })
        .catch(error => console.error("There was an error fetching the book!", error));
    }
  }, [id]);

  useEffect(() => {
    axios.get('http://localhost:8081/categories')
      .then(response => setCategories(response.data))
      .catch(error => console.error("There was an error fetching categories!", error));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8081/languages')
      .then(response => setLanguages(response.data))
      .catch(error => console.error("There was an error fetching languages!", error));
  }, []);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

   // console.log('id')
   const formDataToSend = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value as string);
    });

    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    if (formData.id) {
     
      axios.put(`http://localhost:8081/update/${formData.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((res) => {
          window.location.reload();
          alert('Book updated successfully:');
          console.log('Book updated successfully:', res);
          //navigate('/book');
          window.location.href = '/book';
          handleClose();   
        })
        .catch(error => {
          console.error("There was an error updating the book!", error);
        });
    } else {
      
      axios.post('http://localhost:8081/create',  formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((res) => {
          window.location.reload();
          console.log('Book added successfully:', res);
          navigate('/book');
          handleClose();   
        })
        .catch(error => {
          console.error("There was an error adding the book!", error);
        });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleCategoryChange = (event: SelectChangeEvent<number>) => {
    setFormData({
      ...formData,
      category_id: Number(event.target.value),
    });
  };
  const handleLanguageChange = (event: SelectChangeEvent<number>) => {
    setFormData({
      ...formData,
      language_id: Number(event.target.value),
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 6 }}>
        <Grid item>
          <Typography variant="h6" gutterBottom>
            {formData ? "Update Menu" : "Add Menu"}
          </Typography>
        </Grid>
        <Grid item>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link underline="hover" color="inherit" href="/">
            Menu
            </Link>
            <Link underline="hover" color="inherit" href="/book">
              List
            </Link>
            <Typography color="text.primary">{formData.id ? "Update" : "Create"}</Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <form onSubmit={handleSubmit} noValidate autoComplete="off">
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="name"
                label="Name"
                name="name"
                variant="outlined"
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="Name"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="Description"
                label="Description"
                name="author"
                variant="outlined"
                value={formData.author || ''}
                onChange={handleChange}
                placeholder="Enter Description"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="Status"
                name="stock"
                label="Status"
                variant="outlined"
                value={formData.stock || ''}
                onChange={handleChange}
                placeholder="Enter o or 1"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="price"
                name="price"
                label="Price"
                variant="outlined"
                value={formData.price || ''}
                onChange={handleChange}
                placeholder="Price"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  value={formData.category_id || ''}
                  onChange={handleCategoryChange}
                  label="Category"
                >
                   
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
               {currentImage && <img src={currentImage} alt="Current" style={{ maxWidth: '100%', maxHeight: '200px' }} />}
              <FormControl fullWidth variant="outlined">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{
                      opacity: 0,
                      position: 'absolute',
                      zIndex: 1,
                      width: '100%',
                      height: '100%',
                      cursor: 'pointer',
                    }}
                  />
                
                  <TextField
                    fullWidth
                    id="image"
                    label="Select an image"
                    variant="outlined"
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <UploadFileOutlinedIcon />
                          Upload Image Here
                        </InputAdornment>
                        
                      ),
                    }}
                    sx={{
                      position: 'relative',
                      zIndex: 0,
                    }}
                  />
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box display="flex" justifyContent="center">
              <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
                {formData.id ? "Update" : "Add"}
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleClose}>
                Cancel
              </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </form>
    </Container>
  );
}

export default AddPro;
