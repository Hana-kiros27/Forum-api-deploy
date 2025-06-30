const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbConfig");

async function postAnswer(req, res) {
  const { answer } = req.body;
  const { questionid } = req.params;

  if (!questionid || !answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required information" });
  }

  try {
    const userid = req.user.userid; // from auth middleware
    await dbConnection.query(
      "INSERT INTO answers (questionid, userid, answer) VALUES (?, ?, ?)",
      [questionid, userid, answer]
    );
    return res.status(StatusCodes.CREATED).json({ msg: "Answer added" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later" });
  }
}

async function getAnswer(req, res) {
  const { questionid } = req.params;

  if (!questionid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide a question ID." });
  }

  try {
    const [questions] = await dbConnection.query(
      "SELECT questionid FROM questions WHERE questionid = ?",
      [questionid]
    );

    if (questions.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No question found with this ID." });
    }

    const [answer] = await dbConnection.query(
      "SELECT answers.answerid, answers.answer, answers.userid, answers.created_at, users.username AS user_name FROM answers JOIN users ON answers.userid = users.userid WHERE questionid = ?",
      [questionid]
    );
    return res.status(StatusCodes.OK).json({ questionid, answer });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, please try again!" });
  }
}

async function editAnswer(req, res) {
  const { answer } = req.body;
  const { answerid } = req.params; // Assuming answer ID is passed in the URL

  if (!answerid || !answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required information." });
  }

  try {
    const userid = req.user.userid; // from auth middleware
    // Check if the answer exists and belongs to the user
    const [existingAnswer] = await dbConnection.query(
      "SELECT * FROM answers WHERE answerid = ? AND userid = ?",
      [answerid, userid]
    );

    if (existingAnswer.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({
          msg: "No answer found with this ID or you do not have permission to edit it.",
        });
    }

    // Update the answer
    await dbConnection.query(
      "UPDATE answers SET answer = ? WHERE answerid = ?",
      [answer, answerid]
    );

    return res
      .status(StatusCodes.OK)
      .json({ msg: "Answer updated successfully." });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, please try again!" });
  }
}

async function deleteAnswer(req, res) {
  const { answerid } = req.params; // Assuming answer ID is passed in the URL

  if (!answerid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide an answer ID." });
  }

  try {
    const userid = req.user.userid; // from auth middleware
    // Check if the answer exists and belongs to the user
    const [existingAnswer] = await dbConnection.query(
      "SELECT * FROM answers WHERE answerid = ? AND userid = ?",
      [answerid, userid]
    );

    if (existingAnswer.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({
          msg: "No answer found with this ID or you do not have permission to delete it.",
        });
    }

    // Delete the answer
    await dbConnection.query("DELETE FROM answers WHERE answerid = ?", [
      answerid,
    ]);

    return res
      .status(StatusCodes.NO_CONTENT)
      .json({ msg: "Answer deleted successfully." });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, please try again!" });
  }
}

module.exports = { postAnswer, getAnswer, editAnswer, deleteAnswer };
