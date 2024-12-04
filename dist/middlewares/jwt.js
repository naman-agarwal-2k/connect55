"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessTokenExpiryTime = exports.authenticateJWT = exports.generateAccessToken = void 0;
const jwtSecretKey = process.env.JWT_SECRET_KEY;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = __importDefault(require("../utils/constants"));
const generateAccessToken = function (accessTokenParams) {
    const token = jsonwebtoken_1.default.sign({
        userId: accessTokenParams.userId,
        emailId: accessTokenParams.emailId,
        // string: accessTokenParams.randomString,
    }, jwtSecretKey, {
        expiresIn: constants_1.default.accessTokenExpiryDays.EXPIRY_DAYS + "d",
    });
    return token;
};
exports.generateAccessToken = generateAccessToken;
const authenticateJWT = (accessToken, res) => {
    const token = accessToken;
    jsonwebtoken_1.default.verify(token, jwtSecretKey, (err, decoded) => {
        if (err) {
            console.log("ffff", err);
            return res.status(403).json({ message: "Invalid or expired token." });
        }
        // Attach user info from token to the request object
        return decoded; // Contains { id: userId }
    });
};
exports.authenticateJWT = authenticateJWT;
const accessTokenExpiryTime = function () {
    const date = new Date();
    const expiryTime = date.setUTCDate(date.getUTCDate() + 7);
    return expiryTime;
};
exports.accessTokenExpiryTime = accessTokenExpiryTime;
exports.default = {
    generateAccessToken: exports.generateAccessToken,
    authenticateJWT: exports.authenticateJWT,
};
