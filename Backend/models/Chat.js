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
    // store either the user’s _id from auth, or some unique identifier
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [ MessageSchema ]
},{
  timestamps: true
});

module.exports = mongoose.model('Chat', ChatSchema);
