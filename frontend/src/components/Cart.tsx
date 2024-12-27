import React, { useEffect, useState } from 'react';
import {
  Button, Typography, List, ListItem, ListItemText, Grid, Box, Divider, IconButton, TextField, Paper
} from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import Navbar from './Navbar';
import Footer from './Footer';
 
 


interface CartItem {
  itemId: number;
  name: string;
  price: number;
  quantity: number;
  author: string; // Assuming you have author data
  imageFile: string;  // Assuming you have an image URL
  discount: number; // Assuming you have a discount percentage
}

interface CartProps {
  userId: number;
  proceedToCheckout: () => void;
}

interface User {
  id: number;
  username: string;
}

const Cart: React.FC<CartProps> = ({ userId, proceedToCheckout }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
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
      })
      .finally(() => {
        setLoading(false); // Stop loading once session check is done
      });
  }, []);

  useEffect(() => {
    
    axios.get(`http://localhost:8081/cart/${userId}`)
      .then((response) => {
        setItems(response.data.cartItems);
       // console.log('response.data.cartItems',response.data.cartItems);
        setTotalAmount(response.data.totalAmount);
      })
      .catch(error => {
        console.error('Error fetching cart data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  const handleRemove = async (itemId: number) => {
    console.log('Cart item ID :', itemId);
    try {
      await axios.delete(`http://localhost:8081/cart/remove/${itemId}`); 
      console.log('Cart item removed');
      // Update the cart state to remove the item
      setItems((prevItems) => prevItems.filter(item => item.itemId !== itemId));
      // Optionally, update totalAmount
      setTotalAmount(prevAmount => prevAmount - (items.find(item => item.itemId === itemId)?.price || 0));
    } catch (err) {
      console.error('Error deleting the cart item:', err);
    }
  };
   
  const handleWishlist = (id: number) => {
    // Logic to move item to wishlist
  };

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.itemId === itemId ? { ...item, quantity: Math.max(newQuantity, 1) } : item
      )
    );
    axios.post('http://localhost:8081/cart/update', {
      bookId: itemId,
      quantity: Math.max(newQuantity, 1),
    })
    .then((response) => {
      console.log('Quantity updated successfully:', response.data);
    })
    .catch((error) => {
      console.error('Error updating quantity in the database:', error);
    });
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    
      
    <>
    <Navbar userId={user?.id ?? 0} username={user?.username || ''} loggedIn={loggedIn} />
      <Grid container spacing={4} padding={2}>
         
      <Grid item xs={12} md={12}>
      <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Paper variant="outlined"> 
      <Box padding={2}>
      <Typography variant="h4" gutterBottom>Cart Items</Typography>
      {items.length === 0 ? (
        <Typography>No items in cart.</Typography>
      ) : (
        <List>
          {items.map((item) => (
            <ListItem key={item.itemId} divider>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} sm={4} md={2}>
                  <img src={`http://localhost:8081/uploads/${item.imageFile}`} alt={item.name} style={{ width: '100%', height: '100px' }} />
                </Grid>
                <Grid item xs={12} sm={8} md={6} lg={4}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2" color="textSecondary">By: {item.author}</Typography>
                  <Typography variant="body2" color="error">
                    ₹{item.price} <span style={{ textDecoration: 'line-through' }}>₹{item.price + (item.price * (item.discount / 100))}</span> 
                    <span style={{ color: 'green', marginLeft: '10px' }}>{item.discount}% OFF</span>
                  </Typography>
                  <Typography variant="body2">Total Price: ₹{item.price * item.quantity}</Typography>
                </Grid>
                <Grid item xs={8} sm={4} md={2} lg={4}>
                  <Box display="flex" alignItems="center" justifyContent="center" width="100%">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleQuantityChange(item.itemId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    <TextField
                      value={item.quantity}
                      variant="outlined"
                      size="small"
                      inputProps={{ style: { textAlign: 'center' } }}
                      style={{ width: '50px', margin: '0 10px' }}
                      onChange={(e) => handleQuantityChange(item.itemId, parseInt(e.target.value))}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleQuantityChange(item.itemId, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={4} sm={4} md={2} lg={2}>
                  <IconButton onClick={() => handleRemove(item.itemId)}>
                    <DeleteIcon color="error" />
                    <Typography>Remove</Typography>
                  </IconButton>
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
      )}</Box>
           </Paper>
      </Grid>
      <Divider />
      <Grid item xs={12} md={4}>
      {items.length > 0 ? (
  <Paper variant="outlined">
    <Box padding={2}>
      <Grid container justifyContent="space-between" alignItems="center">
        {/* Content Name (Total Items) */}
        <Grid item xs={6}>
          <Typography variant="body1">Total Items:-</Typography>
        </Grid>
        {/* Price */}
        <Grid item xs={6} style={{ textAlign: 'right' }}>
          <Typography variant="body1">{items.length}</Typography>
        </Grid>
      </Grid>

      {/* Divider */}
      <Divider style={{ margin: '20px 0' }} />

      {/* Sub Total */}
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs={6}>
          <Typography variant="body1">Sub Total:-</Typography>
        </Grid>
        <Grid item xs={6} style={{ textAlign: 'right' }}>
          <Typography variant="body1">₹{totalAmount}</Typography>
        </Grid>
      </Grid>

      {/* Divider */}
      <Divider style={{ margin: '20px 0' }} />

      {/* Total Gross */}
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs={6}>
          <Typography variant="body1">Total Gross:-</Typography>
        </Grid>
        <Grid item xs={6} style={{ textAlign: 'right' }}>
          <Typography variant="body1">₹{totalAmount}</Typography>
        </Grid>
      </Grid>

      {/* Divider */}
      <Divider style={{ margin: '20px 0' }} />

      {/* Amount Payable */}
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs={6}>
          <Typography variant="h6">Amount Payable:-</Typography>
        </Grid>
        <Grid item xs={6} style={{ textAlign: 'right' }}>
          <Typography variant="h6" color="primary">₹{totalAmount}</Typography>
        </Grid>
      </Grid>

      {/* Proceed to Pay Button */}
      <Divider style={{ margin: '20px 0' }} />
      <Box textAlign="center" mt={2}>
        <Button
          variant="outlined"
          fullWidth
          size='small'
          onClick={proceedToCheckout}
          sx={{
            '&:hover': {
              backgroundColor: '#FDC900',
            },
            borderRadius: '8px',
            padding: '12px 20px',
            textTransform: 'none',
            fontSize: '16px',
          }}
        >
          Proceed To Pay
        </Button>
      </Box>
      <Typography variant="body2" color="textSecondary" align="right" style={{ marginTop: '10px' }}>
        Shipping (India): Free | Ships within 2 hours
      </Typography>
    </Box>
  </Paper>
) : (
  <Typography variant="body1" color="textSecondary" align="center">
    Your cart is empty.
  </Typography>
)}

      </Grid>
    </Grid>
    <Footer />
    </>
    
  );
   
};


export default Cart;
