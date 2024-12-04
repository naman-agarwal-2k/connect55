"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const { combine, label, printf, timestamp } = winston_1.default.format;
class Logger {
    constructor() {
        this.logger = winston_1.default.createLogger({
            level: process.env.NODE_ENV === "prod" ? "info" : "silly",
            format: this.getFormat(process.env.NODE_ENV, 'default'),
            transports: [new winston_1.default.transports.Console()],
        });
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new Logger();
        }
        return this.instance;
    }
    getLogger(module) {
        return winston_1.default.createLogger({
            level: process.env.NODE_ENV === "prod" ? "info" : "silly",
            format: this.getFormat(process.env.NODE_ENV, module),
            transports: [new winston_1.default.transports.Console()],
        });
    }
    getFormat(env, module) {
        const customFormat = printf(({ level, message, label, timestamp }) => {
            return `${timestamp} [${label}] ${level}: ${message}`;
        });
        if (env === "local") {
            return combine(winston_1.default.format.colorize({ all: true }), label({ label: module }), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), customFormat);
        }
        else {
            return combine(label({ label: module }), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), customFormat);
        }
    }
    info(message) {
        this.logger.info(message);
    }
    error(message, err) {
        this.logger.error(`${message} - ${err instanceof Error ? err.message : err}`);
    }
}
exports.default = Logger;
