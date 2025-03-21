// models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cin: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{8}$/, 'CIN must be exactly 8 digits']
    },
    otp: {
      hash: { type: String, default: null },
      expires: { type: Date, default: null },
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['admin', 'superadmin', 'manager'],
      default: 'admin' 
    },
    department: { type: String, default: 'General' },
    permissions: [{ type: String }],
    // Add reset token fields:
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null }
  },
  { timestamps: true }
);


// Pre-save hook to hash the password if it has been modified
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Admin', adminSchema);
