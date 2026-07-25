const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddlewares");
const { generatePlan, getPlan, markTaskComplete } = require("../controllers/studyController");

router.post("/generate", protect, generatePlan);
router.get("/", protect, getPlan);
router.put("/:id/task", protect, markTaskComplete);

module.exports = router;