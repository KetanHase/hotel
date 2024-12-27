import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import { Book } from '../interfaces/Book';

interface ViewBookDialogProps {
  open: boolean;
  book: Partial<Book> | null;
  onClose: () => void;
}

const ViewBookDialog: React.FC<ViewBookDialogProps> = ({ open, book, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Book Details</DialogTitle>
      <DialogContent>
        {book ? (
          <Grid container spacing={2}>
            {/* Image Section */}
            <Grid item xs={12} md={6} display="flex" justifyContent="center">
              <Box
                component="img"
                src={`http://localhost:8081/uploads/${book.imageFile}`} // Fallback image
                alt="Book Cover"
                sx={{
                  maxHeight: '300px', // Adjust height as necessary
                  maxWidth: '100%',
                  objectFit: 'cover',
                }}
              />
            </Grid>
            {/* Book Information Section */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Book Name: {book.name}</Typography>
              <Typography variant="body1">Price: RS.{book.price}</Typography>
              <Typography variant="body1">Author: {book.author}</Typography>
              <Typography variant="body1">Stock: {book.stock}</Typography>
              <Typography variant="body1">Category: {book.category_name}</Typography>
              <Typography variant="body1">Language: {book.language_name}</Typography>
              <Typography variant="body1">Status: {book.status}</Typography>
            </Grid>
          </Grid>
        ) : (
          <Typography variant="body1">No book selected</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewBookDialog;
