import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Card,
  CardContent,
  Grid,
  TextField,
  Alert,
  Box,
  InputAdornment,
  IconButton
} from '@mui/material';
import useCartData from '../api/useCartData';
import mastercardLogo from '../assets/mastercard.png'; // Ensure you have the images in your project
import visaLogo from '../assets/visa.png';
import paypalLogo from '../assets/paypal.png';
import { Navigate } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

interface User {
  id: number;
  username: string;
}

const Checkout = ({ userId }: { userId: number }) => {
  const { items, totalAmount, loading } = useCartData(userId);
  const [isOrdering, setIsOrdering] = useState<boolean>(false);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('');
  const [addressError, setAddressError] = useState(false);
  const [cardDetails, setCardDetails] = useState<string>(''); // Optional
   
  const [city, setCity] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
   

  useEffect(() => {
    axios
      .get('http://localhost:8081/check-session', { withCredentials: true })
      .then((response) => {
        setLoggedIn(response.data.loggedIn);
        if (response.data.user) {
          setUser(response.data.user as User);
        }
      })
      .catch(() => {
        setLoggedIn(false);
        setUser(null);
      });
       
  }, []);

  const validateAddress = (): boolean => {
    if (!address || address.length < 10) {
      setAddressError(true); // Set error if address is empty or too short
      return false;
    } else {
      setAddressError(false); // Clear error if address is valid
      return true;
    }
  };

  const handleOrder = async () => {
    if (!validateAddress()) {
      setOrderStatus('Please enter a valid address.');
      setOpenSnackbar(true);
      return;
    }

    setIsOrdering(true);
    setOrderStatus(null);

    try {
      const orderData = {
        userId, 
        address,
        city,
        postalCode,
        phone,
        email,
        card_number: cardDetails,
        expiry: expiryDate,
        cvv,
        totalAmount,
          items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
        })), 
      };

      await axios.post(`http://localhost:8081/orders/create`, orderData);
      console.log('Order placed');


      await axios.post(`http://localhost:8081/cart/clear/${userId}`);
    
      setOrderStatus('Order placed and cart cleared successfully.');
      setOpenSnackbar(true);
      window.location.href = '/orders'; // or '/order' depending on your route
      //window.location.reload();
    } catch (error) {
      console.error('Error placing order or clearing cart:', error);
      setOrderStatus('Error placing order or clearing cart.');
      setOpenSnackbar(true);
    } finally {
      setIsOrdering(false);
    }   
  };

  return (
    <>
    <Navbar userId={user?.id ?? 0} username={user?.username || ''} loggedIn={loggedIn} />
    <Grid style={{ padding: '20px' }}>
      {/* Full Width Title */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
            Checkout
          </Typography>
        </Grid>

        {/* Cards Section: Divided into two parts */}
        <Grid 
          container 
          spacing={3} 
          justifyContent="space-between" 
          sx={{ padding: { xs: '0 10px', md: '0 40px' } }} // Add padding for left-right
        >
         {/* Left Column: Card 1 - Delivery Address */}
        <Grid item xs={12} md={6}>
          <Card sx={{ marginBottom: '20px' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Delivery Address
              </Typography>
              
              {/* Address Field */}
              <TextField 
               required
                label="Address"
                size="small"
                variant="outlined"
                fullWidth
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                multiline
                rows={2}
                sx={{ marginBottom: '16px' }} // Adds space between fields
              />

              {/* City and Postal Code Fields */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="City"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    sx={{ marginBottom: '16px' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Postal Code"
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    sx={{ marginBottom: '16px' }}
                  />
                </Grid>
              </Grid>

              {/* Phone Field */}
              <TextField
                label="Phone"
                size="small"
                variant="outlined"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                sx={{ marginBottom: '16px' }}
              />

              {/* Email Field */}
              <TextField
                label="Email"
                size="small"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </CardContent>
          </Card>
        </Grid>


          {/* Right Column: Card 2 and Card 3 */}
          {/* Right Column: Card 2 and Card 3 */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            
            {/* Card 2: Items Being Checked Out */}
            <Grid item xs={12}>
              <Card sx={{ marginBottom: '20px' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Your Items
                  </Typography>
                  
                  {/* Table Structure for Items */}
                  <table style={{ width: '100%', borderCollapse: 'collapse' ,border: '1px solid #ddd' }}>
                    <thead>
                      <tr style={ {border: '1px solid #ddd'} }>
                        <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Item</th>
                        <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Quantity</th>
                        <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Price (Rs.)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.itemId}>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd',textAlign: 'center' }}>{item.name}</td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd',textAlign: 'center' }}>{item.quantity}</td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #ddd',textAlign: 'center' }}>Rs.{item.price}</td>
                        </tr>
                      ))}
                       {/* Total Amount */}
                      <tr>
                        <td colSpan={2} style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontWeight: 'bold' }}>
                          Total:
                        </td>
                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center', fontWeight: 'bold' }}>
                          Rs.{totalAmount}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  
                 
                   
                </CardContent>
              </Card>
            </Grid>

            {/* Card 3: Payment Details (Optional) */}
            <Grid item xs={12}>
              <Card sx={{ marginBottom: '20px', padding: '16px', borderRadius: '12px', boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Payment Details (Optional)
                  </Typography>

                  {/* Card Logos */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: '10px', marginBottom: '20px' }}>
                    <img src={mastercardLogo} alt="MasterCard" style={{ width: '70px' }} />
                    <img src={visaLogo} alt="Visa" style={{ width: '70px' }} />
                    <img src={paypalLogo} alt="PayPal" style={{ width: '70px' }} /> 
                  </Box>

                  {/* Card Details Input */}
                  <TextField
                    label="Card Number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={cardDetails}
                    onChange={(e) => setCardDetails(e.target.value)}
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    sx={{ marginBottom: '16px' }}
                  />

                  {/* Expiry and CVV Inputs */}
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Expiry (MM/YY)"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}  
                        placeholder="MM/YY"
                        sx={{ marginBottom: '16px' }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="CVV"
                        size="small"
                        variant="outlined"
                        fullWidth
                        placeholder="XXX"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        sx={{ marginBottom: '16px' }}
                      />
                    </Grid>
                  </Grid>

                  {/* Placeholder for additional payment information */}
                  <Typography variant="body2" color="text.secondary">
                    Your payment details are secure and encrypted.
                  </Typography>
                </CardContent>
                <Grid item>
            <Button
              variant="outlined"
               
              color="primary"
              onClick={handleOrder}
              disabled={isOrdering}
            >
              {isOrdering ? <CircularProgress size={24} /> : 'Place Order'}
            </Button>
          </Grid>
              </Card>
            </Grid>
            
          </Grid>
        </Grid>

     </Grid>

        {/* Place Order Button */}
       {/*   <Grid 
          container 
          spacing={3} 
          justifyContent="center" 
          sx={{ marginTop: '20px', padding: { xs: '0 10px', md: '0 40px' } }}
        >
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOrder}
              disabled={isOrdering}
            >
              {isOrdering ? <CircularProgress size={24} /> : 'Place Order'}
            </Button>
          </Grid>
        </Grid> */}

        {/* Snackbar for success/error message */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={orderStatus?.includes('Error') ? 'error' : 'success'}
          >
            {orderStatus}
          </Alert>
        </Snackbar>
      </Grid>
      
      </Grid>
      <Footer />
    </>
  );
};

export default Checkout;
