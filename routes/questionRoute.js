// updated
const express = require("express");
const router = express.Router();

// const {
//   question,
//   Allquestion,
//   getSingleQuestion,
// } = require("../controller/questionController");
// router.post("/question", question);
// router.get("/question", Allquestion);
// router.get("/question/:question_id", getSingleQuestion);
// router.get("/question/:questionid", getSingleQuestion);/
// const express = require("express");
// const router = express.Router();
const {
  question,
  Allquestion,
  getSingleQuestion,
  editQuestion,
  deleteQuestion,
} = require("../controller/questionController");

// Route to create a new question
router.post("/question", question);

// Route to retrieve all questions
router.get("/question", Allquestion);

// Route to retrieve a single question by ID
router.get("/question/:question_id", getSingleQuestion);

// Route to edit a question
router.put("/question/:question_id", editQuestion);

// Route to delete a question
router.delete("/question/:question_id", deleteQuestion);

// module.exports = router;
module.exports = router;
