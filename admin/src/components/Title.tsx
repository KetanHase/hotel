import React from 'react';
import { TextField, InputLabel } from '@material-ui/core';
import PageTitle from './AddBook';
import { Stack } from '@mui/material';

export default function Form() {
  return (
     
      
     

    <div>
      
      <InputLabel shrink={true} htmlFor="outlined-basic">
        Outlined
      </InputLabel>
      <TextField id="outlined-basic" variant="outlined" />
    </div>
  );
}