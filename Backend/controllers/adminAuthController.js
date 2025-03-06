// controllers/adminAuthController.js
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    // Generate JWT token (set a role to differentiate admin sessions)
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    // Set the token as an HTTP-only cookie
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
      sameSite: 'strict'
    });
    res.json({ message: 'Admin logged in successfully!', token });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie('adminToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    res.json({ message: 'Admin logged out successfully.' });
  } catch (err) {
    console.error('Admin logout error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Optional: If you wish to allow admin registration via an endpoint.
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: 'Admin already exists with this email.' });
    }
    admin = new Admin({ name, email, password });
    await admin.save();
    res.status(201).json({ message: 'Admin registered successfully.' });
  } catch (err) {
    console.error('Admin registration error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};
