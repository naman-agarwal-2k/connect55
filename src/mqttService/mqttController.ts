import { Request,Response } from "express";
import { Chat } from "../models/Chat";
import { sendError, sendSuccess } from "../utils/universalFunctions";
import { ERROR, SUCCESS } from "../utils/responseMessages";
import { mqttClient } from "./mqttClient";
import User from "../models/User";
import mongoose from "mongoose";

export const createChat = async (req: Request, res: Response) => {
    const { type, participants,groupName } = req.body;
  
    try {

             // Validate the type
      if (!['one-to-one', 'group'].includes(type)) {
        return sendError(Error('Invalid chat type'), res, {});
      }

     if (type === 'group' && !groupName) {
            return sendError(new Error('Group name is required for group chats'), res, {});
     }
  
      const chat = new Chat({
        type,
        groupName: type === 'group' ? groupName : null,
        participants,
      });
  
      await chat.save();
      sendSuccess(SUCCESS.DEFAULT, chat, res, {});
    } catch (err) {
      sendError(err, res, {});
    }
  };

  export const updateGroupChat = async (req:Request, res: Response)=>{
    const {chatId,groupName,addMembers,removeMembers}=req.body;

    try{
        const chat = await Chat.findById(chatId);
        if(!chat){
            return sendError("Chat NotFound",res,{});
        }
        // Check if the chat is a group
        if(chat.type !=="group"){
            return sendError(new Error("Only group chats can be updated"),res,{});
        }

        // Update the group name if provided
        if(groupName){
            chat.groupName=groupName;
        }

        // Add members if provided
        if(addMembers && addMembers.length >0){
            for(const userId of addMembers){
                const user = await User.findById(userId);
                if(!user){
                    return sendError(new Error(`User with ID ${userId} not found`), res, {});
                }

                if(!chat.participants.includes(userId)){
                    chat.participants.push(userId);
                }
            }
        }

           // Remove members if provided
           if (removeMembers && removeMembers.length > 0) {
            chat.participants = chat.participants.filter(
                (participantId:  mongoose.Types.ObjectId) => !removeMembers.includes(participantId.toString())
            );
        }

               // Save the updated chat
               await chat.save();
               sendSuccess(SUCCESS.DEFAULT, chat, res, {});

    }catch(err){
        sendError(err, res, {});

    }
  }
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
    console.log("send message API Triggered with body:", req.body);

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
