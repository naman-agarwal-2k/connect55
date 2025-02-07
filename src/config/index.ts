
const dotenv = require('dotenv');
dotenv.config();

export const config = {
    port:9000,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    DB_CONN_STRING: process.env.DB_CONN_STRING,
}