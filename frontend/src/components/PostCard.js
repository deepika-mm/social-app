import { useState } from 'react';
import {
  Card, CardContent, CardMedia, CardActions, Avatar, Box, Typography,
  IconButton, TextField, Collapse, Stack, Divider, Tooltip, CircularProgress, Chip,
} from '@mui/material';
import {
  FavoriteRounded, FavoriteBorderRounded,
  ChatBubbleOutlineRounded, SendRounded,
} from '@mui/icons-material';
import api from '../api/axios';

const COLORS = ['#667eea','#E85D04','#2D9CDB','#27AE60','#EB5757','#9B51E0','#F2994A','#764ba2'];
const getColor = (name = '') => COLORS[name.charCodeAt(0) % COLORS.length];

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export default function PostCard({ post, currentUser, onLike, onComment }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const liked = post.likes.includes(currentUser?.username);

  const handleComment = async () => {
    const text = commentText.trim();
    if (!text) return;
    setSubmitting(true);
    try {
      const { data } = await api.post(`/posts/${post._id}/comment`, { text });
      onComment(post._id, data.comment);
      setCommentText('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card sx={{ mb: 2, borderRadius: 3, overflow: 'hidden' }}>
      <CardContent sx={{ pb: 1 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
          <Avatar sx={{ bgcolor: getColor(post.username), width: 46, height: 46, fontWeight: 700, fontSize: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            {post.username?.[0]?.toUpperCase()}
          </Avatar>
          <Box flex={1}>
            <Typography fontWeight={700} fontSize={14}>@{post.username}</Typography>
            <Typography fontSize={12} color="text.secondary">{timeAgo(post.createdAt)}</Typography>
          </Box>
        </Stack>
        {post.text && (
          <Typography fontSize={15} lineHeight={1.75} sx={{ whiteSpace: 'pre-wrap', mb: post.image ? 1.5 : 0 }}>
            {post.text}
          </Typography>
        )}
      </CardContent>

      {post.image && (
        <CardMedia component="img" image={post.image} alt="post"
          sx={{ maxHeight: 420, objectFit: 'cover', width: '100%' }} />
      )}

      {/* likes/comments counts row */}
      {(post.likes.length > 0 || post.comments.length > 0) && (
        <Box sx={{ px: 2, pt: 1, display: 'flex', justifyContent: 'space-between' }}>
          {post.likes.length > 0 && (
            <Typography fontSize={12} color="text.secondary">
              ❤️ {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
              {post.likes.length <= 2
                ? ` · ${post.likes.join(', ')}`
                : ` · ${post.likes[0]} and ${post.likes.length - 1} others`}
            </Typography>
          )}
          {post.comments.length > 0 && (
            <Typography fontSize={12} color="text.secondary" ml="auto">
              {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
            </Typography>
          )}
        </Box>
      )}

      <Divider sx={{ mx: 2, mt: 1 }} />

      <CardActions sx={{ px: 1.5, py: 0.5 }}>
        <Tooltip title={liked ? 'Unlike' : 'Like'}>
          <IconButton onClick={() => onLike(post._id)} size="small"
            sx={{ color: liked ? '#E84393' : 'text.secondary', gap: 0.5, borderRadius: 2, px: 1.5,
              '&:hover': { bgcolor: liked ? '#fce4ec' : '#f5f5f5' } }}>
            {liked ? <FavoriteRounded fontSize="small" /> : <FavoriteBorderRounded fontSize="small" />}
            <Typography fontSize={13} fontWeight={500}>{liked ? 'Liked' : 'Like'}</Typography>
          </IconButton>
        </Tooltip>

        <IconButton size="small" onClick={() => setShowComments(s => !s)}
          sx={{ gap: 0.5, borderRadius: 2, px: 1.5, color: showComments ? 'primary.main' : 'text.secondary',
            '&:hover': { bgcolor: '#f5f5f5' } }}>
          <ChatBubbleOutlineRounded fontSize="small" />
          <Typography fontSize={13} fontWeight={500}>Comment</Typography>
        </IconButton>
      </CardActions>

      <Collapse in={showComments}>
        <Divider />
        <Box sx={{ px: 2, py: 1.5, bgcolor: '#fafbff' }}>
          {post.comments.length === 0 && (
            <Typography fontSize={13} color="text.secondary" mb={1.5} textAlign="center">
              No comments yet. Be the first! 👇
            </Typography>
          )}
          {post.comments.map((c) => (
            <Stack key={c._id} direction="row" spacing={1} mb={1.5} alignItems="flex-start">
              <Avatar sx={{ width: 32, height: 32, fontSize: 13, fontWeight: 700, bgcolor: getColor(c.username) }}>
                {c.username?.[0]?.toUpperCase()}
              </Avatar>
              <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAF0', borderRadius: 2, px: 1.5, py: 1, flex: 1 }}>
                <Typography fontSize={12} fontWeight={700} color="primary">@{c.username}</Typography>
                <Typography fontSize={13} mt={0.2}>{c.text}</Typography>
              </Box>
            </Stack>
          ))}

          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <Avatar sx={{ width: 32, height: 32, fontSize: 13, fontWeight: 700, bgcolor: getColor(currentUser?.username) }}>
              {currentUser?.username?.[0]?.toUpperCase()}
            </Avatar>
            <TextField fullWidth size="small" placeholder="Write a comment…"
              value={commentText} onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleComment(); } }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 5, bgcolor: '#fff' } }}
            />
            <IconButton size="small" color="primary"
              disabled={!commentText.trim() || submitting} onClick={handleComment}
              sx={{ bgcolor: 'primary.main', color: '#fff', width: 34, height: 34,
                '&:hover': { bgcolor: 'primary.dark' }, '&:disabled': { bgcolor: '#e0e0e0' } }}>
              {submitting ? <CircularProgress size={16} color="inherit" /> : <SendRounded fontSize="small" />}
            </IconButton>
          </Stack>
        </Box>
      </Collapse>
    </Card>
  );
}
