const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Create profilePics folder if it doesn't exist
const uploadDir = path.join(__dirname, "..", "profilePics");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 4 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error("Only JPEG, PNG, and GIF files are allowed");
      error.status = 400;
      return cb(error);
    }
    cb(null, true);
  },
}).single("profileImage"); // profileImage must match frontend field

// Controller function
const createUser = (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { username, email, password, country, pinCode } = req.body;

    if (!username || !email || !password || !country || !pinCode) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const imagePath = req.file ? req.file.filename : null;

    // For demonstration, just send back the data
    return res.status(200).json({
      message: "User registered successfully!",
      user: {
        username,
        email,
        country,
        pinCode,
        profileImage: imagePath
      }
    });
  });
};

module.exports = { createUser };
