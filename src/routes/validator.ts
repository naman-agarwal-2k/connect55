import Joi from "joi";
import { logRequest, startSection } from "../utils/logging"
import constants from "../utils/constants";
import { sendError } from "../utils/universalFunctions";




const userLogin= async(req:any,res:any,next:any)=>{
    startSection("userLogin");
    logRequest(req);
}

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
  });
    let validFields = validateFields(req.body, res, userSchema);
    if (validFields) {
      req.body.req_ip = req.connection.remoteAddress;
      next();
    }
  };

export default {
    userLogin,
    userRegistration
}