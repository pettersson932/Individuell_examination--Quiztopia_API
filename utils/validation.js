function validateUserInput({ username, password, email, firstname, lastname }) {
  // Check if any required fields are missing
  if (!username || !password || !email || !firstname || !lastname) {
    throw new Error("Missing required fields");
  }

  // Check that all inputs are of type string
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof email !== "string" ||
    typeof firstname !== "string" ||
    typeof lastname !== "string"
  ) {
    throw new Error("All inputs must be of type string");
  }

  // Check if the email contains "@"
  if (!email.includes("@")) {
    throw new Error("Invalid email format");
  }
}

module.exports = { validateUserInput };
