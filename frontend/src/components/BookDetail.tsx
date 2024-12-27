import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';


const BookDetail: React.FC = () => {
   
   

  return (
    
    <Container>
      <Typography variant="h3"> title</Typography>
      <Typography> category </Typography>
      <Typography> description</Typography>
      <Button variant="contained" color="primary">
        Add to Cart
      </Button>
    </Container>
    
  );
};

export default BookDetail;
