import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Alert, InputAdornment, IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, PeopleAltRounded } from '@mui/icons-material';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm]         = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login }               = useAuth();
  const navigate                = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      {/* left branding panel — hidden on mobile */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          p: 6,
        }}
      >
        <PeopleAltRounded sx={{ fontSize: 72, mb: 2, opacity: 0.9 }} />
        <Typography variant="h3" fontWeight={800} mb={1}>
          SocialApp
        </Typography>
        <Typography variant="h6" fontWeight={400} sx={{ opacity: 0.85, textAlign: 'center' }}>
          Connect with friends, share moments,<br />and explore what's happening
        </Typography>
      </Box>

      {/* right form panel */}
      <Box
        sx={{
          width: { xs: '100%', md: 460 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          bgcolor: '#F0F2F9',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          {/* mobile logo */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight={800} color="primary">
              SocialApp
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Connect and share with the world
            </Typography>
          </Box>

          <Card elevation={0} sx={{ border: '1px solid #E8EAF0' }}>
            <CardContent sx={{ p: 3.5 }}>
              <Typography variant="h5" fontWeight={700} mb={0.5}>
                Sign in
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Welcome back! Enter your details below
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth label="Email address" name="email" type="email"
                  value={form.email} onChange={handleChange} required sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth label="Password" name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password} onChange={handleChange} required sx={{ mb: 3 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPass((s) => !s)} edge="end">
                          {showPass ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit" variant="contained" fullWidth size="large"
                  disabled={loading}
                  sx={{
                    py: 1.4,
                    background: 'linear-gradient(90deg, #667eea, #764ba2)',
                    '&:hover': { background: 'linear-gradient(90deg, #5a6fd6, #6a3f91)' },
                  }}
                >
                  {loading ? 'Signing in…' : 'Sign in'}
                </Button>
              </form>

              <Typography mt={2.5} textAlign="center" variant="body2">
                Don&apos;t have an account?{' '}
                <Link to="/signup" style={{ color: '#667eea', fontWeight: 600, textDecoration: 'none' }}>
                  Create one free
                </Link>
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
