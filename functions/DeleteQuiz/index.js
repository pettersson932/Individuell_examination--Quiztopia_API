const middy = require("@middy/core");
const { validateToken } = require("../../middleware/auth");
const { sendResponse, sendError } = require("../../responses/index");
const { fetchQuiz, deleteQuiz } = require("../../services/quizService");
require("dotenv").config();

const handler = middy()
  .use(validateToken)
  .handler(async (event) => {
    try {
      const username = event.username;

      const { quizId } = JSON.parse(event.body);

      const quiz = await fetchQuiz(quizId, process.env.TABLE_NAME_QUIZ);
      if (!quiz) {
        return sendError(400, "No quiz w that id exits in db.");
      }

      if (username !== quiz.username) {
        return sendError(
          400,
          "Current user didnt create this quiz and cannot delete it."
        );
      }

      await deleteQuiz(quizId, process.env.TABLE_NAME_QUIZ);

      return sendResponse(200, "quiz deleted.");
    } catch (error) {
      console.error("Error occurred:", error);
      return sendError(500, "Internal Server Error");
    }
  });

module.exports = { handler };
