const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/wasteDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Schema
const wasteSchema = new mongoose.Schema({
  type: String,
  location: String,
  date: { type: Date, default: Date.now }
});

// Model
const Waste = mongoose.model("Waste", wasteSchema);

// Routes
app.get("/", (req, res) => {
  res.send("🚀 Waste Segregation API is running...");
});

// Add new waste entry
app.post("/add", async (req, res) => {
  try {
    const { type, location } = req.body;
    const newWaste = new Waste({ type, location });
    await newWaste.save();
    res.json({ message: "✅ Waste data added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to add waste data" });
  }
});

// Get all waste entries
app.get("/waste", async (req, res) => {
  try {
    const wastes = await Waste.find();
    res.json(wastes);
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to fetch waste data" });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
