// middleware/auth.js
const jwt = require('jsonwebtoken');
const Session = require('../models/Session');
const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Now check that the session exists
    const session = await Session.findOne({ sessionId: decoded.sessionId });
    if (!session) {
      return res.status(401).json({ message: 'Session has been terminated.' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is invalid or expired.' });
  }
};

module.exports = verifyToken;
