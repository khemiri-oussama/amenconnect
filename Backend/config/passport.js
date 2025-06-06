//config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Session = require('../models/Session'); // Import the Session model

// Local strategy for login using email and password
passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: 'Invalid credentials.' });
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: 'Invalid credentials.' });
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Custom extractor: Get JWT from cookie "token"
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['token'];
  }
  return token;
};

const jwtOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET,
};

// JWT strategy with session verification
passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      // Check if the session exists using the sessionId from the JWT payload
      const session = await Session.findOne({ sessionId: jwtPayload.sessionId });
      if (!session) {
        return done(null, false, { message: "Session has been terminated." });
      }
      // If the session exists, find the user by their ID
      const user = await User.findById(jwtPayload.id);
      if (user) return done(null, user);
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

module.exports = passport;
