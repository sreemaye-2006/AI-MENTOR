const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddlewares");
const {
    generatePerformance,
    getPerformance
} = require("../controllers/performanceController");

router.post("/generate", protect, generatePerformance);
router.get("/", protect, getPerformance);

module.exports = router;