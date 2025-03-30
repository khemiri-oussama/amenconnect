const express = require('express');
const router = express.Router();
const multer = require('multer'); //npm install multer
const path = require('path');
const logoController = require('../controllers/logoController');

// Configure Multer storage settings to store files in the /public/uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store files in /public/uploads
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    // Create a unique filename using the current timestamp and a random number
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Setup Multer with validation for file size and type (2MB max)
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|svg/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("File type not supported"));
  }
});

// Define the POST route for uploading the logo
router.post('/upload-logo', upload.single('logo'), logoController.uploadLogo);

module.exports = router;
