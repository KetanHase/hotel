import React, { useEffect, useState } from 'react';
import { IconButton, Badge, Menu, MenuItem } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import axios from 'axios';

interface Email {
  id: number;
  email: string; // Adjust based on your data structure
  added_date: string; // Date when the email was received
}

const EmailBadge: React.FC = () => {
  const [emailCount, setEmailCount] = useState<number>(0);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Fetch emails logic
  const fetchEmails = async () => {
    try {
      const response = await axios.get('http://localhost:8081/contactsemail');
      // Filter to get only newly received emails
      const newEmails = response.data.filter((email: Email) => {
        const emailDate = new Date(email.added_date);
        const now = new Date();
        return (now.getTime() - emailDate.getTime()) < 5 * 60 * 1000; // Last 5 minutes
      });

      setEmails(newEmails);
      setEmailCount(newEmails.length); // Set the count based on newly received emails
    } catch (err) {
      setError('Failed to fetch emails');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Clear notifications
  const clearNotifications = () => {
    setEmailCount(0);
    setEmails([]);
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

  // Fetch emails when component mounts
  useEffect(() => {
    fetchEmails();
    
    // Optionally, set an interval to periodically check for new emails
    const interval = setInterval(fetchEmails, 10000); // Fetch emails every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  if (loading) return <div>Loading...</div>; // Optional loading state
  if (error) return <div>{error}</div>; // Optional error state

  return (
    <>
      <IconButton color="inherit" onClick={handleMenuClick}>
        <Badge badgeContent={emailCount} color="secondary">
          <MailIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {emailCount > 0 ? (
          <MenuItem onClick={handleMenuClose}>
            New email(s) received: {emailCount} {/* Display notification message */}
          </MenuItem>
        ) : (
          <MenuItem onClick={handleMenuClose}>No new emails</MenuItem>
        )}
      </Menu>
    </>
  );
};

export default EmailBadge;
