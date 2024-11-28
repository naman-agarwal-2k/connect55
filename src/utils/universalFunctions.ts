import { SUCCESS, ERROR } from "./responseMessages";
import { logResponse } from "./logging";
import Constants from "./constants";
// import { Md5 } from "ts-md5";
// import AWS from "aws-sdk";
import Logger from "./logger";
// import QRCode from 'qrcode';
// import { encrypt } from "../middleware/crypto";
// const logger = Logger.getInstance();

export const sendError = function (err: any, res: any, data: any) {
  const errorMessage =
    err.customMessage || err.message || ERROR.DEFAULT.customMessage;
  if (
    typeof err == "object" &&
    err.hasOwnProperty("rescode") &&
    err.hasOwnProperty("customMessage")
  ) {
    return res.status(err.statusCode).send({
      statusCode: err.statusCode,
      message: errorMessage,
      type: err.type || ERROR.DEFAULT.type,
    });
  }
  let statusCode = err.hasOwnProperty("statusCode") ? err.statusCode : 400;
  let responseObj = {
    statusCode: statusCode,
    success: false,
    message: errorMessage,
    type: err.type || ERROR.DEFAULT.type,
    data: data || {},
  };
  logResponse(responseObj);
  return res.status(statusCode).send(responseObj);
};

export const sendSuccess = function (
  successMsg: any,
  data: any,
  res: any,
  receivedResponseObj: any
) {
  let statusCode = successMsg.statusCode || 200;
  let message = successMsg.customMessage || SUCCESS.DEFAULT.customMessage;
  let responseObj = {
    statusCode: statusCode,
    success: true,
    message: message,
    data: data || {},
  };
  //logResponse(responseObj);
  return res.status(statusCode).send(responseObj);
};

export function generateOTP(): number {
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

export const pad = function (number: number) {
  return number.toString().padStart(2, "0");
};

/***** yyyy-MM-dd'T'HH:mm:ss.SSS'Z' *****/
export const toISOString = function () {
  let date = new Date();
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  const milliseconds = date.getUTCMilliseconds().toString().padStart(3, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`; // Removed 'Z'
};

/***** Validate Password *****/
export const validatePassword = function (password: string): boolean {
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




