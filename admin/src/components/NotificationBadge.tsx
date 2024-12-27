import React, { useEffect, useState } from 'react';
import { IconButton, Badge, Menu, MenuItem } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';

interface Order {
  id: number;
  user_id: number;
  created_at: string;
}

const NotificationBadge: React.FC = () => {
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Fetch orders logic
  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8081/admin/orders');
      // Filter to get only newly added orders
      const newOrders = response.data.filter((order: Order) => {
        const orderDate = new Date(order.created_at);
        const now = new Date();
        return (now.getTime() - orderDate.getTime()) < 5 * 60 * 1000; // 1 minute
      });

      setOrders(newOrders);
      setNotificationCount(newOrders.length); // Set the count based on newly added orders
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Clear notifications
  const clearNotifications = () => {
    setNotificationCount(0);
    setOrders([]);
  };

  // Open dropdown
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Close dropdown
  const handleMenuClose = () => {
    setAnchorEl(null);
    clearNotifications(); // Clear notifications when menu is closed
  };

  // Fetch orders when component mounts
  useEffect(() => {
    fetchOrders();
    
    // Optionally, set an interval to periodically check for new orders
    const interval = setInterval(fetchOrders, 10000); // Fetch orders every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  if (loading) return <div>Loading...</div>; // Optional loading state
  if (error) return <div>{error}</div>; // Optional error state

  return (
    <>
      <IconButton color="inherit" onClick={handleMenuClick}>
        <Badge badgeContent={notificationCount} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {notificationCount > 0 ? (
          <MenuItem onClick={handleMenuClose}>
            New order received: {notificationCount} {/* Display notification message */}
          </MenuItem>
        ) : (
          <MenuItem onClick={handleMenuClose}>No new orders</MenuItem>
        )}
      </Menu>
    </>
  );
};

export default NotificationBadge;
