import winston from "winston";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = (): string => {
  const enviroment = process.env.NODE_ENV;

  if (enviroment === "development") return "debug";
  return "warn";
};

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const transports = [new winston.transports.Console()];

const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default logger;
