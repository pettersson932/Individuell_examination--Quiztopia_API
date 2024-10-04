const { fetchQuiz } = require("../../services/quizService");
const { sendResponse, sendError } = require("../../responses/index");

exports.handler = async (event) => {
  const { quizId } = JSON.parse(event.body);

  try {
    const quiz = await fetchQuiz(quizId, process.env.TABLE_NAME_QUIZ);
    if (!quiz) {
      return sendResponse(400, "quiz not found.");
    }

    const response = {
      name: quiz.name,
      creator: quiz.username,
      questions: quiz.questions.map((question) => question.question),
    };

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error fetching quiz" }),
    };
  }
};
