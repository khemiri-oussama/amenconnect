// config/adminPassport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

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

module.exports = passport;
