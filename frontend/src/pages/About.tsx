import React, { useEffect, useState } from 'react';

import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';
import BookList from '../components/BookList';
import BookDetail from '../components/BookDetail';
import axios from 'axios';
import AboutUs from '../components/AboutUs';

interface User {
  id: number;
  username: string;
}

const About: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
        setLoading(false); // Stop loading once session check is done
      });
  }, []);

  // Function to add books to the cart, only if the user is logged in
  const addToCart = (book: any) => {
    if (!user) {
      alert("Please log in to add books to your cart.");
      return;
    }

    axios
      .post('http://localhost:8081/cart/add', {
        userId: user.id, // Pass the actual userId
        bookId: book.id,
        quantity: 1,
      })
      .then(() => {
        console.log('Book added to cart');
      })
      .catch((error) => {
        console.error('Error adding book to cart:', error);
      });
  };

  // Show loading while session data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Navbar */}
      <Navbar userId={user?.id ?? 0} username={user?.username || ''} loggedIn={loggedIn} />


      {/* Hero Section (you can add it back if needed) */}
      {/* <HeroSection /> */}

      {/* Book List Section 
      <BookList userId={user?.id ?? 0} addToCart={addToCart} />*/}
       <AboutUs />
      {/* Book Details */}
       

      {/* Footer Section */}
      <Footer />
    </>
  );
};

export default About;
