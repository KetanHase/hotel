import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

interface BookCardProps {
  id: number;
  title: string;
  price: number;
  onAddToCart: (id: number) => void;
}

const BookCard: React.FC<BookCardProps> = ({ id, title, price, onAddToCart }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{title}</Typography>
        <Typography>${price.toFixed(2)}</Typography>
        <Button variant="contained" color="primary" onClick={() => onAddToCart(id)}>
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookCard;
