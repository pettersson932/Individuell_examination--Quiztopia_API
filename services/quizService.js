const { db } = require("./db");
const { v4: uuidv4 } = require("uuid");
const { UpdateCommand } = require("@aws-sdk/lib-dynamodb");
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

const updateQuiz = async (quizId, updatedQuiz, tableName) => {
  const params = {
    TableName: tableName,
    Key: { quizId },
    UpdateExpression: "SET questions = :questions",
    ExpressionAttributeValues: {
      ":questions": updatedQuiz.questions,
    },
  };

  try {
    const command = new UpdateCommand(params);
    await db.send(command);
  } catch (error) {
    console.error("Error updating quiz:", error);
    throw new Error("Unable to update quiz"); // Rethrow the error for handling in the handler
  }
};
async function addQuestionToQuiz(quizId, updatedQuiz, tableName) {
  try {
    const command = new UpdateCommand({
      TableName: tableName,
      Key: {
        quizId: quizId, // Assuming quizId is the primary key
      },
      UpdateExpression: "SET #questions = :questions", // Update expression to set the questions
      ExpressionAttributeNames: {
        "#questions": "questions", // Placeholder for the attribute name
      },
      ExpressionAttributeValues: {
        ":questions": updatedQuiz.questions, // New questions array
      },
      ReturnValues: "UPDATED_NEW", // Return the updated attributes
    });

    const result = await db.send(command); // Using db instance for sending the command
    return result.Attributes; // Return the updated quiz attributes
  } catch (error) {
    console.error("Error updating quiz:", error);
    throw new Error("Unable to update quiz");
  }
}

module.exports = {
  createQuiz,
  fetchQuiz,
  deleteQuiz,
  updateQuiz,
  addQuestionToQuiz,
};
