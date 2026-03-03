const LOG_LEVELS = {
  error: "ERROR",
  warn: "WARN",
  info: "INFO",
  debug: "DEBUG",
};

const getLogLevel = () => {
  return process.env.LOG_LEVEL || "info";
};

const formatLog = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level: LOG_LEVELS[level] || level.toUpperCase(),
    message,
  };

  if (data) {
    logEntry.data = data;
  }

  return JSON.stringify(logEntry);
};

export const logger = {
  error: (message, data = null) => {
    console.error(formatLog("error", message, data));
  },
  warn: (message, data = null) => {
    console.warn(formatLog("warn", message, data));
  },
  info: (message, data = null) => {
    if (getLogLevel() !== "error") {
      console.log(formatLog("info", message, data));
    }
  },
  debug: (message, data = null) => {
    if (getLogLevel() === "debug") {
      console.log(formatLog("debug", message, data));
    }
  },
};

export const loggerMiddleware = (req, res, next) => {
  const startTime = Date.now();
  const { method, path, query, body } = req;

  // Log request
  logger.info(`Incoming ${method} request`, { path, query });

  // Log response
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    logger.info(`${method} ${path} - ${res.statusCode}`, {
      duration: `${duration}ms`,
    });
  });

  next();
};
