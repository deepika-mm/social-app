const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// images go into the "social-app/posts" folder on cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'social-app/posts',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1080, crop: 'limit' }], // cap size
  },
});

module.exports = {
  cloudinary,
  upload: multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }), // 5MB max
};
