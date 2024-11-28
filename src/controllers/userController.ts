import { UserService } from "../services/userService";
import ResponseMessages, { SUCCESS } from "../utils/responseMessages";
import { TITLES } from "../utils/headerTitles";
import { Request, Response } from "express";
import Constants from "../utils/constants";
import {
  sendError,
  sendSuccess,
  toISOString,
  validatePassword,
} from "../utils/universalFunctions";
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Joi from 'joi';

export class UserController{
    private userService: UserService;

    constructor(userService: UserService){
        this.userService=userService;
    }

    public async getHeaderTitles(payload: Request, res: Response): Promise<void> {
        try {
            //Extracts the x-api-key value from the headers of the incoming request.
            // x-api-key is typically used as an API key for authentication
            sendSuccess(SUCCESS.DEFAULT, TITLES, res, {});

        //   if (payload.headers["x-api-key"] === process.env.CONTENT_API_KEY) {
        //     const headerTitles = TITLES;
        //     sendSuccess(SUCCESS.DEFAULT, headerTitles, res, {});
        //   } else {
        //     throw new Error(ResponseMessages.ERROR.INVALID_X_API_KEY.customMessage);
        //   }
        } catch (error) {
          sendError(error, res, {});
        }
      }
    
    public async userRegistration(
        payload: Request,
        res: Response
    ): Promise<void> {
      try {
          const {
            email, password, ...rest
          } = payload.body;

          const existingUser = await User.findOne({ email });
          if (existingUser)  throw new Error(
            ResponseMessages.ERROR.EMAIL_ALREADY_EXISTS.customMessage
          )
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = new User({ email, password: hashedPassword, ...rest });
          await newUser.save();
          sendSuccess(SUCCESS.REGISTER,newUser, res, {});

        }catch(error){
            sendError(error, res, {});
        }
      }
         
     
// Update User
public async updateUser(req: Request, res: Response):Promise<void> {
    const { id } = req.params;
    try {
         // Prepare update object
    const updateData: any = { ...req.body };

    // Add profilePicture if a file is uploaded
    if (req.file) {
      updateData.profilePicture = `/uploads/${req.file.filename}`;
    }
      const user = await User.findByIdAndUpdate(id, updateData, { new: true });
      if (!user) throw new Error(
        ResponseMessages.ERROR.USER_NOT_FOUND.customMessage
      )
  
      sendSuccess(SUCCESS.PROFILE_UPDATE,user, res, {});
    } catch (err) {
      sendError(err, res, {});
    }
  };
  
  // Delete User
  deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) return res.status(404).json({ error: 'User not found.' });
  
      res.json({ message: 'User deleted successfully.' });
    } catch (err) {
      res.status(500).json({ error:      sendError(err, res, {})
    });
    }
  };     
}
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