import winston from "winston";

const transports = [
    new winston.transports.Console()
];

if (!process.env.VERCEL) {
    transports.push(
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
        })
    );
}

export const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports,
});