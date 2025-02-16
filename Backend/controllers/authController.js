// controllers/authController.js
const User = require('../models/Users');
const bcrypt = require('bcryptjs'); // for password hashing
const jwt = require('jsonwebtoken'); // to generate JWT token

// Auth Controller
const authController = {
  // Login Route
  async login(req, res) {
    const { email, password } = req.body;

    try {
      // Check if the user exists by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: '❌ User not found' });
      }

      // Check if the password is correct (assuming you store hashed passwords)
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: '❌ Invalid password' });
      }

      // Generate JWT Token
      const token = jwt.sign(
        { userId: user._id, nom: user.nom, prénom: user.prénom },
        process.env.JWT_SECRET, // Store your secret in .env file
        { expiresIn: '1h' } // Set token expiration time
      );

      // Respond with the token and user data
      res.json({
        message: '✅ Login successful',
        token,
        user: {
          nom: user.nom,
          prénom: user.prénom,
          email: user.email,
        },
      });
    } catch (err) {
      console.error('❌ Error during login', err.message);
      res.status(500).json({ message: '❌ Server error' });
    }
  },

  // Register Route (for creating a new user)
  async register(req, res) {
    const { nom, prénom, email, téléphone, employeur, adresseEmployeur, password } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: '❌ User with this email already exists' });
      }

      // Create a new user
      const newUser = new User({
        nom,
        prénom,
        email,
        téléphone,
        employeur,
        adresseEmployeur,
        password: await bcrypt.hash(password, 10), // Hash the password before saving
      });

      await newUser.save();

      // Generate JWT token for the new user
      const token = jwt.sign(
        { userId: newUser._id, nom: newUser.nom, prénom: newUser.prénom },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(201).json({
        message: '✅ User registered successfully',
        token,
        user: {
          nom: newUser.nom,
          prénom: newUser.prénom,
          email: newUser.email,
        },
      });
    } catch (err) {
      console.error('❌ Error during registration', err.message);
      res.status(500).json({ message: '❌ Server error' });
    }
  },
};

module.exports = authController;
