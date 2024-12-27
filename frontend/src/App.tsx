import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

import LandingPage from './pages/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Book from './pages/Book';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Orders from './components/Order';
import About from './pages/About';
import Contact from './pages/Contact';
 

interface User {
  id: number;
  username: string;
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Loading state to wait for session check

  const navigate = useNavigate();

  // Check if the user is logged in when the app loads
  useEffect(() => {
    axios
      .get('http://localhost:8081/check-session', { withCredentials: true })
      .then((response) => {
        setLoggedIn(response.data.loggedIn);
        if (response.data.user) {
          setUser(response.data.user as User);
        }
      })
      .catch(() => {
        setLoggedIn(false);
        setUser(null);
      })
      .finally(() => {
        setLoading(false); // Once the session is checked, stop loading
      });
  }, []);

  // Function to handle proceeding to checkout
  const handleProceedToCheckout = () => {
    if (!loggedIn) {
      navigate('/login'); // Redirect to login if not logged in
    } else {
      navigate('/checkout'); // Proceed to checkout if logged in
    }
  };

  // If still checking session, render loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage    />} />
      <Route path="/menu" element={ <Book />  } />
      <Route path="/login" element={loggedIn ? <Navigate to="/" /> : <Login  />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={ <About />  } />
      <Route path="/contact" element={ <Contact />  } />

      <Route path="/book/:id" element={<Book />} />

      {/* Cart route where users can add items to the cart without logging in */}
      <Route
        path="/cart"
        element={loggedIn ? <Cart  userId={user ? user.id : 0} proceedToCheckout={handleProceedToCheckout}  /> : <Navigate to="/login" /> }
      />

      {/* Checkout and Orders routes require login */}
      <Route path="/checkout" element={loggedIn ? <Checkout userId={user ? user.id : 0}/> : <Navigate to="/login" />} />
      <Route path="/orders" element={loggedIn ? <Orders user={user} /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
