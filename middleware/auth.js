const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const validateToken = {
  before: async (request) => {
    try {
      const token = request.event.headers.authorization.replace("Bearer ", "");

      if (!token) throw Error();

      const data = jwt.verify(token, process.env.SECRET);
      request.event.username = data.username;

      return request.response;
    } catch (error) {}
  },
};

function signToken(user) {
  console.log("secret", process.env.SECRET);
  console.log("username", user.username);
  if (!process.env.SECRET) {
    throw new Error("JWT Secret is not defined");
  }

  const token = jwt.sign({ username: user.username }, process.env.SECRET, {
    expiresIn: 3600,
  });
  console.log("token", token);
  return token;
}

module.exports = { validateToken, signToken };
