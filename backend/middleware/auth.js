const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // token comes in the Authorization header as "Bearer <token>"
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username }
    next();
  } catch {
    return res.status(401).json({ message: 'Token is invalid or expired' });
  }
};
