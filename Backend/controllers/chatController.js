// controllers/chatController.js

const axios = require('axios');
const Chat  = require('../models/Chat');            // Your Mongoose model
const FLASK_API_URL = process.env.FLASK_API_URL    // e.g. 'http://localhost:5000'
                     || 'http://localhost:5000';

exports.chat = async (req, res) => {
  const { message } = req.body;
  // Passport JWT middleware must run before this, so req.user is set:
  const user = req.user;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }
  if (!user || !user._id) {
    return res.status(401).json({ error: "User must be authenticated" });
  }

  const userId = user._id;

  try {
    // 1) Upsert the Chat document for this user, pushing the user's message
    let chatDoc = await Chat.findOneAndUpdate(
      { user: userId },
      { $push: { messages: { sender: 'user', text: message } } },
      { upsert: true, new: true }
    );

    // 2) Forward to your Flask AI, sending minimal user context
    const flaskResp = await axios.post(
      `${FLASK_API_URL}/chat`,
      {
        message,
        user: {
          _id:   user._id,
          email: user.email,
          // you can add more non-sensitive fields if needed:
          // prenom: user.prenom,
          // comptes: user.comptes,
        }
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    const replyText = flaskResp.data.response;

    // 3) Append the bot’s reply and save
    chatDoc.messages.push({ sender: 'bot', text: replyText });
    await chatDoc.save();

    // 4) Return the AI’s reply
    return res.json({ response: replyText });

  } catch (err) {
    console.error("Error in chat controller:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};
