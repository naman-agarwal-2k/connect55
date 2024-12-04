"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.toISOString = exports.pad = exports.sendSuccess = exports.sendError = void 0;
exports.generateOTP = generateOTP;
const responseMessages_1 = require("./responseMessages");
const logging_1 = require("./logging");
// import QRCode from 'qrcode';
// import { encrypt } from "../middleware/crypto";
// const logger = Logger.getInstance();
const sendError = function (err, res, data) {
    const errorMessage = err.customMessage || err.message || responseMessages_1.ERROR.DEFAULT.customMessage;
    if (typeof err == "object" &&
        err.hasOwnProperty("rescode") &&
        err.hasOwnProperty("customMessage")) {
        return res.status(err.statusCode).send({
            statusCode: err.statusCode,
            message: errorMessage,
            type: err.type || responseMessages_1.ERROR.DEFAULT.type,
        });
    }
    let statusCode = err.hasOwnProperty("statusCode") ? err.statusCode : 400;
    let responseObj = {
        statusCode: statusCode,
        success: false,
        message: errorMessage,
        type: err.type || responseMessages_1.ERROR.DEFAULT.type,
        data: data || {},
    };
    (0, logging_1.logResponse)(responseObj);
    return res.status(statusCode).send(responseObj);
};
exports.sendError = sendError;
const sendSuccess = function (successMsg, data, res, receivedResponseObj) {
    let statusCode = successMsg.statusCode || 200;
    let message = successMsg.customMessage || responseMessages_1.SUCCESS.DEFAULT.customMessage;
    let responseObj = {
        statusCode: statusCode,
        success: true,
        message: message,
        data: data || {},
    };
    //logResponse(responseObj);
    return res.status(statusCode).send(responseObj);
};
exports.sendSuccess = sendSuccess;
function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
}
// export function generatePassword(): string {
//   const length = Constants.passwordLength;
//   const upperletters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//   const lowerletters = "abcdefghijklmnopqrstuvwxyz";
//   const numbers = "0123456789";
//   const symbols = "!#$%&()*+,-./:;<=>?@^[\\]^_`{|}~";
//   let generatedPassword = "";
//   let variationsCount = [1, 1].length;
//   for (let i = 0; i < length; i += variationsCount) {
//     generatedPassword += numbers[Math.floor(Math.random() * numbers.length)];
//     generatedPassword += symbols[Math.floor(Math.random() * symbols.length)];
//     generatedPassword +=
//       lowerletters[Math.floor(Math.random() * lowerletters.length)];
//     generatedPassword +=
//       upperletters[Math.floor(Math.random() * upperletters.length)];
//   }
//   const finalPassword = generatedPassword.slice(0, length);
//   return Md5.hashStr(finalPassword);
// }
const pad = function (number) {
    return number.toString().padStart(2, "0");
};
exports.pad = pad;
/***** yyyy-MM-dd'T'HH:mm:ss.SSS'Z' *****/
const toISOString = function () {
    let date = new Date();
    const year = date.getUTCFullYear();
    const month = (0, exports.pad)(date.getUTCMonth() + 1);
    const day = (0, exports.pad)(date.getUTCDate());
    const hours = (0, exports.pad)(date.getUTCHours());
    const minutes = (0, exports.pad)(date.getUTCMinutes());
    const seconds = (0, exports.pad)(date.getUTCSeconds());
    const milliseconds = date.getUTCMilliseconds().toString().padStart(3, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`; // Removed 'Z'
};
exports.toISOString = toISOString;
/***** Validate Password *****/
const validatePassword = function (password) {
    const minLength = 8;
    const hasLetter = /[a-zA-Z]/;
    const hasNumber = /[0-9]/;
    if (password.length < minLength) {
        throw new Error("Password should be at least 8 characters long.");
    }
    if (!hasLetter.test(password)) {
        throw new Error("Password should contain at least one letter.");
    }
    if (!hasNumber.test(password)) {
        throw new Error("Password should contain at least one number.");
    }
    return true;
};
exports.validatePassword = validatePassword;
// export const uploadFilesToS3Storage = (payload: any, res: any) => {
//   return new Promise((resolve, reject) => {
//     AWS.config.update({
//       accessKeyId: process.env.AWS_ACCESS_KEY,
//       secretAccessKey: process.env.AWS_SECRET_KEY,
//       region: process.env.AWS_S3_STORAGE_REGION,
//     });
//     let s3 = new AWS.S3();
//     payload = payload.files[0];
//     let params: any = {
//       Bucket: process.env.AWS_S3_STORGAE_BUCKET_NAME,
//       Body: payload.buffer,
//       Key: payload.originalname,
//     };
//     s3.upload(params, function (error: any, data: any) {
//       if (error) {
//         sendError(error.message, res, {});
//       }
//       if (data) {
//         // logger.info("File successfully uploaded on bucket");
//         return resolve(data);
//       }
//     });
//   });
// };
// export const generateQRCode = async (
//   userData: any
// ): Promise<any | undefined> => {
//   const baseUrl = Constants.webAppURL;
//   let paymentStatus = "";
//   let request: any = {
//     user_id: userData.userId,
//   };
//   if (userData.paymentStatus !== null && userData.paymentStatus !== undefined) {
//     paymentStatus = userData.paymentStatus;
//   }
//   const encryptedData = encrypt(request);
//   const encryptedUrl = `${baseUrl}?payment_status=${paymentStatus}&data=${encryptedData}`;
//   try {
//     const qrCodeDataUrl = await QRCode.toDataURL(encryptedUrl);
//     return {
//       success: true,
//       encryptedHomeUrl: encryptedUrl,
//       url: qrCodeDataUrl,
//     };
//   } catch (err) {
//     console.error("Error generating QR code:", err);
//     return { success: false, url: undefined };
//   }
// };
