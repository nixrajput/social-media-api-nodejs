/**
 * Define Logger
 */

import winston from "winston";
import LocalConfig from "../configs/LocalConfig";

// const {
//   MongoDB,
// }: { MongoDB: MongoDBTransportInstance } = require("winston-mongodb");

// Define your severity levels.
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define different colors for each level.
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

// Link colors of the log levels.
winston.addColors(colors);

// Define format of the logger
let _consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })
);

if (LocalConfig.getConfig().NODE_ENV !== "development") {
  _consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  );
}

// Define transports of the logger
const transports: winston.transport[] = [
  new winston.transports.Console({
    handleExceptions: true,
    format: _consoleFormat,
  }),
];

// Create the logger instance
const Logger = winston.createLogger({
  level: "debug",
  levels,
  transports,
});

export default Logger;
