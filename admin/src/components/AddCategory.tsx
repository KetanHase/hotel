import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, TextField, Button, Typography, Breadcrumbs, Link, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, InputAdornment } from '@mui/material';
import axios from 'axios';
 
import { Category } from '../interfaces/Category';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
 

interface AddProProps {
  category?: Partial<Category> | null ;   
  handleClose: () => void;
}


const AddCategory: React.FC<AddProProps> = ({ category, handleClose }) => {
  const [formData, setFormData] = useState<Partial<Category>>({});
  const [image , setImage ] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  
  const {id} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (category) {
      setFormData(category);
      if (category.image) {
        setCurrentImage(`http://localhost:8081/uploads/category/${category.image}`);
      }
    }
  }, [category]);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8081/categories`+id)
        .then(response => 
          setFormData(response.data.formData))
        .catch(error => console.error("There was an error fetching the Category!", error));
    }
  }, [id]);

   
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

   // console.log('id')
   const formDataToSend = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value as string);
    });

    if (image) {
      formDataToSend.append('image', image);
    }

    if (formData.id) {
     
      axios.put(`http://localhost:8081/category/update/${formData.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((res) => {
          window.location.reload();
          alert('Category updated successfully:');
          console.log('Category updated successfully:', res);
          //navigate('/book');
          window.location.href = '/category';
          handleClose();   
        })
        .catch(error => {
          console.error("There was an error updating the Category!", error);
        });
    } else {
      
      axios.post('http://localhost:8081/category/create',  formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((res) => {
          window.location.reload();
          console.log('Category added successfully:', res);
          navigate('/category');
          handleClose();   
        })
        .catch(error => {
          console.error("There was an error adding the Category!", error);
        });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImage (file);
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
            {id ? "Update Category" : "Add Category"}
          </Typography>
        </Grid>
        <Grid item>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link underline="hover" color="inherit" href="/">
              Category
            </Link>
            <Link underline="hover" color="inherit" href="/category">
              List
            </Link>
            <Typography color="text.primary">{id ? "Update" : "Create"}</Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <form onSubmit={handleSubmit} noValidate autoComplete="off">
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
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
              <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
                {formData.id ? "Update" : "Add"}
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleClose}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>
    </Container>
  );
}

export default AddCategory;
