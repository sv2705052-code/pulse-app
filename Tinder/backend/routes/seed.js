import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

const sampleUsers = [
    {
        name: "Priya Sharma",
        email: "priya.seed@pulse.app",
        age: 24,
        gender: "female",
        interestedIn: "male",
        bio: "Chai > coffee ☕ | Bookworm | Bollywood karaoke every weekend 🎤 | Looking for my co-protagonist.",
        profilePictureUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
        interests: ["Reading", "Bollywood", "Travel", "Yoga"],
        location: { city: "Mumbai", country: "India" },
    },
    {
        name: "Arjun Mehta",
        email: "arjun.seed@pulse.app",
        age: 27,
        gender: "male",
        interestedIn: "female",
        bio: "Software dev by day, amateur chef by night 🍳 | Dog dad 🐕 | Let's grab sushi and debate pineapple on pizza.",
        profilePictureUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop",
        interests: ["Cooking", "Coding", "Dogs", "Hiking"],
        location: { city: "Bangalore", country: "India" },
    },
    {
        name: "Ananya Kapoor",
        email: "ananya.seed@pulse.app",
        age: 22,
        gender: "female",
        interestedIn: "both",
        bio: "Art student + part-time dreamer 🎨 | Museum hopper | My plants have names.",
        profilePictureUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop",
        interests: ["Art", "Museums", "Plants", "Photography"],
        location: { city: "Delhi", country: "India" },
    },
    {
        name: "Rohan Verma",
        email: "rohan.seed@pulse.app",
        age: 29,
        gender: "male",
        interestedIn: "female",
        bio: "Startup founder ⚡ | Marathon runner 🏃 | If I like you, I'll make you the best biryani you've ever had.",
        profilePictureUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
        interests: ["Running", "Entrepreneurship", "Cooking", "Cricket"],
        location: { city: "Hyderabad", country: "India" },
    },
    {
        name: "Kavya Nair",
        email: "kavya.seed@pulse.app",
        age: 25,
        gender: "female",
        interestedIn: "male",
        bio: "Carnatic musician 🎵 | Loves long drives and longer conversations | Will judge your Spotify playlist.",
        profilePictureUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop",
        interests: ["Music", "Long Drives", "Dance", "Food"],
        location: { city: "Chennai", country: "India" },
    },
    {
        name: "Dev Patel",
        email: "dev.seed@pulse.app",
        age: 26,
        gender: "male",
        interestedIn: "female",
        bio: "Astrophysics nerd 🌙 | Guitar > everything | 4:3 aspect ratio stan (fight me).",
        profilePictureUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=500&fit=crop",
        interests: ["Astronomy", "Guitar", "Film", "Physics"],
        location: { city: "Pune", country: "India" },
    },
    {
        name: "Isha Reddy",
        email: "isha.seed@pulse.app",
        age: 23,
        gender: "female",
        interestedIn: "male",
        bio: "Travel writer ✈️ | 23 countries and counting | Looking for someone to get lost with.",
        profilePictureUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop",
        interests: ["Travel", "Writing", "Photography", "Coffee"],
        location: { city: "Goa", country: "India" },
    },
    {
        name: "Karan Singh",
        email: "karan.seed@pulse.app",
        age: 28,
        gender: "male",
        interestedIn: "both",
        bio: "Architect + urban explorer 🏙️ | Finds beauty in old buildings and new conversations.",
        profilePictureUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop",
        interests: ["Architecture", "History", "Coffee", "Cycling"],
        location: { city: "Jaipur", country: "India" },
    },
    {
        name: "Meera Joshi",
        email: "meera.seed@pulse.app",
        age: 26,
        gender: "female",
        interestedIn: "male",
        bio: "Doctor in training 🩺 | Thriller novels and bad puns | Weekend trekker.",
        profilePictureUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=500&fit=crop",
        interests: ["Medicine", "Trekking", "Reading", "Cooking"],
        location: { city: "Kolkata", country: "India" },
    },
    {
        name: "Aditya Bose",
        email: "aditya.seed@pulse.app",
        age: 30,
        gender: "male",
        interestedIn: "female",
        bio: "Jazz musician / barista / occasional poet 🎺 | Trying to find someone who writes back in complete sentences.",
        profilePictureUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop",
        interests: ["Jazz", "Coffee", "Poetry", "Cooking"],
        location: { city: "Mumbai", country: "India" },
    },
];

// GET /api/seed — inserts 10 sample profiles
router.get("/", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("Pulse@1234", salt);

        const results = [];
        for (const u of sampleUsers) {
            const exists = await User.findOne({ email: u.email });
            if (exists) {
                results.push({ name: u.name, status: "skipped (already exists)" });
                continue;
            }
            await User.create({ ...u, password: hashedPassword, isDiscoverable: true });
            results.push({ name: u.name, city: u.location.city, status: "added ✅" });
        }

        res.json({
            message: "Seed complete! All users have password: Pulse@1234",
            results,
        });
    } catch (err) {
        res.status(500).json({ message: "Seed failed", error: err.message });
    }
});

export default router;
