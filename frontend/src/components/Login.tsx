import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, Grid, Card, Checkbox, FormControlLabel, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';
import Footer from './Footer';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<string | null>(null);
     
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

      {/*  if (username !== 'admin') {
            toast.error('Access denied. Only admin can log in.', { position: "top-right" });
            return;
        }*/}

        try {
            const response = await axios.post('http://localhost:8081/login', 
                { username, password },
                { withCredentials: true }
            );
            console.log(response.data);  
            if (response.data.success) {
                 
                toast.success('Login Successful!', { position: "top-right" });
                //alert('login Sucessfull');
                //navigate('/dashboard');
                window.location.href = '/';
            } else {
                //setMessage(response.data.message || 'Login failed. Please check your credentials.');
                toast.error(response.data.message || 'Login failed. Please check your credentials.', { position: "top-right" });
            }
        } catch (error) {
            toast.error('Login failed. Please check your credentials.', { position: "top-right" });
        }
    };

    return (
        <>
            
        <Container maxWidth="xs">
        
        <Card variant="outlined" sx={{ padding: 4, mt: 8 }}>
            <Box display="flex" justifyContent="center" mb={2}>
                {/* Sitemark logo here 
                <img src="/path-to-your-logo.png" alt="Sitemark" style={{ height: '40px' }} />*/}
                <Typography variant='h5'>Tomato User Login</Typography>
            </Box>
            <Typography variant="h5" component="h1" align="center" gutterBottom>
                Sign in
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="space-between">
                            <FormControlLabel
                                control={<Checkbox name="remember" color="primary" />}
                                label="Remember me"
                            />
                            <Link href="#" variant="body2" sx={{ mt: 1 }}>
                                Forgot your password?
                            </Link>
                        </Box>
                    </Grid>
                    {/*{message && (
                        <Grid item xs={12}>
                            <Typography color="error" align="center">{message}</Typography>
                        </Grid>
                    )}*/}
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Sign in
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography align="center">
                            Don't have an account? <Link href="/register" variant="body2">Sign up</Link>
                        </Typography>
                    </Grid>
                </Grid>
            </form>
        </Card> 
    </Container>
    
    <ToastContainer />
     
    </>
           
    );
};

export default Login;
