import Message from "../models/Message.js";
import Match from "../models/Match.js";

// Send message
export const sendMessage = async (req, res) => {
  try {
    const senderUserId = req.userId;
    const { recipientUserId, content } = req.body;

    if (!recipientUserId || !content) {
      return res
        .status(400)
        .json({ message: "Recipient ID and content are required" });
    }

    // Check if users are matched
    const match = await Match.findOne({
      $or: [
        { user1: senderUserId, user2: recipientUserId },
        { user1: recipientUserId, user2: senderUserId },
      ],
      isMatched: true,
    });

    if (!match) {
      return res
        .status(403)
        .json({ message: "You can only message matched users" });
    }

    const message = new Message({
      senderUser: senderUserId,
      recipientUser: recipientUserId,
      content,
    });

    await message.save();

    res.status(201).json({
      message: "Message sent successfully",
      data: message.toObject(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get conversation with a user
export const getConversation = async (req, res) => {
  try {
    const userId = req.userId;
    const { otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderUser: userId, recipientUser: otherUserId },
        { senderUser: otherUserId, recipientUser: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("senderUser", "name profilePictureUrl");

    // Mark messages as read
    await Message.updateMany(
      { recipientUser: userId, senderUser: otherUserId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all conversations
export const getAllConversations = async (req, res) => {
  try {
    const userId = req.userId;

    // Get all matched users
    const matches = await Match.find({
      $or: [{ user1: userId }, { user2: userId }],
      isMatched: true,
    })
      .populate("user1")
      .populate("user2");

    // Get last message from each conversation
    const conversations = await Promise.all(
      matches.map(async (match) => {
        const otherUser =
          match.user1._id.toString() === userId ? match.user2 : match.user1;

        const lastMessage = await Message.findOne({
          $or: [
            { senderUser: userId, recipientUser: otherUser._id },
            { senderUser: otherUser._id, recipientUser: userId },
          ],
        })
          .sort({ createdAt: -1 })
          .limit(1);

        const unreadCount = await Message.countDocuments({
          senderUser: otherUser._id,
          recipientUser: userId,
          isRead: false,
        });

        return {
          otherUser,
          lastMessage,
          unreadCount,
          matchId: match._id,
        };
      })
    );

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete message
export const deleteMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { messageId } = req.params;

    const message = await Message.findOne({
      _id: messageId,
      senderUser: userId,
    });

    if (!message) {
      return res
        .status(404)
        .json({ message: "Message not found or unauthorized" });
    }

    message.deletedBySender = true;
    await message.save();

    res.status(200).json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
