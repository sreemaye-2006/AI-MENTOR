const express = require("express");
const {
    startInterview,
    submitAnswer,
    getHistory,
    getInterview,
    deleteInterview
} = require("../controllers/interviewController");
const router = express.Router();

const protect = require("../middlewares/authMiddlewares");

router.post("/start", protect, startInterview);
router.post("/answer", protect, submitAnswer);
router.get("/history", protect, getHistory);
router.get("/:id", protect, getInterview);
router.delete("/:id", protect, deleteInterview);

module.exports = router;