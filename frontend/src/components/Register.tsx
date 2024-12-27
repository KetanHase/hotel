import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
 
import { TextField, Button, Container, Typography, Box, Card, Checkbox, FormControlLabel, Link } from '@mui/material';
 
import Grid from '@mui/material/Grid'; // Import Grid2

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8081/register', 
                { username, password }
            );

            if (response.data.success) {
                setMessage('Registration successful. Please log in.');
                navigate('/');
            } else {
                setMessage(response.data.message || 'Registration failed.');
            }
        } catch (error) {
            setMessage('Registration failed.');
        }
    };

    return (
        <>
            
        <Container maxWidth="xs">
        <Card variant="outlined" sx={{ padding: 4, mt: 8 }}>
            <Box display="flex" justifyContent="center" mb={2}>
                {/* Sitemark logo here 
                <img src="/path-to-your-logo.png" alt="Sitemark" style={{ height: '40px' }} />*/}
                <Typography variant='h5'>Book Store Register</Typography>
            </Box>
            <Typography variant="h5" component="h1" align="center" gutterBottom>
                Register
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            //value={email}
                            //onChange={(e) => setEmail(e.target.value)}
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
                               { /*Forgot your password? */}
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
                           Register
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography align="center">
                            You  have an alerdly registerd ? <Link href="/login" variant="body2">Login</Link>
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

export default Register;
