"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const logging_1 = require("../utils/logging");
const constants_1 = __importDefault(require("../utils/constants"));
const universalFunctions_1 = require("../utils/universalFunctions");
const jwt_1 = require("../middlewares/jwt");
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, logging_1.startSection)("userLogin");
    (0, logging_1.logRequest)(req);
    const schema = joi_1.default.object().keys({
        email: joi_1.default.string()
            .trim()
            .regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
            .max(constants_1.default.emailMaxSize)
            .required()
            .messages({
            "string.pattern.base": "Invalid email format. Please enter a valid email address.",
        }),
        password: joi_1.default.string().required(),
        deviceId: joi_1.default.string().optional().allow(""),
        deviceTtype: joi_1.default.string().optional().allow(""),
        deviceModel: joi_1.default.string().optional().allow(""),
    });
    let validFields = validateFields(req.body, res, schema);
    if (validFields) {
        req.body.req_ip = req.connection.remoteAddress;
        next();
    }
});
const validateFields = (req, res, schema) => {
    const validation = schema.validate(req);
    if (validation.error) {
        const errorReason = validation.error.message;
        (0, universalFunctions_1.sendError)(new Error(errorReason), res, {});
        return false;
    }
    return true;
};
const userRegistration = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, logging_1.startSection)("userRegistraion");
    (0, logging_1.logRequest)(req);
    // Joi Schema
    const userSchema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required(),
        name: joi_1.default.string().optional(),
        bio: joi_1.default.string().optional(),
        designation: joi_1.default.string().optional(),
        department: joi_1.default.string().optional(),
        skills: joi_1.default.array().items(joi_1.default.string()).optional(),
        workLocation: joi_1.default.string().optional(),
    });
    let validFields = validateFields(req.body, res, userSchema);
    if (validFields) {
        req.body.req_ip = req.connection.remoteAddress;
        next();
    }
});
const userUpdate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, logging_1.startSection)("userUpdate");
    (0, logging_1.logRequest)(req);
    // Joi Schema
    const userSchema = joi_1.default.object({
        email: joi_1.default.any().forbidden(),
        name: joi_1.default.string().optional(),
        bio: joi_1.default.string().optional(),
        designation: joi_1.default.string().optional(),
        department: joi_1.default.string().optional(),
        skills: joi_1.default.array().items(joi_1.default.string()).optional(),
        workLocation: joi_1.default.string().optional(),
    });
    if (req.body.skills && typeof req.body.skills === "string") {
        req.body.skills = JSON.parse(req.body.skills);
    }
    let validFields = validateFields(req.body, res, userSchema);
    if (validFields) {
        const isTokenValid = yield validateTokenFields(req, res, req.method);
        if (isTokenValid) {
            next();
        }
    }
});
const validateTokenFields = (req, res, method) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("REQUEST HEADERS : " + JSON.stringify(req.headers), {}, {});
    try {
        if (!req.headers || !req.headers.authorization) {
            const errorReason = "Authorization header is required";
            (0, universalFunctions_1.sendError)(new Error(errorReason), res, {});
            return false;
        }
        if (!req.headers.authorization.startsWith("Bearer")) {
            const errorReason = "Authorization header format is incorrect";
            (0, universalFunctions_1.sendError)(new Error(errorReason), res, {});
            return false;
        }
        const split = req.headers.authorization.split(" ");
        const accessToken = split[1];
        // if (method === "GET") {
        req.query.accessToken = accessToken;
        const userInfo = yield (0, jwt_1.authenticateJWT)(req.query.accessToken, res);
        if (userInfo !== null && userInfo !== undefined) {
            console.log(userInfo);
            req.query.userId = userInfo["userId"];
        }
        else {
            return false;
        }
        return true;
    }
    catch (err) {
        console.log(`validate token fields failed with ${JSON.stringify(err)}`, err, {});
        (0, universalFunctions_1.sendError)(err, res, {});
        return false;
    }
});
exports.default = {
    userLogin,
    userRegistration,
    userUpdate,
    validateTokenFields,
};
