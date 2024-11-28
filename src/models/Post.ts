import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  userId: string;
  imageUrl: string;
  caption?: string;
  reactions: { userId: string; reactionType: string }[];
  comments: { userId: string; content: string; timestamp: Date }[];
}

const PostSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  caption: { type: String },
  reactions: [{ userId: String, reactionType: String }],
  comments: [{ userId: String, content: String, timestamp: { type: Date, default: Date.now } }],
});

export default mongoose.model<IPost>('Post', PostSchema);
