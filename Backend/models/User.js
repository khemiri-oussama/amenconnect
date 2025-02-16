// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    identifiant: { type: String, required: true, unique: true },
    nom: { type: String, required: true },
    prénom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    téléphone: { type: String, required: true },
    employeur: { type: String, required: true },
    adresseEmployeur: { type: String, required: true },
    password: { type: String, required: true },
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', userSchema);
