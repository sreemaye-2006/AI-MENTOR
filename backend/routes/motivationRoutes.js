const express = require("express");

const router = express.Router();

const protect = require("../middlewares/authMiddlewares");

const {
    generateMotivation
}=require("../controllers/motivationController");

router.post(
"/generate",
protect,
generateMotivation
);

module.exports=router;