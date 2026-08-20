import mongoose from "mongoose";

const mongoDbUrl = "mongodb://localhost:27017/zootickets";

const connectDB = async () => {
    try {
        await mongoose.connect(mongoDbUrl);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;