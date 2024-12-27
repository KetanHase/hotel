import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Footer: React.FC = (props: any) => {
    return (
      <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 2,
        backgroundColor: 'background.paper',
        boxShadow: 3,
        zIndex: 1000,
      }}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        {'Copyright ©    '}
        <Link color="inherit" underline='none' href="/">
          Book Store
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </Box>
      );
};

export default Footer;