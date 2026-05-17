export default class AppError extends Error {
  constructor(statusCode, title, detail, errors) {
    super(detail);
    this.status = statusCode;
    this.title = title;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(detail, errors = []) {
    super(422, "Validation Error", detail, errors);
  }
}

export class AuthenticationError extends AppError {
  constructor(detail, errors = []) {
    super(401, "Authentication Error", detail, errors);
  }
}

export class BadRequestError extends AppError {
  constructor(detail, errors = []) {
    super(400, "BAD REQUEST", detail, errors);
  }
}

//implement winston or any logger in your project
