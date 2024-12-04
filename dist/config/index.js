"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv = require('dotenv');
dotenv.config();
exports.config = {
    port: 9000,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    DB_CONN_STRING: process.env.DB_CONN_STRING,
};
