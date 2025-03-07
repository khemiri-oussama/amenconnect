// models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // CIN: exactly 8 digits (as a string)
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
    // Phone number field – you can add further validations if needed
    // Date de naissance (birth date)
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['admin', 'superadmin', 'manager'], // allowed roles
      default: 'admin' 
    },
    department: { type: String, default: 'General' },
    permissions: [{ type: String }]
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
