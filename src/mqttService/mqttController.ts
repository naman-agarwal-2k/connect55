import { NextFunction, Request,RequestHandler,Response } from "express";
import { Chat } from "../models/Chat";
import { sendError, sendSuccess } from "../utils/universalFunctions";
import { ERROR, SUCCESS } from "../utils/responseMessages";
import { mqttClient } from "./mqttClient";
import User from "../models/User";
import mongoose from "mongoose";
import upload from "../middlewares/upload";
import multer from "multer";

export const createChat = async (req: Request, res: Response) => {
    const { type, participants,groupName,adminId } = req.body;
  
    try {

      // Validate the type
      if (!['one-to-one', 'group'].includes(type)) {
        return sendError(Error('Invalid chat type'), res, {});
      }

     if (type === 'group' ) {
      if(!groupName){
            return sendError(new Error('Group name is required for group chats'), res, {});
          }
          else if (!participants.includes(adminId)) {
            return sendError(new Error('Admin must be a participant of the group.'), res, {});
        }
        }
     if(type === "one-to-one" && (participants.length>2)){
      return sendError(new Error('Try creating group to chat with more people'), res, {});
     }
      const chat = new Chat({
        type,
        groupName: type === 'group' ? groupName : null,
        participants,
        groupAdmin:adminId
      });
  
      await chat.save();
      sendSuccess(SUCCESS.DEFAULT, chat, res, {});
    } catch (err) {
      sendError(err, res, {});
    }
  };

  export const updateGroupChat = async (req: Request, res: Response) => {
    const {userId, groupAdminIds, chatId, groupName, addMembers, removeMembers } = req.body;

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return sendError("Chat NotFound", res, {});
        }

        // Check if the chat is a group
        if (chat.type !== "group") {
            return sendError(new Error("Only group chats can be updated"), res, {});
        }

        // Check if the user is one of the group admins
        if (!chat.groupAdmin.includes(userId)) {
          return sendError(new Error("Only group admins can update participants."), res, {});
        }

        // Update the group name if provided
        if (groupName) {
            chat.groupName = groupName;
        }

        // Add members if provided
        if (addMembers && addMembers.length > 0) {
            for (const userId of addMembers) {
                const user = await User.findById(userId);
                if (!user) {
                    return sendError(new Error(`User with ID ${userId} not found`), res, {});
                }

                if (!chat.participants.includes(userId)) {
                    chat.participants.push(userId);
                }
            }
        }

        // Remove members if provided
        if (removeMembers && removeMembers.length > 0) {
            chat.participants = chat.participants.filter(
                (participantId: mongoose.Types.ObjectId) => !removeMembers.includes(participantId.toString())
            );
        }

        // Update group admins if groupAdminIds are provided
        if (groupAdminIds && groupAdminIds.length > 0) {
            for (const adminId of groupAdminIds) {
                // Ensure the admin is a participant
                if (!chat.participants.includes(adminId)) {
                    return sendError(new Error(`Admin with ID ${adminId} must be a participant to be assigned as an admin.`), res, {});
                }

                if (!chat.groupAdmin.includes(adminId)) {
                    chat.groupAdmin.push(adminId);
                }
            }
        }

        // Save the updated chat
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
      const chat = await Chat.findById(chatId).populate("participants", "name profilePicture"); // Populating participants with their names
      if (!chat) {
        return sendError(new Error("Chat not found"), res, {});
      }
      sendSuccess(SUCCESS.DEFAULT, chat, res, {});
    } catch (err) {      sendError(err, res, {});
    }
  };

  export const sendMessage: RequestHandler[] = [
    (req, res, next) => {
      upload.single("media")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          // Multer-specific error (e.g., file size exceeded)
          return res.status(400).json({ success: false, message: err.message });
        } else if (err) {
          // Other errors (e.g., invalid file type)
          return res.status(400).json({ success: false, message: err.message });
        }
        next();
      });
    },async (req: Request, res: Response) => {
    console.log("send message API Triggered with body:", req.body);
    
    const { chatId, senderId, content, media } = req.body;
  
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) {
        return sendError(Error('Chat not found'), res, {});
      }
  
      const message = {
        senderId: senderId,
        content,
        media: req.file ? `/uploads/chat-media/${req.file.filename}` : null, // File or image path
        timestamp: Date.now(),
      };
  
      chat.messages.push(message);
      await chat.save();
  
      // Publish the message to MQTT
      mqttClient.publish(`chat/${chatId}/messages`, JSON.stringify({message,origin: 'server'}));
  
      sendSuccess(SUCCESS.DEFAULT, message, res, {});
    } catch (err) {
      sendError(err, res, {});
    }
  }];

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
