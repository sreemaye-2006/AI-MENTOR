const express = require("express");

const router = express.Router();

const protect = require("../middlewares/authMiddlewares");

const {

    getProfile,

    updateProfile

} = require("../controllers/profileController");

router.get("/me", protect, getProfile);

router.put("/update", protect, updateProfile);

module.exports = router;