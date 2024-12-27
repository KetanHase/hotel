// Dashboard.tsx
import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Header from '../components/Header';  
import Sidebar from '../components/Sidebar';  
import Footer from '../components/Footer';  
import { Toolbar, Typography } from '@mui/material';
import Orders from '../components/Orders';
import Form from '../components/Title';
import { useMediaQuery } from '@material-ui/core';
 
import BookList from '../components/BookList';
import axios from 'axios';
import OrderList from '../components/OrderList';
import ContactTable from '../components/ContactTable';
 

interface user {
  id: number;
  username: string;
}



 

const defaultTheme = createTheme();

export default function Customer() {
  const [open, setOpen] = React.useState(true);
  const [user, setUser] = React.useState<user | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const toggleDrawer = () => {
    setOpen(!open);
  };
  React.useEffect(() => {
    if (isMobile) {
      setOpen(false);  
    }
  }, [isMobile]);

  React.useEffect(() => {
    // Fetch the user data from the session or API
    axios.get('http://localhost:8081/check-session', { withCredentials: true })
        .then(response => {
            setUser(response.data.user);
        })
        .catch(error => {
            console.error('Error fetching user:', error);
        });
}, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Header  open={open} toggleDrawer={toggleDrawer} user={user} /> {/* Use Header component */}
        <Sidebar open={open} toggleDrawer={toggleDrawer} /> {/* Use Sidebar component */}
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
            paddingBottom: '60px',
          }}
        > 
        <Toolbar />

        {/*Dashboard Contain Start */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} lg={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    
                  }}
                >
                 <ContactTable />
                </Paper>
              </Grid>
              {/*Start Seperate Component */}
              <Grid item xs={12} md={8} lg={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    
                  }}
                >
                </Paper>
              </Grid>
              {/*End Seperate Component */}
              {/*Start Seperate Component */}
              <Grid item xs={12} md={8} lg={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    
                  }}
                >
             
                </Paper>
              </Grid>
              {/*End Seperate Component */}
            </Grid>
          </Container>
        {/*Dashboard Contain End */}
           
          <Footer />
        </Box>  
      </Box>
    </ThemeProvider>
  );
}
