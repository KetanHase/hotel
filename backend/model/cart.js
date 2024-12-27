const express = require('express');
const router = express.Router();

// Example cart items - This would typically be in a database
let cartItems = [
  { id: 1, title: 'Book 1', price: 10, quantity: 1 },
  { id: 2, title: 'Book 2', price: 15, quantity: 1 }
];

// Get cart items
router.get('/cart', (req, res) => {
  res.json(cartItems);
});

// Update cart item quantity
router.post('/cart/update', (req, res) => {
  const { id, quantity } = req.body;
  cartItems = cartItems.map(item =>
    item.id === id ? { ...item, quantity } : item
  );
  res.json({ success: true });
});

// Handle buying an item (for demonstration purposes, just logs it)
router.post('/cart/buy', (req, res) => {
  const { id } = req.body;
  console.log(`Item purchased with ID: ${id}`);
  res.json({ success: true });
});

module.exports = router;
