
import mongoose from "mongoose";

// Define the message schema separately (optional)
const MessageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String },
    media: { type: String },  // URL to uploaded image
    timestamp: { type: Date, default: Date.now },
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            // Rename _id to _messageId
            ret.messageId = ret._id;
            delete ret._id;
            delete ret.id;  // Remove the original _id
        }
    }
});
export const Message = mongoose.model('Message', MessageSchema);

const ChatSchema = new mongoose.Schema({
    type: { type: String, enum: ['one-to-one', 'group'], required: true },
    groupName: {
        type: String, // Only for group chats
        default: null,
    },
    pinned:{type: Boolean,default:false},
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [MessageSchema],
    groupAdmin: { type: [String], default: [] },
    groupIcon:{ type: String, default: null },
}, {
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            // Optionally rename _id to _chatId for the chat object itself
            ret.chatId = ret._id;
            delete ret._id;
            delete ret.id;  // Remove the original _id
        }
    }
});

export const Chat = mongoose.model('Chat', ChatSchema);
