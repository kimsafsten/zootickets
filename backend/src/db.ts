import mongoose from "mongoose";

process.loadEnvFile();

const mongoDbUrl = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        if (!mongoDbUrl) {
            throw new Error("MONGODB_URI is not set");
            }
        await mongoose.connect(mongoDbUrl);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;