const { HTTPStatusCodes } = require('../../constants');

class UnauthorizedError extends Error {
  status;
  data;

  constructor(message: any, data?: any) {
    super(message);
    this.status = HTTPStatusCodes.UNAUTHORIZED;
    this.message = message;
    this.name = "Unauthorized";
    this.data = data
  }
}

module.exports = {
  UnauthorizedError,
};
