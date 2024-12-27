import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import { Link } from 'react-router-dom';


export const SidebarListItems = () => {
  const [openOrders, setOpenOrders] = React.useState(false);
  const [openCustomers, setOpenCustomers] = React.useState(false);

  const handleOrdersClick = () => {
    setOpenOrders(!openOrders);
  };

  const handleCustomersClick = () => {
    setOpenCustomers(!openCustomers);
  };

  return (
    <React.Fragment>
      <ListItemButton component={Link} to="/dashboard">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
         <ListItemText primary="Dashboard" /> 
      </ListItemButton>

      <ListItemButton component={Link} to="/order">
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Orders" />
        
      </ListItemButton>
       

      <ListItemButton component={Link} to="/customer" >
        <ListItemIcon>
          <ContactPageOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Customers" />
      </ListItemButton>
     
      <ListItemButton component={Link} to="/newcustomer" >
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="New Customers" />
      </ListItemButton>

      <ListItemButton component={Link} to="/category">
        <ListItemIcon>
          <ClassOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Category" /> 
      </ListItemButton>

      <ListItemButton component={Link} to="/menu">
        <ListItemIcon>
          <MenuBookOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Menu" /> 
      </ListItemButton>

      
     {/* <ListItemButton>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Integrations" />
      </ListItemButton>

      <ListSubheader component="div" inset>
        Saved reports
      </ListSubheader>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Current month" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Last quarter" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Year-end sale" />
      </ListItemButton>*/} 
    </React.Fragment>
  );
};