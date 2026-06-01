import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Alert, InputAdornment, IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, PeopleAltRounded } from '@mui/icons-material';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const [form, setForm]         = useState({ username: '', email: '', password: '' });
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
    if (form.username.length < 3) return setError('Username must be at least 3 characters');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', form);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Try again.');
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
      {/* left panel */}
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
        <Typography variant="h3" fontWeight={800} mb={1}>SocialApp</Typography>
        <Typography variant="h6" fontWeight={400} sx={{ opacity: 0.85, textAlign: 'center' }}>
          Join thousands of people sharing<br />their stories every day
        </Typography>
      </Box>

      {/* right form */}
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
          <Box sx={{ display: { xs: 'block', md: 'none' }, textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight={800} color="primary">SocialApp</Typography>
            <Typography variant="body2" color="text.secondary">Join the community</Typography>
          </Box>

          <Card elevation={0} sx={{ border: '1px solid #E8EAF0' }}>
            <CardContent sx={{ p: 3.5 }}>
              <Typography variant="h5" fontWeight={700} mb={0.5}>Create account</Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Free forever. No credit card needed.
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth label="Username" name="username"
                  value={form.username} onChange={handleChange}
                  required helperText="Min 3 characters" sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth label="Email address" name="email" type="email"
                  value={form.email} onChange={handleChange} required sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth label="Password" name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password} onChange={handleChange}
                  required helperText="Min 6 characters" sx={{ mb: 3 }}
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
                  {loading ? 'Creating account…' : 'Create account'}
                </Button>
              </form>

              <Typography mt={2.5} textAlign="center" variant="body2">
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#667eea', fontWeight: 600, textDecoration: 'none' }}>
                  Sign in
                </Link>
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
