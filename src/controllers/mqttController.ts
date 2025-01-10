import { NextFunction, Request,RequestHandler,Response } from "express";
import { Chat, Message } from "../models/chat";
import { sendError, sendSuccess } from "../utils/universalFunctions";
import { ERROR, SUCCESS } from "../utils/responseMessages";
import { mqttClient } from "../mqttService/mqttClient";
import User from "../models/user";
import mongoose from "mongoose";
import upload from "../middlewares/upload";
import multer from "multer";
import path from "path";
import fs from "fs";

export const createChat = async (req: Request, res: Response) => {
    const { type,groupName,adminId } = req.body;
      try {
        const participants = JSON.parse(req.body.participants);

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
      console.log(participants.length);
      return sendError(new Error('Try creating group to chat with more people'), res, {});
     }

     const existingChat = await Chat.findOne({
      type: "one-to-one",
      $and: [
        { participants: { $all: participants } }, // Ensure all participants exist
        { "participants.2": { $exists: false } }, // Ensure only two participants (index 2 should not exist)
      ],
    });
    
    if (existingChat) {
      return sendError(new Error('Chat already exists'), res, { chatId: existingChat._id });
    }
  
      const chat = new Chat({
        type,
        groupName: type === 'group' ? groupName : null,
        participants,
        groupAdmin:adminId,
        groupIcon:req.file?`/uploads/group-icons/${req.file.filename}`:null
      });
  
      await chat.save();
      sendSuccess(SUCCESS.DEFAULT, chat, res, {});
    } catch (err) {
      sendError(err, res, {});
    }
  };

  export const updateGroupChat = async (req: Request, res: Response) => {
    const { userId, chatId, groupName } = req.body;
    try {
          // Parse fields expected to be arrays
    const groupAdminIds = req.body.groupAdminIds ? JSON.parse(req.body.groupAdminIds) : [];
    const addMembers = req.body.addMembers ? JSON.parse(req.body.addMembers) : [];
    const removeMembers = req.body.removeMembers ? JSON.parse(req.body.removeMembers) : [];

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return sendError(Error("Chat NotFound"), res, {});
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

        if (req.file) {
              const newGroupIconPath = `/uploads/group-icon/${req.file.filename}`;
        
              // Remove old profile picture if it exists
              if (chat.groupIcon) {
                const oldProfilePicturePath = path.join(__dirname, "..", chat.groupIcon);
        
                if (fs.existsSync(oldProfilePicturePath)) {
                  fs.unlinkSync(oldProfilePicturePath); // Delete the old file
                }
              }
        
              chat.groupIcon = newGroupIconPath;
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

  export const getChatByChatId = async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const {lastMessageId,limit=2}=req.query;
  
    try {
      const chat = await Chat.findById(chatId).populate("participants groupIcon","name profilePicture"); // Populating participants with their names
      if (!chat) {
        return sendError(new Error("Chat not found"), res, {});
      }
      // Convert messages to a standard array for safe operations
      let messages = chat.messages.map((msg) => msg.toObject());

      if (lastMessageId) {
        const lastMessageObjectId = new mongoose.Types.ObjectId(lastMessageId as string); // Convert `lastMessageId` to ObjectId
        messages = messages.filter((message) => message._id < lastMessageObjectId);
      }
  
    messages = messages.sort((a, b) => {
    const aTimestamp = new mongoose.Types.ObjectId(a._id).getTimestamp().getTime();
    const bTimestamp = new mongoose.Types.ObjectId(b._id).getTimestamp().getTime();
    return bTimestamp - aTimestamp; // Descending order
    });
    messages = messages.slice(0,Number(limit))
    chat.messages=new mongoose.Types.DocumentArray(messages);;
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
      // Publish the message to MQTT
      mqttClient.publish(`chat/${chatId}/messages`, JSON.stringify({message,origin: 'server'}));

      chat.messages.push(message);

      await chat.save();
  
  
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
