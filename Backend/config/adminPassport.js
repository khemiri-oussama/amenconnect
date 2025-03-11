// config/adminPassport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// Local strategy for admin login
passport.use(
  'admin-local',
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return done(null, false, { message: 'Invalid credentials.' });
      }
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return done(null, false, { message: 'Invalid credentials.' });
      }
      return done(null, admin);
    } catch (err) {
      return done(err);
    }
  })
);

// Create a custom extractor to check cookies for the token
const cookieExtractor = req => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.adminToken;
  }
  return token;
};

// JWT strategy options updated to extract token from both the header and cookies
const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    cookieExtractor,
  ]),
  secretOrKey: process.env.JWT_SECRET || 'yoursecret', // Set your JWT secret here
};

// JWT strategy for protecting endpoints
passport.use(
  'admin-jwt',
  new JWTStrategy(opts, async (jwtPayload, done) => {
    try {
      const admin = await Admin.findById(jwtPayload.id);
      if (admin) {
        return done(null, admin);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

module.exports = passport;
