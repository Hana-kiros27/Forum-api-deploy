// 
const express = require("express");
const router=express.Router()
// const authMiddleware = require("../middlewear/authMiddleware")

const {
  postAnswer,
  getAnswer,
} = require("../controller/answerController");

router.post("/answer/:questionid", postAnswer);
router.get("/answer/:questionid", getAnswer);


module.exports=router
