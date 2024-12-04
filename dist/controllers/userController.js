"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const responseMessages_1 = __importStar(require("../utils/responseMessages"));
const headerTitles_1 = require("../utils/headerTitles");
const universalFunctions_1 = require("../utils/universalFunctions");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const jwt_1 = require("../middlewares/jwt");
class UserController {
    constructor(userService) {
        // Delete User
        this.deleteUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const user = yield User_1.default.findByIdAndDelete(id);
                if (!user)
                    return res.status(404).json({ error: 'User not found.' });
                res.json({ message: 'User deleted successfully.' });
            }
            catch (err) {
                res.status(500).json({ error: (0, universalFunctions_1.sendError)(err, res, {})
                });
            }
        });
        this.userService = userService;
    }
    getHeaderTitles(payload, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //Extracts the x-api-key value from the headers of the incoming request.
                // x-api-key is typically used as an API key for authentication
                (0, universalFunctions_1.sendSuccess)(responseMessages_1.SUCCESS.DEFAULT, headerTitles_1.TITLES, res, {});
                //   if (payload.headers["x-api-key"] === process.env.CONTENT_API_KEY) {
                //     const headerTitles = TITLES;
                //     sendSuccess(SUCCESS.DEFAULT, headerTitles, res, {});
                //   } else {
                //     throw new Error(ResponseMessages.ERROR.INVALID_X_API_KEY.customMessage);
                //   }
            }
            catch (error) {
                (0, universalFunctions_1.sendError)(error, res, {});
            }
        });
    }
    userRegistration(payload, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = payload.body, { email, password } = _a, rest = __rest(_a, ["email", "password"]);
                const existingUser = yield User_1.default.findOne({ email });
                if (existingUser)
                    throw new Error(responseMessages_1.default.ERROR.EMAIL_ALREADY_EXISTS.customMessage);
                const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                const newUser = new User_1.default(Object.assign({ email, password: hashedPassword }, rest));
                yield newUser.save();
                (0, universalFunctions_1.sendSuccess)(responseMessages_1.SUCCESS.REGISTER, newUser, res, {});
            }
            catch (error) {
                (0, universalFunctions_1.sendError)(error, res, {});
            }
        });
    }
    userLogin(payload, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = payload.body;
                const existingUser = yield User_1.default.findOne({ email });
                if (!existingUser)
                    throw new Error(responseMessages_1.default.ERROR.INVALID_EMAIL.customMessage);
                const isPasswordValid = yield bcryptjs_1.default.compare(password, existingUser.password);
                if (!isPasswordValid)
                    throw new Error(responseMessages_1.default.ERROR.INVALID_PASSWORD.customMessage);
                // const randomString = toISOString() + existingUser._id + existingUser.email;
                const accessTokenParams = {
                    userId: existingUser._id,
                    emailId: existingUser.email,
                    // randomString: randomString,
                };
                const token = (0, jwt_1.generateAccessToken)(accessTokenParams);
                const userResponse = {
                    userId: existingUser._id,
                    emailId: existingUser.email,
                    token: token,
                };
                (0, universalFunctions_1.sendSuccess)(responseMessages_1.SUCCESS.LOGIN, userResponse, res, {});
            }
            catch (error) {
                (0, universalFunctions_1.sendError)(error, res, {});
            }
        });
    }
    // Update User
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                // Fetch user by ID
                const user = yield User_1.default.findById(id);
                if (!user) {
                    throw new Error(responseMessages_1.default.ERROR.USER_NOT_FOUND.customMessage);
                }
                // Prepare update object
                const updateData = Object.assign({}, req.body);
                // Add profilePicture if a file is uploaded
                if (req.file) {
                    const newProfilePicturePath = `/uploads/profile-pictures/${req.file.filename}`;
                    // Remove old profile picture if it exists
                    if (user.profilePicture) {
                        const oldProfilePicturePath = path_1.default.join(__dirname, "..", user.profilePicture);
                        if (fs_1.default.existsSync(oldProfilePicturePath)) {
                            fs_1.default.unlinkSync(oldProfilePicturePath); // Delete the old file
                        }
                    }
                    updateData.profilePicture = newProfilePicturePath;
                }
                // Update the user instance and save
                user.set(updateData);
                const updatedUser = yield user.save();
                // Send updated user data in response
                (0, universalFunctions_1.sendSuccess)(responseMessages_1.SUCCESS.PROFILE_UPDATE, updatedUser, res, {});
            }
            catch (err) {
                (0, universalFunctions_1.sendError)(err, res, {});
            }
        });
    }
    getUserData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                if (!id) {
                    throw new Error(responseMessages_1.default.ERROR.ID_NOT_FOUND.customMessage);
                }
                const user = yield User_1.default.findById(id);
                if (!user)
                    throw new Error(responseMessages_1.default.ERROR.USER_NOT_FOUND.customMessage);
                // Send user data
                (0, universalFunctions_1.sendSuccess)(responseMessages_1.SUCCESS.PROFILE_LIST, user, res, {});
            }
            catch (err) {
                (0, universalFunctions_1.sendError)(err, res, {});
            }
        });
    }
    ;
}
exports.UserController = UserController;
