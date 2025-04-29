// controllers/chatController.js

const axios = require('axios');
const Chat  = require('../models/Chat');

const FLASK_API_URL = process.env.FLASK_API_URL || 'http://localhost:5000';

// helper to get YYYY-MM-DD
function todayString() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

exports.chat = async (req, res) => {
  const { message } = req.body;
  const user = req.user;   // populated by passport

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }
  if (!user || !user._id) {
    return res.status(401).json({ error: "User must be authenticated" });
  }

  const userId  = user._id;
  const dateKey = todayString();

  try {
    // 1) Upsert today’s chat doc for this user
    let chatDoc = await Chat.findOneAndUpdate(
      { user: userId, date: dateKey },
      {
        $setOnInsert: { user: userId, date: dateKey },
        $push:         { messages: { sender: 'user', text: message } }
      },
      { upsert: true, new: true }
    );

    // 2) Call Flask AI using the correct FLASK_API_URL var
    const flaskResp = await axios.post(
      `${FLASK_API_URL}/chat`,
      {
        message,
        user: {
          _id:   user._id,
          email: user.email
        }
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const replyText = flaskResp.data.response;

    // 3) Save bot reply
    chatDoc.messages.push({ sender: 'bot', text: replyText });
    await chatDoc.save();

    // 4) Return reply to client
    return res.json({ response: replyText });

  } catch (err) {
    console.error("Error in chat:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};
