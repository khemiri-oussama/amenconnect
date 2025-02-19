//models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    cin: { type: String, required: true, unique: true },
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telephone: { type: String, required: true },
    employeur: { type: String, required: true },
    adresseEmployeur: { type: String, required: true },
    password: { type: String, required: true },
    compteIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Compte' }],
    carteIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Carte' }],
    otp: {
      hash: { type: String, default: null },
      expires: { type: Date, default: null }
    },
    resetPasswordToken: {
      hash: { type: String, default: null },
      expires: { type: Date, default: null }
    }
  },
  { timestamps: true }
);

// Pre-save hook to hash the password if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', userSchema);
