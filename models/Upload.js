// models/Upload.js
const mongoose = require("mongoose");

const UploadSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalname: String,
  username: String,
  prediction: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Upload", UploadSchema);
