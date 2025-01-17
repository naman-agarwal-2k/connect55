import Joi from "joi";
import { logRequest, startSection } from "../utils/logging"
import constants from "../utils/constants";
import { sendError } from "../utils/universalFunctions";
import { authenticateJWT } from "../middlewares/jwt";
import { roleEnum } from "../models/user";


const userLogin = async (req: any, res: any, next: any) => {
  startSection("userLogin");
  logRequest(req);
  const schema = Joi.object().keys({
    email: Joi.string()
      .trim()
      .regex(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
      .max(constants.emailMaxSize)
      .required()
      .messages({
        "string.pattern.base":
          "Invalid email format. Please enter a valid email address.",
      }),
    password: Joi.string().required(),
    deviceId: Joi.string().optional().allow(""),
    deviceTtype: Joi.string().optional().allow(""),
    deviceModel: Joi.string().optional().allow(""),
  });
  let validFields = validateFields(req.body, res, schema);
  if (validFields) {
    req.body.req_ip = req.connection.remoteAddress;
    next();
  }
};

const validateFields = (req: any, res: any, schema: any) => {
    const validation: any = schema.validate(req);
    if (validation.error) {
      const errorReason = validation.error.message;
      sendError(new Error(errorReason), res, {});
      return false;
    }
    return true;
  };
  
const userRegistration = async (req: any, res: any, next: any) => {
    startSection("userRegistraion");
    logRequest(req);
    // Joi Schema
const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().optional(),
    bio: Joi.string().optional(),
    designation: Joi.string().optional(),
    department: Joi.string().optional(),
    skills: Joi.array().items(Joi.string()).optional(),
    workLocation: Joi.string().optional(),
    deviceTokens: Joi.array().items(Joi.string()).optional(),
    authToken:Joi.string().optional(),
    role: Joi.string().valid(...Object.values(roleEnum) ).default('regular').optional, 
  });
    let validFields = validateFields(req.body, res, userSchema);
    if (validFields) {
      req.body.req_ip = req.connection.remoteAddress;
      next();
    }
  };

  const userUpdate = async (req: any, res: any, next: any) => {
    startSection("userUpdate");
    logRequest(req);
    // Joi Schema
const userSchema = Joi.object({
    email: Joi.any().forbidden(),
    name: Joi.string().optional(),
    bio: Joi.string().optional(),
    designation: Joi.string().optional(),
    department: Joi.string().optional(),
    skills: Joi.array().items(Joi.string()).optional(),
    workLocation: Joi.string().optional(),
    deviceTokens: Joi.array().items(Joi.string()).optional(),
    role: Joi.string().valid(...Object.values(roleEnum) ).default(roleEnum.regular).optional, 
  });
      if (req.body.skills && typeof req.body.skills === "string") {
        try{
      req.body.skills = JSON.parse(req.body.skills);}
      catch{
        const errorReason = "Invalid JSON format for skills.";
        sendError(new Error(errorReason), res, {});
        return ;
      }
    }
    if (req.body.deviceTokens && typeof req.body.deviceTokens === "string") {
      try{
    req.body.deviceTokens = JSON.parse(req.body.deviceTokens);}
    catch{
      const errorReason = "Invalid JSON format for deviceTokens.";
      sendError(new Error(errorReason), res, {});
      return ;
    }
  }
    let validFields = validateFields(req.body, res, userSchema);
    if (validFields) {
      const isTokenValid = await validateTokenFields(req, res, req.method);
      if (isTokenValid) {
        next();
      }
    }
  };

  const validateTokenFields = async (req: any, res: any, method: any) => {
    console.log("REQUEST HEADERS : " + JSON.stringify(req.headers), {}, {});
  
    try {
      if (!req.headers || !req.headers.authorization) {
        const errorReason = "Authorization header is required";
        sendError(new Error(errorReason), res, {});
        return false;
      }
      if ( !req.headers.authorization.startsWith("Bearer")) {
        const errorReason = "Authorization header format is incorrect";
        sendError(new Error(errorReason), res, {});
        return false;
       }

      const split = req.headers.authorization.split(" ");
      const accessToken = split[1];
  
      // if (method === "GET") {
        req.query.accessToken = accessToken;
        const userId = await authenticateJWT(req.query.accessToken, res);

        if (userId !== null && userId !== undefined) {
          req.query.userId = userId;
        } else {
          const errorReason = "Something went wrong with JWT token";
          sendError(new Error(errorReason), res, {});
          return false;
        }
      return true;
    } catch (err) {
      console.log(
        `validate token fields failed with ${JSON.stringify(err)}`,
        err,
        {}
      );
      sendError(err, res, {});
      return false;
    }
  };

export default {
    userLogin,
    userRegistration,
    userUpdate,
    validateTokenFields,
}