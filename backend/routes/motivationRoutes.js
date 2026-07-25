const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddlewares");
const {
    generateMotivation,
    getMotivation
} = require("../controllers/motivationController");

router.post("/generate", protect, generateMotivation);
router.get("/", protect, getMotivation);

module.exports=router;