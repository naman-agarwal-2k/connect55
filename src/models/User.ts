import mongoose, { Schema, Document } from 'mongoose';

const schemaOptions = {
  toJSON: {
    virtuals: true, // Include virtuals in the JSON output
    transform: function (doc:any, ret:any) {
      ret.userId = ret._id; // Rename _id to _chatId
      delete ret._id; // Optionally remove _id
      delete ret.id; // Remove the default id alias
      return ret;
    },
  },
  toObject: {
      virtuals: true,
      transform: function (doc:any, ret:any) {
        ret.userId = ret._id;
        delete ret._id;
        delete ret.id;
        return ret;
      },
    },
  id: false, // Suppress the default id alias
};
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
}, 
schemaOptions
);
// Add a virtual field to alias `_id` to `_userId`
// UserSchema.virtual("_userId").get(function () {
//   return this._id;
// });

export default mongoose.model<IUser>('User', UserSchema);
