const formatResponse = (code, message, body) => {
  return {
    code,
    message,
    body,
  };
};

module.exports = formatResponse;
