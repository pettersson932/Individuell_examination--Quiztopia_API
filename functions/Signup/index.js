const { sendResponse, sendError } = require("../../responses/index");
const { fetchUser, createUser } = require("../../services/userService");
const { hashPassword } = require("../../utils/hashPassword");
const { validateUserInput } = require("../../utils/validation");
require("dotenv").config();
const TABLE_NAME = process.env.TABLE_NAME_LOGIN;

exports.handler = async (event) => {
  try {
    const { username, password, email, firstname, lastname } = JSON.parse(
      event.body
    );

    validateUserInput({ username, password, email, firstname, lastname });

    const user = await fetchUser(username, TABLE_NAME);
    if (user) {
      return sendError(400, "User already exists.");
    }

    const hashedPassword = await hashPassword(password);

    await createUser(
      { username, hashedPassword, email, firstname, lastname },
      TABLE_NAME
    );

    return sendResponse(201, "User created.");
  } catch (error) {
    console.error(error.message);
    return sendError(500, error.message);
  }
};
