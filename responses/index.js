function sendResponse(statusCode, data) {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: data }),
  };
}

function sendError(statusCode, data) {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ error: data }),
  };
}

module.exports = { sendResponse, sendError };
