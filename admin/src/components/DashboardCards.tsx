import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { Book, ShoppingCart, Language, Category, ContactMail, People } from '@mui/icons-material';
import axios from 'axios';

const DashboardCards: React.FC = () => {
  // State to hold the counts for each table
  const [counts, setCounts] = useState({
    books: 0,
    orders: 0,
    language: 0,
    category: 0,
    contact: 0,
    users: 0
  });

  // Fetch counts from backend
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const { data } = await axios.get('http://localhost:8081/dashboardCounts'); // API endpoint to get counts
        setCounts(data);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);

  // Array to define card properties like color, title, icon, and count keys
  const cardDetails = [
    { title: 'Menu', icon: <Book />, color: '#ff6f61', countKey: 'books' },
    { title: 'Orders', icon: <ShoppingCart />, color: '#42a5f5', countKey: 'orders' },
    
    { title: 'Categories', icon: <Category />, color: '#ffa726', countKey: 'category' },
    { title: 'Contacts', icon: <ContactMail />, color: '#ab47bc', countKey: 'contact' },
    { title: 'Users', icon: <People />, color: '#ef5350', countKey: 'users' }
  ];

  return (
    <Grid container spacing={2} justifyContent="center">
      {cardDetails.map((card, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card sx={{ backgroundColor: card.color, color: '#fff' }}>
            <CardContent>
              <Typography variant="h5" component="div">
                {card.icon} {card.title}
              </Typography>
              <Typography variant="h4" component="div">
                {counts[card.countKey as keyof typeof counts]} {/* Display the count */}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardCards;
