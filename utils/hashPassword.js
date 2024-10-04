const bcrypt = require("bcryptjs");

async function hashPassword(password, salt = 10) {
  try {
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error("Password hashing failed");
  }
}

module.exports = { hashPassword };
