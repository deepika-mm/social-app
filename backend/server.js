const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Check if .env is loading
console.log("MONGO_URI =", process.env.MONGO_URI);

// allow requests from the frontend
app.use(cors());
app.use(express.json());

// route files
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));

// simple health check
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// connect to mongodb then start the server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });