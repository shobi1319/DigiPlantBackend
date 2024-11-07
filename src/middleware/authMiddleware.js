const jwt = require('jsonwebtoken');
const JWT_SECRET = '1319@'; // Make sure to replace this in production with a secure key

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required', success: false });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token and attach user ID to request
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.userId }; // Add user ID to request object
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token', success: false });
  }
};

module.exports = authMiddleware;
