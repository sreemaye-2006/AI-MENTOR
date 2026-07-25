const express = require("express");

const router = express.Router();

const protect = require("../middlewares/authMiddlewares");

const {

generatePerformance

}=require("../controllers/performanceController");

router.post(

"/generate",

protect,

generatePerformance

);

module.exports=router;