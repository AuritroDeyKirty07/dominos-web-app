import winston from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.errors({ stack: true }), // Preserves error stack traces
    winston.format.timestamp(),
    winston.format.json() // Stores clean JSON in log files
  ),
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error", // Only write errors to this file
    }),
    
  ],
});