import { useState, useRef } from 'react';
import {
  Box, Card, CardContent, CardActions, Avatar, TextField,
  IconButton, Button, Divider, CircularProgress, Tooltip, Typography, Stack,
} from '@mui/material';
import { AddPhotoAlternateOutlined, SendRounded, CloseRounded } from '@mui/icons-material';
import api from '../api/axios';

const COLORS = ['#667eea','#E85D04','#2D9CDB','#27AE60','#EB5757','#9B51E0','#F2994A','#764ba2'];
const getColor = (name = '') => COLORS[name?.charCodeAt(0) % COLORS.length];

export default function CreatePost({ user, onCreated }) {
  const [text, setText]       = useState('');
  const [image, setImage]     = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const fileRef               = useRef();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB'); return; }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError('');
  };

  const removeImage = () => {
    setImage(null); setPreview('');
    fileRef.current.value = '';
  };

  const handlePost = async () => {
    if (!text.trim() && !image) return;
    setLoading(true); setError('');
    try {
      const fd = new FormData();
      if (text.trim()) fd.append('text', text.trim());
      if (image) fd.append('image', image);
      const { data } = await api.post('/posts', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      onCreated(data);
      setText(''); removeImage();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not publish post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 2.5, borderRadius: 3 }}>
      <CardContent sx={{ pb: 1 }}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Avatar sx={{ bgcolor: getColor(user?.username), width: 44, height: 44, fontWeight: 700, fontSize: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            {user?.username?.[0]?.toUpperCase()}
          </Avatar>
          <Box flex={1}>
            <TextField fullWidth multiline minRows={2} maxRows={6}
              placeholder={`What's on your mind, ${user?.username}?`}
              value={text} onChange={(e) => setText(e.target.value)}
              variant="standard" InputProps={{ disableUnderline: true }}
              sx={{ fontSize: 15 }}
            />
            {preview && (
              <Box sx={{ mt: 1.5, position: 'relative', display: 'inline-block' }}>
                <Box component="img" src={preview} alt="preview"
                  sx={{ maxHeight: 220, maxWidth: '100%', borderRadius: 2, display: 'block', border: '1px solid #E8EAF0' }} />
                <IconButton size="small" onClick={removeImage}
                  sx={{ position: 'absolute', top: 6, right: 6, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}>
                  <CloseRounded fontSize="small" />
                </IconButton>
              </Box>
            )}
            {error && <Typography variant="caption" color="error" display="block" mt={0.5}>{error}</Typography>}
          </Box>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions sx={{ px: 2, py: 1, justifyContent: 'space-between' }}>
        <Tooltip title="Add a photo">
          <IconButton color="primary" onClick={() => fileRef.current.click()}>
            <AddPhotoAlternateOutlined />
          </IconButton>
        </Tooltip>
        <input type="file" hidden accept="image/*" ref={fileRef} onChange={handleFileSelect} />
        <Button variant="contained" size="small"
          endIcon={loading ? null : <SendRounded />}
          disabled={(!text.trim() && !image) || loading}
          onClick={handlePost}
          sx={{ borderRadius: 5, px: 3, background: 'linear-gradient(90deg, #667eea, #764ba2)',
            '&:hover': { background: 'linear-gradient(90deg, #5a6fd6, #6a3f91)' } }}>
          {loading ? <CircularProgress size={18} color="inherit" /> : 'Post'}
        </Button>
      </CardActions>
    </Card>
  );
}
