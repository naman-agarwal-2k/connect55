import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  bio?: string;
  designation?: string;
  department?: string;
  skills?: string[];
  workLocation?: string;
  profilePicture?: string; // URL or path
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: null },
  bio: { type: String, default: null },
  designation: { type: String, default: null },
  department: { type: String, default: null },
  skills: { type: [String], default: [] },
  workLocation: { type: String, default: null },
  profilePicture: { type: String, default: null },
});

export default mongoose.model<IUser>('User', UserSchema);
