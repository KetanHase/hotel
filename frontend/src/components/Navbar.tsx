import React,{useEffect, useState} from 'react';
import {
  AppBar,
  Grid,
  Toolbar,
  Typography,
  Button,
  Drawer,
  Box,
  Link,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Badge,
  Avatar, Menu, MenuItem, Snackbar, Alert
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import axios from 'axios';
import useCartData from '../api/useCartData';
//import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
 
interface NavProps {
  userId: number;
  loggedIn: boolean;
  username: string;
   
}

const Navbar: React.FC<NavProps> = ({ userId, loggedIn,username  } ) => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const { cartCount } = useCartData(userId);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state

    const toggleDrawer = (open: boolean) => () => {
        setDrawerOpen(open);
      };
      const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleMenuClose = () => {
        setAnchorEl(null);
      };

      const handleLogout = async () => {
        await axios.post('http://localhost:8081/logout', {}, { withCredentials: true });
        //window.confirm('Are Sure Logout');
         
        setSnackbarOpen(true);
        console.log('Logout Sucessfully');
        window.location.href='/';
        //navigate('/'); 
      };

      const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
        setSnackbarOpen(false);
         // Close snackbar
      };

      const navigate = useNavigate();

  const handleOrdersClick = () => {
    handleMenuClose(); // Close the menu
    navigate('/orders'); // Navigate to orders page
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="sticky" sx={{ backgroundColor: '#DDE1E5', 
                                    color: '#343a40', 
                                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link href="/" underline="none">
          <Typography
            variant="h6"
            component="div"
           
            sx={{ fontWeight: 'bold', fontSize: '24px', color: '#FFA500', display: 'inline-block' }}
          >
            Tomato.
          </Typography></Link>

          {/* Navigation Links */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' }, // Hide links on small screens, show on medium and above
              gap: '20px',
              alignItems: 'center',
            }}
          >
            <Link href="/" underline="none" color="inherit" sx={{ fontSize: '16px' }}>
              Home
            </Link>
            <Link href="/menu" underline="none" color="inherit" sx={{ fontSize: '16px' }}>
              Menu
            </Link>
            <Link href="/about" underline="none" color="inherit" sx={{ fontSize: '16px' }}>
              About
            </Link>
            <Link href="/contact" underline="none" color="inherit" sx={{ fontSize: '16px' }}>
              Contact
            </Link>
           {/*  <Link href="#" underline="none" color="inherit" sx={{ fontSize: '16px' }}>
              FAQ
            </Link>
            <Link href="#" underline="none" color="inherit" sx={{ fontSize: '16px' }}>
              Blog
            </Link>*/}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ display: { xs: 'inline-flex', md: 'none' } }} // Show menu icon on mobile screens only
          >
            <MenuIcon />
          </IconButton>

          {/* Sign In and Sign Up buttons */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: '10px' }}>
             <IconButton href='/cart'>
             <Badge badgeContent={cartCount} color="secondary">
              <ShoppingCartOutlinedIcon />
              </Badge>
              </IconButton>
              {!loggedIn ? (
            <Button variant="outlined" href="/login" size="small" sx={{ backgroundColor: '#', color: '#', fontSize: '12px' ,'&:hover': {
                    backgroundColor: '#0056b3',  
                    color: '#fff'  
                } }}>
              Sign In
            </Button>
            ) : (
              <>
                {/* Profile Icon */}
                <IconButton onClick={handleProfileClick}>
                  <Typography variant='body2'> welcome! {username}</Typography>
                  <Avatar></Avatar>
                </IconButton>
                {/* Dropdown Menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                   <MenuItem onClick={handleOrdersClick} >
                    My Orders
                  </MenuItem> 
                  <MenuItem onClick={handleLogout} >Logout</MenuItem>
                </Menu>
              </>
            )}
            <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // Automatically hide after 3 seconds
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Position at top-right
      >
        <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: '100%' }}>
         Logout successfully!
        </Alert>
      </Snackbar>
          </Box>
        </Toolbar>
      </AppBar>
       
      <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            
           
          <ListItem disablePadding>
            <ListItemButton href='/login'>
            <Button variant='outlined' color='info'>Signin</Button> 
            <Button variant='outlined' color='error' sx={{displsy:'flex-end', margin:2}}>LogOut</Button> 
            </ListItemButton>
          </ListItem>
         
            <ListItem disablePadding>
              <ListItemButton href="/">
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton href="/book">
                <ListItemText primary="Book" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton href="/about">
                <ListItemText primary="About" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton href="/contact">
                <ListItemText primary="Contact" />
              </ListItemButton>
            </ListItem>
             
             
          </List>
        </Box>
      </Drawer>
      {/* Hero Section */}
    
    </>
  );
};

export default Navbar;
