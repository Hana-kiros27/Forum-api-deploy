// updated
const express = require("express");
const router = express.Router();

const {
  question,
  Allquestion,
  getSingleQuestion,
} = require("../controller/questionController");
router.post("/question", question);
router.get("/question", Allquestion);
router.get("/question/:question_id", getSingleQuestion);
// router.get("/question/:questionid", getSingleQuestion);/
module.exports = router;
