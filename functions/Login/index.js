const { sendResponse, sendError } = require("../../responses/index");
const { fetchUser } = require("../../services/userService");
const { signToken } = require("../../middleware/auth");
const { checkPassword } = require("../../services/userService");
require("dotenv").config();

exports.handler = async (event) => {
  const { username, password } = JSON.parse(event.body);

  try {
    const user = await fetchUser(username, process.env.TABLE_NAME_LOGIN);
    if (!user) {
      return sendError(400, "Wrong username or password //  user");
    }

    const correctPassword = await checkPassword(password, user);
    if (!correctPassword) {
      return sendError(400, "Wrong username or password //  psw");
    }

    const token = signToken(user);
    return sendResponse(200, token);
  } catch (error) {
    console.error("Handler error:", error);
    return sendError(500, "Internal server error");
  }
};
