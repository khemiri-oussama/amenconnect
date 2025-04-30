// controllers/chatController.js

const axios = require('axios');
const Chat  = require('../models/Chat');

const FLASK_API_URL = process.env.FLASK_API_URL || 'http://localhost:5000';

// helper to get YYYY-MM-DD
function todayString() {
  return new Date().toISOString().slice(0, 10);
}

exports.chat = async (req, res) => {
  const { message, user: payloadUser } = req.body;
  const authUser = req.user;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }
  if (!authUser || !authUser._id) {
    return res.status(401).json({ error: "User must be authenticated" });
  }

  // Build the “user” object to hand off to Flask:
  //  • if the front-end supplied a full profile (payloadUser), use it  
  //  • otherwise fallback to the minimal passport user
  const userForAI = payloadUser && payloadUser.id
    ? payloadUser
    : { _id: authUser._id, email: authUser.email };

  // Upsert today's chat doc & append the user's message
  const dateKey = todayString();
  let chatDoc = await Chat.findOneAndUpdate(
    { user: authUser._id, date: dateKey },
    {
      $setOnInsert: { user: authUser._id, date: dateKey },
      $push:         { messages: { sender: 'user', text: message } }
    },
    { upsert: true, new: true }
  );

  try {
    // Send to Flask
    const flaskResp = await axios.post(
      `${FLASK_API_URL}/chat`,
      { message, user: userForAI },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const replyText = flaskResp.data.response;

    // Save the bot reply
    chatDoc.messages.push({ sender: 'bot', text: replyText });
    await chatDoc.save();

    // Return it to the React app
    return res.json({ response: replyText });
  } catch (err) {
    console.error("Error in chat:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};
