//BookList.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, SelectChangeEvent, CardActions, Button, Typography, Container, Grid, Box, Snackbar, Alert, Select, MenuItem, FormControl, InputLabel, Divider } from '@mui/material';
import axios from 'axios';
import ViewBookDialog from './ViewBookDialog';
import CategorySlider from './CategorySlider';

interface BookListProps {
  userId: number;
  addToCart: (book: Book) => void;
}

interface Book {
  id: number;
  name: string;
  price: number;
  author: string;
  stock: number;
  imageFile: string;
  status: string;
  price_category: string;  
  category_id: number;
  category_name: string;
  language: string;
  language_name: string;
}

interface Category {
  id: number;
  name: string;
  image: string;
}

interface Language {
  id: number;
  name: string;
}
 
const BookList: React.FC<BookListProps> = ({ userId }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string | number>('all');
  const [filterCategory, setFilterCategory] = useState<string>("");
   
  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog
  const [selectedBook, setSelectedBook] = useState<Partial<Book> | null>(null); 

  useEffect(() => {

    axios.get('http://localhost:8081/categories')
      .then(response => setCategories(response.data))
      .catch(error => console.error("Error fetching categories", error));

      axios.get('http://localhost:8081/languages') // Adjust to your language endpoint
      .then(response => setLanguages(response.data))
      .catch(error => console.error("Error fetching languages", error));

    fetchBooks();
  }, []);

 /* const fetchBooks = (categoryId: number | string = 'all', languageId: number | string = 'all') => {
    let url = 'http://localhost:8081/'; // Base URL
  
    // Add query parameters for category and language filters
    const queryParams: string[] = [];
    
    if (categoryId !== 'all') {
      queryParams.push(`categoryId=${categoryId}`);
    }
    
    if (languageId !== 'all') {
      queryParams.push(`languageId=${languageId}`);
    }
    
    // If there are query parameters, append them to the URL
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }
  
    axios.get(url)
      .then(response => setBooks(response.data))
      .catch(error => console.error("Error fetching books", error));
  }; */
  
  const fetchBooks = (categoryId: number | string = 'all' ) => {
    let url = 'http://localhost:8081/'; // Base URL
    
    // Build query string based on category and language
    const queryParams: string[] = [];
    
    if (categoryId !== 'all') {
      queryParams.push(`categoryId=${categoryId}`);
    }
    
    
    
    // If there are query parameters, append them to the URL
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }
    
    // Fetch books based on filters
    axios.get(url)
      .then(response => setBooks(response.data))
      .catch(error => console.error("Error fetching books", error));
  };

  const handleCategoryClick = (categoryId: number | string) => {
    setSelectedCategory(categoryId);
    fetchBooks(categoryId);
  };
  

  const handleCategoryChange = (event: SelectChangeEvent<number | string>) => {
    const categoryId = event.target.value as number | string;
    setSelectedCategory(categoryId);
    fetchBooks(categoryId ); // Fetch based on selected category and language
  };
  
  const handleLanguageChange = (event: SelectChangeEvent<number | string>) => {
    const languageId = event.target.value;
    setSelectedLanguage(languageId);
    fetchBooks(selectedCategory ); // Fetch based on selected language and category
  };
  
  const addToCart = (book: Book) => {
    if (userId === 0) {
      alert("Please log in to add items to your cart.");
      return;
    }
    axios.post('http://localhost:8081/cart/add', {
      userId: userId,
      bookId: book.id,
      quantity: 1,
    })
      .then(() => {
        setSnackbarOpen(true);
        console.log('Book added to cart');
        window.location.reload();
      })
      .catch(error => {
        console.error('Error adding book to cart:', error);
      });
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleQuickView = (book: Book) => {
    setSelectedBook(book);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedBook(null);
  };

  /*const filteredBooks = books.filter(book => {
    const categoryMatch = selectedCategory === 'all' || book.category_id === +selectedCategory;
    const priceMatch = filterCategory ? book.price_category === filterCategory : true;
    const languageMatch = selectedLanguage === 'all' || book.language === selectedLanguage;
    return categoryMatch && priceMatch && languageMatch;
 });  */

 const filteredBooks = books.filter(book => 
  selectedCategory === 'all' || book.category_id === +selectedCategory
);

  const formControlStyles = {
    mt: { xs: 2, sm: 3 },
    mb: { xs: 3, sm: 5 },
    mr: { xs: 3, sm: 5 },
    width: { xs: '100%', sm: '60%', md: '25%' },
    mx: 'auto',
     
  };
  
  return (
    
    <Box  sx={{ mt: 5, mb: 5, px: { xs: 2, sm: 4, md: 6 } }}>

      <Typography variant="h4" sx={{ mt: 2, mb: 3, textAlign: 'center',cursor: 'pointer' }}
      onClick={() => {
        setSelectedCategory('all');
        setSelectedLanguage('all');
        fetchBooks('all'); // Fetch all books
      }}
      >
        Menu
        
      </Typography>

      <Typography variant="h6" sx={{ mt: 2, mb: 3 }}>
      CATEGORY
      </Typography>
      

      
{/* <FormControl size="small" sx={formControlStyles}>
  <Typography variant='h6'>Sort By Category</Typography>
  <Select value={selectedCategory} onChange={handleCategoryChange}>
    <MenuItem value="all">All Categories</MenuItem>
    {categories.map((category) => (
      <MenuItem key={category.id} value={category.id}>
        {category.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>

<FormControl size="small" sx={formControlStyles}>
  <Typography variant='h6'>Sort By Price</Typography>
  <Select
    value={filterCategory}
    onChange={(e) => setFilterCategory(e.target.value)}
    displayEmpty
  >
    <MenuItem value="">All Prices</MenuItem>
    <MenuItem value="Low">Low</MenuItem>
    <MenuItem value="Medium">Medium</MenuItem>
    <MenuItem value="High">High</MenuItem>
  </Select>
</FormControl>

<FormControl size="small" sx={formControlStyles}>
  <Typography variant='h6'>Sort by Language</Typography>
  <Select value={selectedLanguage} onChange={handleLanguageChange}>
     
    <MenuItem value="all">All Languages</MenuItem>
          {languages.map(language => (
            <MenuItem key={language.id} value={language.id}>
              {language.name}
            </MenuItem>
    ))}
  </Select>
</FormControl>*/}

       <CategorySlider
        categories={categories}
        
        onCategoryClick={handleCategoryClick}
      />
    <Divider />
   
      <Container maxWidth="lg" sx={{ mt: 4 }}>
      {filteredBooks.length === 0 ? (
          <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>
            No Items available in this category.Choose different category
          </Typography>
        ) : (
        <Grid container spacing={4} justifyContent="center">
          {filteredBooks.map((book) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
              <Card
                 sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: 'transform 0.1s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <img
                  src={`http://localhost:8081/uploads/${book.imageFile}`}
                  alt={book.name}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderTopLeftRadius: '4px',
                    borderTopRightRadius: '4px',
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {book.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Price: Rs {book.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary"  style={{ width: 100,color: book.status === 'Available' ? 'green' : 'red' }}>
                     {book.status}
                  </Typography>
                 
                  <Typography variant="body2" component="div" gutterBottom>
                   Category: {book.category_name}
                  </Typography>
                  
                </CardContent>
                <CardActions>
                  <Button size="small" variant="contained" color="warning" sx={{mr: 2}} onClick={() => addToCart(book)}  >
                    Add to cart
                  </Button>
                  <Button size="small" variant="contained" color="info"  onClick={() => handleQuickView(book)}  >
                       Quick View
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        )}
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Item added to cart successfully!
        </Alert>
      </Snackbar>

      <ViewBookDialog open={dialogOpen} book={selectedBook} onClose={handleDialogClose} />
    </Box>
  );
};

export default BookList;


