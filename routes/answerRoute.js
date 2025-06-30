const express = require("express");
const router = express.Router();
// const authMiddleware = require("../middleware/authMiddleware");

const {
  postAnswer,
  getAnswer,
  editAnswer,
  deleteAnswer,
} = require("../controller/answerController");

// Endpoint to post an answer for a specific question
router.post("/answer/:questionid", postAnswer);

// Endpoint to get answers for a specific question
router.get("/answer/:questionid", getAnswer);

// Endpoint to edit a specific answer
router.put("/answer/:answerid", editAnswer); // Add this line for editing answers

// Endpoint to delete a specific answer
router.delete("/answer/:answerid", deleteAnswer); // Add this line for deleting answers

module.exports = router;
