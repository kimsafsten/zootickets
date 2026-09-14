import mongoose from "mongoose";

// Load .env before reading connection settings during startup.
process.loadEnvFile();

const mongoDbUrl = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        if (!mongoDbUrl) {
            throw new Error("MONGODB_URI is not set");
            }
        // Fail fast on startup if the database cannot be reached.
        await mongoose.connect(mongoDbUrl);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;
