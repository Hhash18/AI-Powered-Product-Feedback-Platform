import mongoose from "mongoose";

let mongoConnected = false;

export const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/feedpulse";

        await mongoose.connect(mongoURI);

        mongoConnected = true;
        console.log("✓ MongoDB connected successfully");
    } catch (error: any) {
        mongoConnected = false;
        console.warn("⚠ MongoDB connection failed:", error.message);
        console.warn("⚠ Running in test mode without database. Feedback will not be persisted.");
    }
};

export const isMongoConnected = (): boolean => {
    return mongoConnected;
};

export const disconnectDB = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        mongoConnected = false;
        console.log("MongoDB disconnected");
    } catch (error: any) {
        console.error("MongoDB disconnection error:", error.message);
    }
};
