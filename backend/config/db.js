import mongoose from "mongoose";

mongoose.set("strictQuery", false);

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/pulse";

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.error("Check that MONGO_URI is correct and your IP is whitelisted in Atlas.");
    return null;
  }
};
