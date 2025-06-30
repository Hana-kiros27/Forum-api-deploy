// // updated
// const { json, query } = require("express");
// const dbConnection = require("../db/dbconfig");

// const {
//   StatusCodes
// } = require("http-status-codes");
// const { v4: uuidv4 } = require("uuid");

// async function question(req, res) {
//   const { title, description } = req.body;
//   // Validate input
//   const questionid = uuidv4();
//   if (!title || !description) {
//     return res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ msg: "Please provide all required information" });
//   }
//   if (title.length > 200) {
//     return res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ msg: "Title must be less than 200 characters" });
//   }

//   try {
//     const username = req.user.username; // from auth middleware
//     const userid = req.user.userid; // from auth middleware

//     // Check for duplicate question ID
//     const [existingQuestion] = await dbConnection.query(
//       "SELECT * FROM questions WHERE questionid = ?",
//       [questionid]
//     );
//     if (existingQuestion.length > 0) {
//       return res
//         .status(StatusCodes.CONFLICT)
//         .json({ msg: "Question ID already exists" });
//     }

//     // Insert new question
//     await dbConnection.query(
//       "INSERT INTO questions (questionid, userid, title, description) VALUES (?, ?, ?, ?)",
//       [questionid, userid, title, description]
//     );

//     return res
//       .status(StatusCodes.CREATED)
//       .json({ msg: "Question added", questionid });
//   } catch (error) {
//     console.error("Error adding question:", error); // Log error with context
//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ msg: "Something went wrong, try again later" });
//   }
// }
// async function Allquestion(req, res) {
//   try {
//     const [results] = await dbConnection.query(
//       `SELECT 
//           questions.questionid AS question_id, 
//           questions.title, 
//           questions.description AS content, 
//           users.username AS user_name 
//       FROM questions 
//       JOIN users ON questions.userid = users.userid 
//       ORDER BY questions.id DESC`
//     );
//     return res.status(StatusCodes.OK).json({ questions: results });
//   } catch (error) {
//     // console.log(error.message);
//     return res
//       .status(StatusCodes.NOT_FOUND)
//       .json({ msg: "No questions found" });
//   }
// }
// async function getSingleQuestion(req, res) {
//   const { question_id } = req.params;

//   if (!question_id) {
//     return res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ msg: "Please provide a question ID." });
//   }

//   try {
//     // Retrieve the question details
//     const [question] = await dbConnection.query(
//       "SELECT questionid, title, description, created_at, userid FROM questions WHERE questionid = ?",
//       [question_id]
//     );

//     // If the question does not exist, return an error
//     if (question.length === 0) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ message: "No question found with this ID." });
//     }

//     return res.status(StatusCodes.OK).json({ question: question[0] });
//   } catch (error) {
//     console.error("Error while retrieving question:", error.message);
//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ msg: "Something went wrong, please try again!" });
//   }
// }

// module.exports = { question, Allquestion, getSingleQuestion };

const dbConnection = require("../db/dbConfig");

const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");

async function question(req, res) {
  const { title, description } = req.body;

  const questionid = uuidv4();   //uuid: universally unique identifier, generates unique string used for questionid.
  if (!title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required information" });
  }
  if (title.length > 50) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Title must be less than 50 characters" });
  }
  if (description.length > 200) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Description must be less than 200 characters" });
  }

  try {
    const username = req.user.username; // from auth middleware
    const userid = req.user.userid; // from auth middleware

    // Check for duplicated question ID
    // const [existingQuestion] = await dbConnection.query(
    //   "SELECT * FROM questions WHERE questionid = ?",
    //   [questionid]
    // );
    // if (existingQuestion.length > 0) {
    //   return res
    //     .status(StatusCodes.CONFLICT)
    //     .json({ msg: "Question ID already exists" });
    // }
    //----------------------------
    // Check for duplicate question by same user
    
    const [existingQuestion] = await dbConnection.query(
      "SELECT * FROM questions WHERE title = ? AND description = ? AND userid = ?",
      [title, description, userid]
    );

    if (existingQuestion.length > 0) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ msg: "You already asked this question." });
    }

    //-----------------

    // Insert new question
    await dbConnection.query(
      "INSERT INTO questions (questionid, userid, title, description) VALUES (?, ?, ?, ?)",
      [questionid, userid, title, description]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Question added", questionid });
  } catch (error) {
    console.error("Error adding question:", error); // Log error with context
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later" });
  }
}
async function Allquestion(req, res) {
  try {
    const [results] = await dbConnection.query(
      `SELECT 
          questions.questionid AS question_id, 
          questions.title, 
          questions.description AS content, 
          users.username AS user_name 
      FROM questions 
      JOIN users ON questions.userid = users.userid 
      ORDER BY questions.id DESC`
    );
    return res.status(StatusCodes.OK).json({ questions: results });
  } catch (error) {
    // console.log(error.message);
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "No questions found" });
  }
}
async function getSingleQuestion(req, res) {
  const { question_id } = req.params;

  if (!question_id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide a question ID." });
  }

  try {
    // Retrieve the question details
    const [question] = await dbConnection.query(
      "SELECT questionid, title, description, created_at, userid FROM questions WHERE questionid = ?",
      [question_id]
    );

    // If the question does not exist, return an error
    if (question.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No question found with this ID." });
    }

    return res.status(StatusCodes.OK).json({ question: question[0] });
  } catch (error) {
    console.error("Error while retrieving question:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, please try again!" });
  }
}

async function editQuestion(req, res) {
  const { question_id } = req.params;
  const { title, description } = req.body;

  if (!title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required information" });
  }

  if (title.length > 50) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Title must be less than 50 characters" });
  }

  if (description.length > 200) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Description must be less than 200 characters" });
  }

  try {
    const [existingQuestion] = await dbConnection.query(
      "SELECT * FROM questions WHERE questionid = ?",
      [question_id]
    );

    if (existingQuestion.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No question found with this ID." });
    }

    const userid = req.user.userid; // from auth middleware
    if (existingQuestion[0].userid !== userid) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ msg: "You do not have permission to edit this question." });
    }

    await dbConnection.query(
      "UPDATE questions SET title = ?, description = ? WHERE questionid = ?",
      [title, description, question_id]
    );

    return res
      .status(StatusCodes.OK)
      .json({ msg: "Question updated successfully." });
  } catch (error) {
    console.error("Error while editing question:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, please try again!" });
  }
}
async function deleteQuestion(req, res) {
  const { question_id } = req.params;

  try {
    // Check if the question exists
    const [existingQuestion] = await dbConnection.query(
      "SELECT * FROM questions WHERE questionid = ?",
      [question_id]
    );

    if (existingQuestion.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No question found with this ID." });
    }

    const userid = req.user.userid; // from auth middleware
    if (existingQuestion[0].userid !== userid) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ msg: "You do not have permission to delete this question." });
    }

    // Delete answers associated with the question
    await dbConnection.query("DELETE FROM answers WHERE questionid = ?", [
      question_id,
    ]);

    // Now delete the question
    await dbConnection.query("DELETE FROM questions WHERE questionid = ?", [
      question_id,
    ]);

    return res
      .status(StatusCodes.NO_CONTENT)
      .json({ msg: "Question and associated answers deleted successfully." });
  } catch (error) {
    console.error("Error while deleting question:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, please try again!" });
  }
}


module.exports = {
  deleteQuestion,
  editQuestion,
  question,
  Allquestion,
  getSingleQuestion,
};