import mongoose from "mongoose";
import { sendNotification } from "../firebase/utility";
import { Chat } from "../models/chat";
import user from "../models/user";

const unseenMessageTimers: Map<string, NodeJS.Timeout> = new Map();

// Schedule notification for unseen messages
export const scheduleUnseenNotification = (chatId: string, messageId: string, userId: string) => {
  const timerKey = `${chatId}:${messageId}:${userId}`;
  
  if (unseenMessageTimers.has(timerKey)) return; // Avoid duplicate timers

  const timer = setTimeout(async () => {
    // Check if the message is still unseen
    const chat = await Chat.findOne({ _id: chatId, "messages._id": messageId });
    const message = chat?.messages.find(msg => msg._id.toString() === messageId);

    if (message && !message.seenBy.includes(new mongoose.Types.ObjectId(userId))) {
      // Send notification
      const newUser = await user.findById(userId);
      if (newUser) {
        await sendNotification(newUser.deviceTokens, {
          title: "New Message",
          body: message.content || "You have a new message!",
          data: { chatId, messageId },
        });
      }
    }

    unseenMessageTimers.delete(timerKey); // Remove the timer
  }, 30000); // Wait 30 seconds

  unseenMessageTimers.set(timerKey, timer);
};

// const activeChats: Map<string, Set<string>> = new Map(); // Map of chatId -> Set of userIds

// // Add user to active chat
// const markUserAsActive = (chatId: string, userId: string) => {
//   if (!activeChats.has(chatId)) {
//     activeChats.set(chatId, new Set());
//   }
//   activeChats.get(chatId)!.add(userId);
// };

// // Remove user from active chat
// const markUserAsInactive = (chatId: string, userId: string) => {
//   if (activeChats.has(chatId)) {
//     activeChats.get(chatId)!.delete(userId);
//     if (activeChats.get(chatId)!.size === 0) {
//       activeChats.delete(chatId);
//     }
//   }
// };

// // Check if a user is active
// const isUserActive = (chatId: string, userId: string): boolean => {
//   return activeChats.has(chatId) && activeChats.get(chatId)!.has(userId);
// };

// // Suppress notification if user is active
// export const shouldSendNotification = (chatId: string, userId: string): boolean => {
//   return !isUserActive(chatId, userId);
// };
 //Suppress notification if the user is active
 // if(!shouldSendNotification(chatId,userId)) return;