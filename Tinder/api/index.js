// api/index.js — Vercel serverless function entry point
// This wraps the Express app so it works as a Vercel serverless function

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "../backend/routes/auth.js";
import userRoutes from "../backend/routes/users.js";
import matchRoutes from "../backend/routes/matches.js";
import messageRoutes from "../backend/routes/messages.js";
import aiRoutes from "../backend/routes/ai.js";

dotenv.config();

const app = express();

// CORS — allow all Vercel domains + localhost
app.use(cors({
    origin: (origin, cb) => {
        if (!origin || origin.endsWith(".vercel.app") || origin.includes("localhost")) {
            cb(null, true);
        } else {
            cb(new Error("CORS blocked"));
        }
    },
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Keep a single MongoDB connection between invocations
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("MongoDB connected");
};

// Connect before every request
app.use(async (req, res, next) => {
    try { await connectDB(); next(); } catch (e) { res.status(500).json({ message: "DB connection failed" }); }
});

// Health check
app.get("/api", (req, res) => res.json({ message: "Pulse API ✦", status: "live" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/ai", aiRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: "Not found" }));

export default app;
