import { Request,Response } from "express";
import { Chat } from "../models/Chat";
import { sendError, sendSuccess } from "../utils/universalFunctions";
import { ERROR, SUCCESS } from "../utils/responseMessages";
import mqttClient from "./mqttClient";

// export const createChat = async(req: Request, res:Response)=>{
//     const {type,participants}=req.body;

//     try{
//         const chat= new Chat({
//             type,participants
//         });
//         await chat.save();
//         sendSuccess(SUCCESS.DEFAULT, chat, res, {});
//     }catch(err){
//         sendError( err, res,{});
//     }
// };

// export const getChatByUserId = async (req:Request,res:Response)=>{
//     const {userId}= req.params;
//     try{
//         const chats = await Chat.find({participants:userId}).populate('participants');
//         sendSuccess(SUCCESS.DEFAULT, chats, res, {});
//     }catch(err){
//         sendError( err, res,{});
//     }
// }

// export const sendMessage = async (req: Request, res: Response) => {
//     const { chatId, senderId, content, media } = req.body;
  
//     try {
//       const chat = await Chat.findById(chatId);
//       if (!chat) {
//         return sendError( Error('Chat not found' ), res,{});
//       }
  
//       const message = { sender: senderId, content, media, timestamp: Date.now() };
//       chat.messages.push(message);
//       await chat.save();
  
//       // Publish the message to MQTT
//       mqttClient.publish(`chat/${chatId}`, JSON.stringify(message));
//       sendSuccess(SUCCESS.DEFAULT, message, res, {});
//     } catch (err) {
//         sendError( err, res,{});
//     }
//   };
  
export const createChat = async (req: Request, res: Response) => {
    const { type, participants } = req.body;
  
    try {
      // Validate the type
      if (!['one-to-one', 'group'].includes(type)) {
        return sendError(Error('Invalid chat type'), res, {});
      }
  
      const chat = new Chat({
        type,
        participants,
      });
  
      await chat.save();
      sendSuccess(SUCCESS.DEFAULT, chat, res, {});
    } catch (err) {
      sendError(err, res, {});
    }
  };
  export const getChatByUserId = async (req: Request, res: Response) => {
    const { userId } = req.params;
  
    try {
      const chats = await Chat.find({ participants: userId })
        .populate('participants', )
        .sort({ 'messages.timestamp': -1 }).exec();
        if (!chats || chats.length === 0) {
            return sendError(new Error("No chats found for the user"), res, {});
          }
      sendSuccess(SUCCESS.DEFAULT, chats, res, {});
    } catch (err) {
      sendError(err, res, {});
    }
  };
  export const getChatById = async (req: Request, res: Response) => {
    const { chatId } = req.params;
  
    try {
      const chat = await Chat.findById(chatId).populate("participants", "name"); // Populating participants with their names
      if (!chat) {
        return sendError(new Error("Chat not found"), res, {});
      }
      sendSuccess(SUCCESS.DEFAULT, chat, res, {});
    } catch (err) {
      sendError(err, res, {});
    }
  };

  export const sendMessage = async (req: Request, res: Response) => {
    const { chatId, senderId, content, media } = req.body;
  
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) {
        return sendError(Error('Chat not found'), res, {});
      }
  
      const message = {
        sender: senderId,
        content,
        media,
        timestamp: Date.now(),
      };
  
      chat.messages.push(message);
      await chat.save();
  
      // Publish the message to MQTT
      mqttClient.publish(`chat/${chatId}/messages`, JSON.stringify(message));
  
      sendSuccess(SUCCESS.DEFAULT, message, res, {});
    } catch (err) {
      sendError(err, res, {});
    }
  };

  export const markMessageAsSeen = async (req: Request, res: Response) => {
  const { chatId, messageId, userId } = req.body;

  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, 'messages._id': messageId },
      { $addToSet: { 'messages.$.seenBy': userId } },
      { new: true }
    );

    if (!chat) {
      return sendError(Error('Chat or message not found'), res, {});
    }

    sendSuccess(SUCCESS.DEFAULT, chat, res, {});
  } catch (err) {
    sendError(err, res, {});
  }
};
