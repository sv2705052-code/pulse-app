import { GoogleGenerativeAI } from "@google/generative-ai";
import User from "../models/User.js";
import Match from "../models/Match.js";
import dotenv from "dotenv";

dotenv.config();

export const analyzeMatch = async (req, res) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                message: "Gemini API key is not configured on the server. Please add GEMINI_API_KEY to environment variables."
            });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const { matchId } = req.params;

        // Find the match and populate both users
        const match = await Match.findById(matchId).populate("user1").populate("user2");
        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }

        const { user1, user2 } = match;

        if (!user1 || !user2) {
            return res.status(400).json({ message: "Match users not found" });
        }

        // Construct profile summaries for AI
        const profile1 = {
            name: user1.name,
            bio: user1.bio,
            interests: user1.interests,
            age: user1.age,
            gender: user1.gender
        };

        const profile2 = {
            name: user2.name,
            bio: user2.bio,
            interests: user2.interests,
            age: user2.age,
            gender: user2.gender
        };

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      Analyze the compatibility between these two people for a dating app based on their profiles.
      
      Person 1:
      Name: ${profile1.name}
      Age: ${profile1.age}
      Bio: ${profile1.bio}
      Interests: ${profile1.interests.join(", ")}
      
      Person 2:
      Name: ${profile2.name}
      Age: ${profile2.age}
      Bio: ${profile2.bio}
      Interests: ${profile2.interests.join(", ")}
      
      Provide a response in JSON format (strictly JSON) with the following fields:
      - matchPercentage: A number between 0 and 100 representing their compatibility.
      - compatibilitySummary: A brief paragraph explaining why they are a good match or what challenges they might face.
      - conversationStarters: An array of 3 personalized conversation starters they could use.
      - advice: A short piece of advice for their first date or interaction.
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        console.log("AI Raw Response:", responseText);

        // Clean up potential markdown formatting from AI response
        const jsonString = responseText.replace(/```json|```/g, "").trim();
        console.log("AI Cleaned JSON:", jsonString);
        const analysis = JSON.parse(jsonString);

        res.json(analysis);
    } catch (error) {
        console.error("AI Analysis Error:", error);
        res.status(500).json({ message: "Failed to analyze match", error: error.message });
    }
};
