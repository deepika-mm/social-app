import { useState, useEffect, useCallback } from 'react';
import {
  Box, Container, AppBar, Toolbar, Typography, Avatar,
  IconButton, Tooltip, CircularProgress, Button,
} from '@mui/material';
import { LogoutRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

const COLORS = ['#667eea','#E85D04','#2D9CDB','#27AE60','#EB5757','#9B51E0','#F2994A','#764ba2'];
const getColor = (name = '') => COLORS[name?.charCodeAt(0) % COLORS.length];

export default function FeedPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [page, setPage]           = useState(1);
  const [hasMore, setHasMore]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = useCallback(async (pageNum, append = false) => {
    try {
      const { data } = await api.get(`/posts?page=${pageNum}&limit=10`);
      setPosts((prev) => append ? [...prev, ...data.posts] : data.posts);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error('Failed to fetch posts:', err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => { fetchPosts(1); }, [fetchPosts]);

  const handleCreated  = (newPost) => setPosts((prev) => [newPost, ...prev]);

  const handleLike = async (postId) => {
    try {
      const { data } = await api.post(`/posts/${postId}/like`);
      setPosts((prev) => prev.map((p) => p._id === postId ? { ...p, likes: data.likes } : p));
    } catch (err) { console.error(err); }
  };

  const handleComment = (postId, newComment) => {
    setPosts((prev) => prev.map((p) =>
      p._id === postId ? { ...p, comments: [...p.comments, newComment] } : p
    ));
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next); setLoadingMore(true);
    fetchPosts(next, true);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F0F2F9' }}>
      {/* navbar */}
      <AppBar position="sticky" elevation={0}
        sx={{ background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar sx={{ maxWidth: 680, width: '100%', mx: 'auto', px: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" fontWeight={800} sx={{ flex: 1, letterSpacing: '-0.3px', color: '#fff' }}>
            SocialApp
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.25)', width: 34, height: 34,
              fontSize: 14, fontWeight: 700, border: '2px solid rgba(255,255,255,0.6)' }}>
              {user?.username?.[0]?.toUpperCase()}
            </Avatar>
            <Typography fontSize={13} fontWeight={600} color="rgba(255,255,255,0.9)"
              sx={{ display: { xs: 'none', sm: 'block' } }}>
              @{user?.username}
            </Typography>
            <Tooltip title="Log out">
              <IconButton onClick={handleLogout} size="small" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                <LogoutRounded fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ pt: 3, pb: 6, px: { xs: 1.5, sm: 3 } }}>
        <CreatePost user={user} onCreated={handleCreated} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#667eea' }} />
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography fontSize={40} mb={1}>👋</Typography>
            <Typography fontWeight={700} fontSize={18} mb={0.5}>No posts yet</Typography>
            <Typography variant="body2" color="text.secondary">
              Be the first to share something!
            </Typography>
          </Box>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} currentUser={user}
                onLike={handleLike} onComment={handleComment} />
            ))}

            {hasMore && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button variant="outlined" onClick={loadMore} disabled={loadingMore}
                  sx={{ borderRadius: 5, px: 4, borderColor: '#667eea', color: '#667eea' }}>
                  {loadingMore ? <CircularProgress size={18} /> : 'Load more'}
                </Button>
              </Box>
            )}

            {!hasMore && posts.length > 0 && (
              <Typography textAlign="center" fontSize={13} color="text.secondary" mt={3}>
                You&apos;re all caught up! 🎉
              </Typography>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
