import mongoose from "mongoose";

import dns from "dns";
dns.setServers(["8.8.8.8"]);

mongoose.set("strictQuery", false);

export const connectDB = async () => {
  let uri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/tinder";

  // If URI has no database path (e.g. ends with "/?" or no path), default to 'tinder'
  // Example: mongodb+srv://user:pass@cluster0.mongodb.net/?appName=Cluster0
  console.log("Connecting to:", uri.replace(/:([^@]+)@/, ":****@"));
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
  };
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  const maxRetries = 4;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const conn = await mongoose.connect(uri, opts);
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`Database connection attempt ${attempt} failed:`, error.message);
      if (attempt < maxRetries) {
        const delay = 1000 * Math.pow(2, attempt - 1); // 1s,2s,4s,8s
        console.log(`Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  console.error("All connection attempts failed.");
  if (uri.includes("mongodb+srv") || process.env.NODE_ENV === "production") {
    console.error("SRV lookup or network refused the connection. Common causes:\n - DNS blocked or cannot resolve SRV records\n - Outbound network rules blocking MongoDB ports or DNS\n - Atlas network access not whitelisted for your current IP\nRun: nslookup -type=SRV _mongodb._tcp.<your-cluster-host> to verify SRV resolution. Also ensure your password is URL-encoded.");
  }

  // Attempt fallback to local MongoDB
  const localUri = "mongodb://localhost:27017/tinder";
  try {
    console.log("Attempting fallback to local MongoDB at mongodb://localhost:27017/tinder...");
    const conn = await mongoose.connect(localUri, opts);
    console.log(`Fallback MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (localErr) {
    console.error("Fallback to local MongoDB failed:", localErr.message);
    console.error("Database unavailable — continuing without DB. Some features will be disabled until a database connection is available.");
    return null;
  }
};
