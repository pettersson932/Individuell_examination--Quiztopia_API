const middy = require("@middy/core");
const { validateToken } = require("../../middleware/auth");
const { db } = require("../../services/db");
const { sendResponse, sendError } = require("../../responses/index");
const { fetchUser } = require("../../services/userService");
require("dotenv").config();

const handler = middy()
  .use(validateToken)
  .handler(async (event) => {
    try {
      const user = await fetchUser(
        event.username,
        process.env.TABLE_NAME_LOGIN
      );

      // If user is not found, you might want to send an error response
      if (!user) {
        return sendError(404, "User not found");
      }

      return sendResponse(200, {
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      });
    } catch (error) {
      console.error("Error occurred:", error); // Log the error for debugging
      return sendError(500, "Internal Server Error");
    }
  });

module.exports = { handler };
