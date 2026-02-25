import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    deletedBySender: {
      type: Boolean,
      default: false,
    },
    deletedByRecipient: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for efficient message queries
messageSchema.index({ senderUser: 1, recipientUser: 1 });
messageSchema.index({ createdAt: -1 });

export default mongoose.model("Message", messageSchema);
