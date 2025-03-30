exports.uploadLogo = (req, res) => {
  // Check if a file is present in the request
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  
  // Create a URL for the uploaded file
  // For example, if your server is running on http://localhost:3000,
  // the logo URL would be http://localhost:3000/uploads/<filename>
  const logoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  
  // Optionally, store logoUrl in a database here
  
  // Return the URL to the client
  res.json({ logoUrl });
};
