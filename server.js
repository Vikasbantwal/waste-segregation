const express = require("express");
const bodyParser = require("body-parser");
const path = require("path"); // 👈 Import the 'path' module
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 💡 The corrected way to serve static files
app.use(express.static(path.join(__dirname, "public")));

// File upload setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Routes
// Since you're serving static files from the 'public' folder,
// this route is not strictly necessary if 'home.html' is your default index.
// However, it's fine to keep for clarity.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

// Example: handle uploads
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.json({ message: "File uploaded successfully", file: req.file });
});

// Example: login API
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // TODO: Replace with DB check
  if (username === "admin" && password === "1234") {
    res.json({ success: true, message: "Login successful" });
  } else {
    res.json({ success: false, message: "Invalid credentials" });
  }
});

// Example: register API
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  // TODO: Save user in DB
  res.json({ success: true, message: "User registered successfully" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});