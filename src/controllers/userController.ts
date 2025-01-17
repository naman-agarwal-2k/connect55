import { UserService } from "../services/userService";
import ResponseMessages, { SUCCESS } from "../utils/responseMessages";
import { TITLES } from "../utils/headerTitles";
import { Request, Response } from "express";
import {
  sendError,
  sendSuccess,
  toISOString,
} from "../utils/universalFunctions";
import bcrypt from 'bcryptjs';
import User from '../models/user';
import fs from "fs";
 import path from "path";
import { generateAccessToken } from "../middlewares/jwt";
import { TokenBlacklist } from "../models/tokenBlackList";


export class UserController{
    private userService: UserService;

    constructor(userService: UserService){
        this.userService=userService;
    }

    public async getHeaderTitles(payload: Request, res: Response): Promise<void> {
        try {
            sendSuccess(SUCCESS.DEFAULT, TITLES, res, {});

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
            email, password,deviceTokens,...rest
          } = payload.body;

          const existingUser = await User.findOne({ email });
          if (existingUser)  throw new Error(
            ResponseMessages.ERROR.EMAIL_ALREADY_EXISTS.customMessage
          )
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = new User({ email, password: hashedPassword,deviceTokens, ...rest });
          await newUser.save();

          //jwt code 
          const accessTokenParams: any = {
            userId: newUser._id,
            emailId: newUser.email,
          };
          const token = generateAccessToken(accessTokenParams);
          const userResponse: any = {
            userId: newUser._id,
            emailId: newUser.email,
            authToken: token,
            deviceTokens:deviceTokens
          };
          sendSuccess(SUCCESS.REGISTER,userResponse, res, {});

        }catch(error){
            sendError(error, res, {});
        }
      }
         
      public async userLogin(
        payload: Request,
        res: Response
    ): Promise<void> {
      try {
          const {
            email,password
          } = payload.body;

          const existingUser = await User.findOne({email});
          if (!existingUser)  throw new Error(
            ResponseMessages.ERROR.INVALID_EMAIL.customMessage
          )
          const isPasswordValid = await bcrypt.compare(password, existingUser.password);
          if (!isPasswordValid)  throw new Error(
            ResponseMessages.ERROR.INVALID_PASSWORD.customMessage
          )
            // const randomString = toISOString() + existingUser._id + existingUser.email;
            const accessTokenParams: any = {
              userId: existingUser._id,
              emailId: existingUser.email,
              // randomString: randomString,
            };
            const token = generateAccessToken(accessTokenParams);
            const userResponse: any = {
              userId: existingUser._id,
              emailId: existingUser.email,
              token: token,
            };
          sendSuccess(SUCCESS.LOGIN,userResponse,res,{}
          );

        }catch(error){
            sendError(error, res, {});
        }
      }
     
// Update User
public async updateUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    // Fetch user by ID
    const user = await User.findById(id);
    if (!user) {
      throw new Error(ResponseMessages.ERROR.USER_NOT_FOUND.customMessage);
    }

    // Prepare update object
    const updateData: any = { ...req.body };

    // Add profilePicture if a file is uploaded
    if (req.file) {
      const newProfilePicturePath = `/uploads/profile-pictures/${req.file.filename}`;

      // Remove old profile picture if it exists
      if (user.profilePicture) {
        const oldProfilePicturePath = path.join(__dirname, "..", user.profilePicture);

        if (fs.existsSync(oldProfilePicturePath)) {
          fs.unlinkSync(oldProfilePicturePath); // Delete the old file
        }
      }

      updateData.profilePicture = newProfilePicturePath;
    }

    // Update the user instance and save
    user.set(updateData);
    const updatedUser = await user.save();

    // Send updated user data in response
    sendSuccess(SUCCESS.PROFILE_UPDATE, updatedUser, res, {});
  } catch (err) {
    sendError(err, res, {});
  }
}

  public async getUserData(req: Request, res:Response): Promise<void>{
    const {id}= req.params;
    try{
      if (!id) {
        throw new Error(ResponseMessages.ERROR.ID_NOT_FOUND.customMessage)
      }
           const user= await User.findById(id);

     if (!user) throw new Error(
      ResponseMessages.ERROR.USER_NOT_FOUND.customMessage
    )

    // Send user data
      sendSuccess(SUCCESS.PROFILE_LIST,user, res, {});
  } catch (err) {
    sendError(err, res, {});
  }
};

public async logout(req: Request, res: Response):Promise<void> {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

    if (!token) {
      return sendError(new Error("Token not provided"), res, {});
    }

    // Add the token to a blacklist (for stateless token invalidation)
    await TokenBlacklist.create({ token });

    sendSuccess(SUCCESS.LOG_OUT,token, res, {});
  } catch (error) {
    sendError(error, res, {});
  }
};

 public async searchUsers(req:Request,res:Response):Promise<void>{
  
  try{
    const {query,role}=req.query;
    //can add limit
    const limit = parseInt(req.query.limit as string) || 8;
    //for pagination
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    const searchQuery=  query && typeof query === "string" ? query : "";
    
    const filter:any = {};

    if(searchQuery){
      filter.$or =[
        {name: new RegExp(searchQuery, 'i')},
        {email: new RegExp(searchQuery, 'i')}
      ];
    }
    if(role){
      filter.role = role;
    }
    // for pagination add between this also .skip(skip)
    const users = await User.find(filter).limit(limit);
    sendSuccess(SUCCESS.DEFAULT,users, res, {});

   }
  catch(err){
    sendError(err, res, {});

  }

 }
  
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
