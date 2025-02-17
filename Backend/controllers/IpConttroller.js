const ip = require("ip");

// Function to extract client IP
const detectIP = (req, res, next) => {
  let clientIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  // Handle IPv6 loopback (::1) and IPv6-mapped IPv4 (::ffff:192.168.1.1)
  if (clientIP === "::1") clientIP = "127.0.0.1";
  if (clientIP.includes("::ffff:")) clientIP = clientIP.split("::ffff:")[1];

  console.log("Client IP:", clientIP);
  req.clientIP = clientIP; // Store in request object

  next();
};

module.exports = { detectIP };
