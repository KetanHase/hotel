import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import axios from 'axios';
import './index.css';
import Book from './pages/Book';
import Register from './pages/Registeruser';
import Login from './pages/LoginPage';
import Category from './pages/Category';
import Language from './pages/Language';
import Order from './pages/Order';
import Customer from './pages/Customer';
import CustomerEmail from './pages/CustomerEmail';

interface User {
    id: number;
    username: string;
}

const App: React.FC = () => {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await axios.get('http://localhost:8081/check-session', { withCredentials: true });
                setLoggedIn(response.data.loggedIn);
                if (response.data.user) {
                    setUser(response.data.user as User);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Session check failed:', error);
                setLoggedIn(false);
                setUser(null);
            }
        };

        checkSession();
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={loggedIn ? <Navigate to="/dashboard" /> : <Login />} />
                <Route path="/dashboard" element={loggedIn ? <Dashboard /> : <Navigate to="/" />} />
                <Route path="/menu" element={loggedIn ? <Book /> : <Navigate to="/" />} />
                <Route path="/category" element={loggedIn ? <Category /> : <Navigate to="/" />} />
                <Route path="/language" element={loggedIn ? <Language /> : <Navigate to="/" />} />
                <Route path="/order" element={loggedIn ? <Order /> : <Navigate to="/" />} />
                <Route path="/customer" element={loggedIn ? <Customer /> : <Navigate to="/" />} />
                <Route path="/newcustomer" element={loggedIn ? <CustomerEmail /> : <Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
