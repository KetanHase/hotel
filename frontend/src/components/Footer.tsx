import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        //position: 'fixed', // Fix position to the bottom
        bottom: 0,         // Align to the bottom of the viewport
        left: 0,           // Align to the left
        right: 0,       // Align to the right
        backgroundColor: '#51606e', // Background color
        py: 4,             // Vertical padding
        textAlign: 'center', // Center the text
      }}
    >
      <Typography
        variant="body2"
        color="textSecondary"
      >
        {'Copyright © '}
        <Link href="/" color="textSecondary">
          Tomato.
        </Link>{' '}
        {new Date().getFullYear()}
      </Typography>
    </Box>
  );
};

export default Footer;
