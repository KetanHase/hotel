import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, Typography, CircularProgress, Box } from '@mui/material';
import axios from 'axios';

interface Item {
  name: string;
  quantity: number;
}

interface Order {
  order_id: number;
  address: string;
  city: string;
  postalCode: string;
  totalAmount: number;
  created_at: string;
  status: string;
  items: {
    name: string;
    quantity: number;
  }[];
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8081/admin/orders');
        //console.log('Fetched orders:', response.data);
        setOrders(response.data);
        //console.log('response.data',response.data);
      } catch (err) {
        setError('Failed to fetch orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = (orderId: number, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.order_id === orderId ? { ...order, status: newStatus } : order
      )
    );

    // Send updated status to the server
    axios.put(`http://localhost:8081/admin/orders/${orderId}`, { status: newStatus })
      .then(() => {
        console.log('Order status updated successfully');
      })
      .catch((err) => {
        console.error('Error updating status:', err);
      });
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Order List
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Ship To</TableCell>
              <TableCell>Items Name</TableCell>
              <TableCell>Items Quantity</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.order_id}>
                <TableCell>{order.order_id}</TableCell>
                <TableCell>{order.address}, {order.city}, {order.postalCode}</TableCell>
                
                {/* Display items in a single cell */}
                <TableCell>
                  {order.items.map((item, index) => (
                    <span key={index}>
                      {item.name}  {index < order.items.length - 1 && ', '}
                    </span>
                  ))}
                </TableCell>

                <TableCell>
                  {order.items.map((item, index) => (
                    <span key={index}>
                         {item.quantity}{index < order.items.length - 1 && ', '}
                    </span>
                  ))}
                </TableCell>

                <TableCell>Rs {order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                
                {/* Status dropdown */}
                <TableCell>
                  <Select
                  
                    value={order.status || "Completed"}
                    onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                    variant="outlined"
                    fullWidth
                    sx={{ width: '120px', height: '40px' }}
                  >
                     <MenuItem value={order.status}>{order.status}</MenuItem>
                    <MenuItem value="Shipped">Shipped</MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
                  </Select>
                   
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default OrderList;
