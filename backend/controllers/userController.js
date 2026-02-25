import User from "../models/User.js";
import Match from "../models/Match.js";

// Get all users for swiping (excluding current user and already matched/swiped)
export const getSwipeUsers = async (req, res) => {
  try {
    const currentUserId = req.userId;

    // Only exclude users where current user has ALREADY passed or matched
    // (NOT one-sided likes — those should still appear so the other person can like back)
    const excludedInteractions = await Match.find({
      $or: [
        // Current user passed someone
        { user1: currentUserId, status: { $in: ["passed", "matched"] } },
        { user2: currentUserId, status: { $in: ["passed", "matched"] } },
        // Current user already liked them (user1Liked = true and current user IS user1)
        { user1: currentUserId, user1Liked: true },
        // Current user already liked them (user2Liked = true and current user IS user2)
        { user2: currentUserId, user2Liked: true },
      ],
    });

    const excludedUserIds = excludedInteractions.flatMap((m) => {
      // Exclude the OTHER user in the record, not current user
      const other = m.user1.toString() === currentUserId ? m.user2.toString() : m.user1.toString();
      return [other];
    });

    // Get current user to check preferences
    const currentUser = await User.findById(currentUserId);

    // Build gender filter based on preference
    const genderFilter = currentUser?.interestedIn && currentUser.interestedIn !== "both"
      ? { gender: currentUser.interestedIn }
      : {};

    // isDiscoverable: { $ne: false } includes all users who never set the field
    const users = await User.find({
      _id: { $nin: [...new Set(excludedUserIds), currentUserId] },
      isDiscoverable: { $ne: false },
      ...genderFilter,
    })
      .select("-password")
      .limit(20);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all matches for current user
export const getMatches = async (req, res) => {
  try {
    const userId = req.userId;

    const matches = await Match.find({
      $or: [{ user1: userId }, { user2: userId }],
      isMatched: true,
    })
      .populate("user1")
      .populate("user2");

    const formattedMatches = matches.map((match) => {
      const otherUser = match.user1._id.toString() === userId ? match.user2 : match.user1;
      return {
        ...match.toObject(),
        otherUser,
      };
    });

    res.status(200).json(formattedMatches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, bio, age, interests, location, profilePictureUrl, photos, isDiscoverable } =
      req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (age) updateData.age = age;
    if (interests) updateData.interests = interests;
    if (location) updateData.location = location;
    if (profilePictureUrl !== undefined) updateData.profilePictureUrl = profilePictureUrl;
    if (photos) updateData.photos = photos;
    if (isDiscoverable !== undefined) updateData.isDiscoverable = isDiscoverable;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile by ID
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
