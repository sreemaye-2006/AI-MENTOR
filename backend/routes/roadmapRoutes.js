const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddlewares");
const {
    generateRoadmap,
    getRoadmap
} = require("../controllers/roadmapController");

router.post("/generate", protect, generateRoadmap);
router.get("/", protect, getRoadmap);

module.exports = router;