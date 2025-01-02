import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now, expires: 3600 * 24 * 7 }, // Auto-delete after 7 days
  },
  { timestamps: true }
);

export const TokenBlacklist = mongoose.model("TokenBlacklist", tokenBlacklistSchema);
