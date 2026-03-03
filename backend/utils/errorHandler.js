import { ERROR_CODES } from "./constants.js";

export class CruxError extends Error {
  constructor(message, code = ERROR_CODES.VALIDATION_ERROR, statusCode = 400) {
    super(message);
    this.name = "CruxError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export const createErrorResponse = (error, source = null) => {
  return {
    success: false,
    source,
    error: error.message || "An unexpected error occurred",
    errorCode: error.code || ERROR_CODES.NETWORK_ERROR,
    timestamp: new Date().toISOString(),
  };
};

export const handleAsyncError = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const errorMiddleware = (err, req, res, next) => {
  console.error("Error:", err);

  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    error: err.message || "Internal Server Error",
    errorCode: err.code || ERROR_CODES.NETWORK_ERROR,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
