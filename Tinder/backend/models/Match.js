import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user1Liked: {
      type: Boolean,
      default: false,
    },
    user2Liked: {
      type: Boolean,
      default: false,
    },
    isMatched: {
      type: Boolean,
      default: false,
    },
    matchedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "liked", "passed", "matched"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Compound index to ensure unique matching records
matchSchema.index({ user1: 1, user2: 1 }, { unique: true });

export default mongoose.model("Match", matchSchema);
