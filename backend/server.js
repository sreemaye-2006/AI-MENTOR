const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const studyRoutes = require("./routes/studyRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const performanceRoutes=require("./routes/perfromanceRoutes");
const roadmapRoutes=require("./routes/roadmapRoutes");
const motivationRoutes=require("./routes/motivationRoutes");
const app = express();

// Connect to Database
connectDB();
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.json());

app.use("/api/study", studyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/performance",performanceRoutes);
app.use("/api/roadmap",roadmapRoutes);

app.use(
"/api/motivation",
motivationRoutes
);



// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MentorAI Backend is Running 🚀"
  });
});

// Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});