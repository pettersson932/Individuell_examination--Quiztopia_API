const { db } = require("./db");
const bcrypt = require("bcryptjs");

async function fetchUser(username, tableName) {
  try {
    const { Item } = await db.get({
      TableName: tableName,
      Key: { username },
    });
    return Item;
  } catch (error) {
    throw new Error(`Failed to fetch user from ${tableName}: ${error.message}`);
  }
}

async function createUser(user, tableName) {
  try {
    await db.put({
      TableName: tableName,
      Item: user,
    });
  } catch (error) {
    throw new Error(`Failed to create user in ${tableName}: ${error.message}`);
  }
}

async function checkPassword(password, user) {
  try {
    // Ensure the user object has the hashedPassword property
    if (!user || !user.hashedPassword) {
      throw new Error(
        "User object is invalid or does not contain hashedPassword."
      );
    }

    const isCorrect = await bcrypt.compare(password, user.hashedPassword);
    return isCorrect;
  } catch (error) {
    console.error("Error checking password:", error.message);
    throw new Error("Password verification failed"); // Throw a new error to be handled at a higher level
  }
}

module.exports = {
  fetchUser,
  createUser,
  checkPassword,
};
