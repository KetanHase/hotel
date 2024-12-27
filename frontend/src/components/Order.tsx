import React, { useEffect, useState } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider, Box, Button } from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import Footer from './Footer';
import Navbar from './Navbar';

interface Order {
  order_id: number;
  address: string;
  city: string;
  postalCode: string;
  totalAmount: number;
  status: string;
  created_at: string;
  items: {
    name: string;
    quantity: number;
  }[];
} 

 

const Order = ({ user }: { user: any }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  useEffect(() => {
    axios
      .get('http://localhost:8081/check-session', { withCredentials: true })
      .then((response) => {
        setLoggedIn(response.data.loggedIn);
        if (response.data.user) {
          setCurrentUser(response.data.user);
        }
      })
      .catch(() => {
        setLoggedIn(false);
        setCurrentUser(null);
      });
       
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/orders/${user.id}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user.id]);


  return (
    <>
    <Navbar userId={user?.id ?? 0} username={user?.username || ''} loggedIn={loggedIn} />
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Orders for {user?.username}
      </Typography>
      
      <Divider sx={{ marginBottom: '20px' }} />

      <Typography variant="h6" gutterBottom>
        My Orders
      </Typography>

      {loading ? (
        <Typography>Loading orders...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : orders.length === 0 ? (
        <Typography>No orders yet.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)' }}>
          <Table aria-label="Orders Table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #ccc',width:50 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold',borderRight: '1px solid #ccc',width:50 }}>Items Name </TableCell>
                <TableCell sx={{ fontWeight: 'bold',borderRight: '1px solid #ccc',width:50 }}>Items Quantity</TableCell>
                <TableCell sx={{ fontWeight: 'bold',borderRight: '1px solid #ccc',width:50 }}>Total Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold',borderRight: '1px solid #ccc',width:50 }}>Order Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' ,borderRight: '1px solid #ccc',width:180}}>Addresss </TableCell>
                <TableCell sx={{ fontWeight: 'bold' ,borderRight: '1px solid #ccc',width:50}}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold',borderRight: '1px solid #ccc',width:5 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.order_id}>
                  <TableCell sx={{ borderRight: '1px solid #ccc',width:50 }}>{order.order_id}</TableCell>
                  
                  {/* Display items in a single cell */}
                  <TableCell sx={{ borderRight: '1px solid #ccc',width:50 }}>
                    {order.items.map((item, index) => (
                      <span key={index}>
                        {item.name}  {index < order.items.length - 1 && ', '}
                      </span>
                    ))}
                  </TableCell>

                  <TableCell sx={{ borderRight: '1px solid #ccc',width:50  }}>
                    {order.items.map((item, index) => (
                      <span key={index}>
                          {item.quantity}{index < order.items.length - 1 && ', '}
                      </span>
                    ))}
                  </TableCell>
                  
                  <TableCell sx={{ borderRight: '1px solid #ccc',width:50 }}>Rs {order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #ccc',width:50 }}>{moment(order.created_at).format('YYYY-MM-DD')}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #ccc',width:180 }}>
                  {order.address}, {order.city}, {order.postalCode}
                  </TableCell>
                  <TableCell sx={{ borderRight: '1px solid #ccc',width:50 }}>
                  {order.status.replace(/^'|'$/g, '')}
                  </TableCell>
                  <TableCell sx={{   width:5 }}>
                    <Button variant='outlined' size='small' sx={{width: 120 ,height:30,fontSize:10}} color='info'> Track Order</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
    <Footer />
    </>
  );
};

export default Order;
