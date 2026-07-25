const express = require("express");

const router = express.Router();

const protect = require("../middlewares/authMiddlewares");

const { generatePlan } = require("../controllers/studyController");

router.post("/generate", protect, generatePlan);

module.exports = router;