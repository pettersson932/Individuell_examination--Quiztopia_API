const { db } = require("../../services/db");
const { sendResponse, sendError } = require("../../responses/index");
require("dotenv").config();
const TABLE_NAME_QUIZ = process.env.TABLE_NAME_QUIZ;

exports.handler = async (event) => {
  try {
    const quizCommand = {
      TableName: TABLE_NAME_QUIZ,
    };

    const quizData = await db.scan(quizCommand);

    if (!quizData.Items || quizData.Items.length === 0) {
      return sendResponse(404, "No quizzes found.");
    }

    const quizzesWithCreators = quizData.Items.map((quiz) => ({
      username: quiz.username,
      name: quiz.name,
    }));

    return sendResponse(200, quizzesWithCreators);
  } catch (error) {
    console.error(error.message);
    return sendError(500, error.message);
  }
};
