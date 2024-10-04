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
async function fetchQuiz(quizId, tableName) {
  try {
    const { Item } = await db.get({
      TableName: tableName,
      Key: { quizId },
    });
    return Item;
  } catch (error) {
    throw new Error(`Failed to fetch user from ${tableName}: ${error.message}`);
  }
}
async function deleteQuiz(quizId, tableName) {
  try {
    await db.delete({
      TableName: tableName,
      Key: { quizId },
    });
    return { message: `Quiz with quizId ${quizId} successfully deleted.` };
  } catch (error) {
    throw new Error(
      `Failed to delete quiz from ${tableName}: ${error.message}`
    );
  }
}

module.exports = {
  createQuiz,
  fetchQuiz,
  deleteQuiz,
};
