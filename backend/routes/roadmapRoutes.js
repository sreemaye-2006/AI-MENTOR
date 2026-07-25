const express = require("express");

const router = express.Router();

const protect = require("../middlewares/authMiddlewares");

const {

generateRoadmap

}=require("../controllers/roadmapController");

router.post(

"/generate",

protect,

generateRoadmap

);

module.exports=router;