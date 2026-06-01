const mongoose = require('mongoose');

// each comment stores who wrote it
const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: { type: String, required: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: { type: String, required: true },
    text: { type: String, default: '', trim: true },
    image: { type: String, default: '' },
    // stores usernames of people who liked (makes toggle easy)
    likes: [{ type: String }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

// either text or image must be present — both optional but not both empty
postSchema.pre('validate', function (next) {
  if (!this.text && !this.image) {
    return next(new Error('A post must have text, an image, or both'));
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
