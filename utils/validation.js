function validateUserInput({ username, password, email, firstname, lastname }) {
  if (!username || !password || !email || !firstname || !lastname) {
    throw new Error("Missing required fields");
  }
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof email !== "string" ||
    typeof firstname !== "string" ||
    typeof lastname !== "string"
  ) {
    throw new Error("All inputs must be of type string");
  }
  if (!email.includes("@")) {
    throw new Error("Invalid email format");
  }
}

module.exports = { validateUserInput };
