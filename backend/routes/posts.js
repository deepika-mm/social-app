const router = require('express').Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// ── GET /api/posts  (paginated feed) ────────────────────────────────────────
router.get('/', auth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Post.countDocuments(),
    ]);

    res.json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page < Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── POST /api/posts  (create with optional image) ───────────────────────────
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const text = req.body.text?.trim() || '';
    const image = req.file?.path || '';

    if (!text && !image) {
      return res.status(400).json({ message: 'Post must have text or an image' });
    }

    const post = await Post.create({
      userId: req.user.id,
      username: req.user.username,
      text,
      image,
      likes: [],
      comments: [],
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── POST /api/posts/:id/like  (toggle like) ──────────────────────────────────
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const { username } = req.user;
    const alreadyLiked = post.likes.includes(username);

    if (alreadyLiked) {
      // remove the like
      post.likes = post.likes.filter((u) => u !== username);
    } else {
      // add the like
      post.likes.push(username);
    }

    await post.save();

    res.json({
      likes: post.likes,
      likesCount: post.likes.length,
      liked: !alreadyLiked,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── POST /api/posts/:id/comment  (add comment) ──────────────────────────────
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const text = req.body.text?.trim();
    if (!text) return res.status(400).json({ message: 'Comment cannot be empty' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({
      userId: req.user.id,
      username: req.user.username,
      text,
    });

    await post.save();

    const newComment = post.comments[post.comments.length - 1];
    res.status(201).json({
      comment: newComment,
      commentsCount: post.comments.length,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
