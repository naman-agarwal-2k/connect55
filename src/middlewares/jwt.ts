const jwtSecretKey: any = process.env.JWT_SECRET_KEY;
import jwt from "jsonwebtoken";
import constants from "../utils/constants";
import { sendError } from "../utils/universalFunctions";
import { ERROR } from "../utils/responseMessages";

export const generateAccessToken = function (accessTokenParams: any) {
  const token = jwt.sign(
    {
      userId: accessTokenParams.userId,
      emailId: accessTokenParams.emailId,
      // string: accessTokenParams.randomString,
    },
    jwtSecretKey,
    {
      expiresIn: constants.accessTokenExpiryDays.EXPIRY_DAYS + "d",
    }
  );
  return token;
};


export const authenticateJWT = async function (accessToken: string, res: any): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.verify(accessToken, jwtSecretKey, (err: any, decoded: any) => {
      if (err) {
               sendError(ERROR.JWT_TOKEN_EXPIRED, res,{});
         return;
      }

      const userId = decoded.userId;
      resolve(userId); // Resolve the promise with userId
    });
  });
};


export const accessTokenExpiryTime = function () {
  const date = new Date();
  const expiryTime = date.setUTCDate(date.getUTCDate() + 7);
  return expiryTime;
};

export default {
  generateAccessToken,
  authenticateJWT,
};
