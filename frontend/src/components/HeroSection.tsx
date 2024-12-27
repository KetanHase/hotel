import React, { useState } from 'react';
import {  Card, CardContent, CardMedia } from '@mui/material';
import {
  Grid,
  Typography,
  Button,
  Box,
  Link,
  TextField,
  Container,
} from '@mui/material';
import axios from 'axios'; // Import axios for making HTTP requests
import mastercardLogo from '../assets/header_img.png';

const HeroSection: React.FC = () => {
  const [email, setEmail] = useState<string>(''); // State to hold the email input
  const [error, setError] = useState<string | null>(null); // State for error message
  const [success, setSuccess] = useState<string | null>(null); // State for success message

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value); // Update the email state
  };

  const handleSubmit = async () => {
    setError(null); // Reset error state
    setSuccess(null); // Reset success state

    try {
      const response = await axios.post(`http://localhost:8081/contacts`, { email });
      console.log('response.data.message',response.data.message);
      setSuccess(response.data.message); // Set success message
      setEmail(''); // Clear the email input
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.error); // Set error message from the response
      } else {
        setError('Failed to submit message.'); // General error message
      }
    }
  };

  return (
    <>
       

      {/* Modal Data */} 
      <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#FF7F50', padding: 4 }}>
      {/* Image Section */}
      <CardMedia
        component="img"
        //image='../assets/header_img.png' // Use the correct path for your image
         src={mastercardLogo} alt="MasterCard" style={{ width: '70px' }} 
        //alt="Delicious food plate"
        sx={{ width: '100%', borderRadius: '8px', marginBottom: 2 }}
      />
      
      {/* Text Content */}
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="h3" component="div" sx={{ color: '#fff', fontWeight: 'bold' }}>
          Order your favourite food here
        </Typography>
        <Typography variant="subtitle1" component="p" sx={{ color: '#fff', marginY: 2 }}>
          Choose a diverse menu featuring world-class food
        </Typography>

        {/* Call-to-Action Button */}
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ backgroundColor: '#fff', color: '#FF7F50', fontWeight: 'bold', borderRadius: '20px' }}
          href='/menu'
        >
          View Menu
        </Button>
      </CardContent>
    </Card>
    </>
  );
};

export default HeroSection;
