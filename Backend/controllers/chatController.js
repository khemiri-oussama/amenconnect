// controllers/chatController.js
const axios = require('axios');

// Base URL of your Flask API (you can set this in your .env)
const FLASK_API_URL = process.env.FLASK_API_URL || 'http://localhost:5000';

exports.chat = async (req, res) => {
  const { message, user } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required in the request body." });
  }

  try {
    // Forward the message and user context to the Flask service
    const flaskResponse = await axios.post(
      `${FLASK_API_URL}/chat`,
      { message, user },
      { headers: { 'Content-Type': 'application/json' } }
    );

    // Flask returns { response: replyMessage }
    const { response: replyMessage } = flaskResponse.data;

    // If you still need to send via Green API from Node side:
    // if (user && user.phone) {
    //   await sendViaGreenAPI(user.phone, replyMessage);
    // }

    return res.json({ response: replyMessage });
  } catch (err) {
    console.error("Error calling Flask API:", err.toString());
    // If it's an Axios error, you can inspect err.response.data
    const status = err.response?.status || 500;
    const errorMsg = err.response?.data?.error || "An error occurred while processing your request.";
    return res.status(status).json({ error: errorMsg });
  }
};
