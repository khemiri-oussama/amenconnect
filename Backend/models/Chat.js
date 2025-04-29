// models/Chat.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new Schema({
  sender:  { type: String, enum: ['user','bot'], required: true },
  text:    { type: String, required: true },
  date:    { type: Date,   default: Date.now },
});

const ChatSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    // store just the calendar day in UTC
    type: String,           // e.g. "2025-04-30"
    required: true,
    index: true
  },
  messages: [ MessageSchema ]
},{
  timestamps: true
});

// to ensure one per user/day
ChatSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Chat', ChatSchema);
