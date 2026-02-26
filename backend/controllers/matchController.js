import Match from "../models/Match.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

// Like a user
export const likeUser = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ message: "Target user ID is required" });
    }

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "You cannot like yourself" });
    }

    // Check if target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find or create match record
    let match = await Match.findOne({
      $or: [
        { user1: currentUserId, user2: targetUserId },
        { user1: targetUserId, user2: currentUserId },
      ],
    });

    if (!match) {
      match = new Match({
        user1: currentUserId,
        user2: targetUserId,
      });
    }

    // Update like status based on who is the current user
    if (match.user1.toString() === currentUserId) {
      match.user1Liked = true;
    } else {
      match.user2Liked = true;
    }

    // Check if both liked each other
    if (match.user1Liked && match.user2Liked) {
      match.isMatched = true;
      match.matchedAt = new Date();
      match.status = "matched";
    } else {
      match.status = "liked";
    }

    await match.save();

    // Create Notification
    try {
      // Get current user for their name (for the recipient's notification)
      const currentUser = await User.findById(currentUserId);

      if (match.isMatched) {
        // Notify both users about the match
        await Notification.create([
          {
            recipient: currentUserId,
            sender: targetUserId,
            type: "match",
            message: `You matched with ${targetUser.name}!`,
          },
          {
            recipient: targetUserId,
            sender: currentUserId,
            type: "match",
            message: `You matched with ${currentUser.name}!`,
          },
        ]);
      } else {
        // Notify target user about the like
        await Notification.create({
          recipient: targetUserId,
          sender: currentUserId,
          type: "like",
          message: "Someone liked your profile!",
        });
      }
    } catch (notifError) {
      console.error("Failed to create notification:", notifError);
      // Don't fail the whole request if notification fails
    }

    res.status(200).json({
      message: match.isMatched ? "It's a match!" : "Like sent",
      match: match.toObject(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Pass on a user
export const passUser = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ message: "Target user ID is required" });
    }

    let match = await Match.findOne({
      $or: [
        { user1: currentUserId, user2: targetUserId },
        { user1: targetUserId, user2: currentUserId },
      ],
    });

    if (!match) {
      match = new Match({
        user1: currentUserId,
        user2: targetUserId,
        status: "passed",
      });
    } else {
      match.status = "passed";
    }

    await match.save();

    res.status(200).json({
      message: "User passed",
      match: match.toObject(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unlike a user
export const unlikeUser = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const { targetUserId } = req.body;

    const match = await Match.findOne({
      $or: [
        { user1: currentUserId, user2: targetUserId },
        { user1: targetUserId, user2: currentUserId },
      ],
    });

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    // Revert like status
    if (match.user1.toString() === currentUserId) {
      match.user1Liked = false;
    } else {
      match.user2Liked = false;
    }

    // Reset match status if unmatch
    if (!match.user1Liked && !match.user2Liked) {
      match.isMatched = false;
      match.status = "pending";
    }

    await match.save();

    res.status(200).json({
      message: "Like removed",
      match: match.toObject(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
