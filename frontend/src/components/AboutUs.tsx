import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import BookStore from '../assets/indore.jpg';

const AboutUs: React.FC = () => {
  return (
    <Container maxWidth="lg">
      {/* About Us Image */}
      <Box 
        sx={{ 
          mt:3,
          height: { xs: '200px', md: '400px' }, // Responsive height
          backgroundImage: `url(${BookStore})`,
          backgroundSize: 'cover', // Cover the entire box
          backgroundPosition: 'center',
          borderRadius: 1, // Rounded corners
          boxShadow: 2 // Add some shadow for depth
         
        }} 
      />
      
      {/* About Us Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body1" paragraph>
        Welcome to Tomato. – Your Gateway to Great Food, Anytime, Anywhere!

At Tomato. , we believe that ordering food should be fast, simple, and enjoyable. Our platform connects hungry customers with their favorite restaurants, delivering delicious meals right to their doorsteps. Whether you're craving comfort food, a gourmet experience, or healthy options, we’ve got it all covered.
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          About Store
        </Typography>

        

        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
        Our mission is to revolutionize the way you enjoy food. We aim to offer an easy and convenient platform where you can explore a wide variety of cuisines, discover new flavors, and order your meals from local favorites or global chains with just a few clicks.
        </Typography>
        <Typography variant="body1" paragraph>
        Whether you're at home, at work, or on the go, Tomato. is here to satisfy your cravings. Browse through our curated menus, discover new dishes, and experience the joy of food delivered with care.
        </Typography>

        {/* Store Information Grid */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">Address:</Typography>
            <Typography variant="body2">SM Road,Near SGM School, Pune 422525</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">Phone:</Typography>
            <Typography variant="body2">9876544321</Typography>
          </Grid>
        </Grid>

      </Box>
    </Container>
  );
};

export default AboutUs;
