const middy = require("@middy/core");
const { validateToken } = require("../../middleware/auth");
const { sendResponse, sendError } = require("../../responses/index");
const { fetchUser } = require("../../services/userService");
const { createQuiz } = require("../../services/quizService");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const handler = middy()
  .use(validateToken)
  .handler(async (event) => {
    try {
      const username = event.username;

      const { name, questions } = JSON.parse(event.body);

      const user = await fetchUser(username, process.env.TABLE_NAME_LOGIN);

      if (!user) {
        return sendError(404, "User not found");
      }

      const questionsWithId = questions.map((question) => ({
        ...question,
        questionId: uuidv4(),
      }));

      const quizId = await createQuiz(name, questionsWithId, username);

      return sendResponse(201, {
        message: "Quiz created successfully",
        quizId,
        name,
        questions: questionsWithId,
        username,
      });
    } catch (error) {
      console.error("Error occurred:", error);
      return sendError(500, "Internal Server Error");
    }
  });

module.exports = { handler };
