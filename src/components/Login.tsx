import { useState, FormEvent, useEffect, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { TextField, Button, Typography, Box, Paper } from '@mui/material';

import { AppDispatch, RootState } from '../redux/store';
import { loginUser, logout } from '../redux/slices/authenticationSlice';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(logout());
        setUsername('');
        setPassword('');
    }, [dispatch]);

    const handleLogin = (event: FormEvent) => {
        event.preventDefault();

        dispatch(loginUser({ username, password })).then((res: any) => {
            if (res.meta.requestStatus === 'fulfilled') {
                const userRole = res.payload.role;
                userRole === 'admin' ? navigate('/admin') : navigate('/home');
            }
        });
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100vw',
                backgroundColor: '#f0f2f5',
                padding: '0 1rem'
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    padding: '2rem',
                    borderRadius: '12px',
                    width: '100%',
                    maxWidth: '400px',
                    boxSizing: 'border-box'
                }}
            >
                <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                        Welcome Back!
                    </Typography>
                    <TextField
                        label="Username"
                        fullWidth
                        required
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{
                            borderRadius: '8px',
                            '& .MuiOutlinedInput-root': { borderRadius: '8px' }
                        }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        required
                        variant="outlined"
                        value={password}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                        sx={{
                            borderRadius: '8px',
                            '& .MuiOutlinedInput-root': { borderRadius: '8px' }
                        }}
                    />
                    {error && (
                        <Typography color="error" align="center" sx={{ marginTop: '0.5rem' }}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{
                            padding: '0.75rem',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            marginTop: '1rem',
                            backgroundColor: '#007bff',
                            '&:hover': {
                                backgroundColor: '#0056b3'
                            }
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default Login;
