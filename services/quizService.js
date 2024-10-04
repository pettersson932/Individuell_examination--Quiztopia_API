const { db } = require("./db");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const createQuiz = async (name, questions, username) => {
  try {
    const quizId = uuidv4();
    const quizData = {
      quizId,
      name,
      questions,
      username,
      createdAt: new Date().toISOString(),
    };

    await db.put({
      TableName: process.env.TABLE_NAME_QUIZ,
      Item: quizData,
    });

    return quizId;
  } catch (error) {
    console.error("Error inserting quiz into DB:", error);
    throw new Error("Failed to add quiz to the database");
  }
};

module.exports = {
  createQuiz,
};
