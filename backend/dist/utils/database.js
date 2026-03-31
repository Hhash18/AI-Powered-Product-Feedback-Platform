"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.isMongoConnected = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
let mongoConnected = false;
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/feedpulse";
        await mongoose_1.default.connect(mongoURI);
        mongoConnected = true;
        console.log("✓ MongoDB connected successfully");
    }
    catch (error) {
        mongoConnected = false;
        console.warn("⚠ MongoDB connection failed:", error.message);
        console.warn("⚠ Running in test mode without database. Feedback will not be persisted.");
    }
};
exports.connectDB = connectDB;
const isMongoConnected = () => {
    return mongoConnected;
};
exports.isMongoConnected = isMongoConnected;
const disconnectDB = async () => {
    try {
        await mongoose_1.default.disconnect();
        mongoConnected = false;
        console.log("MongoDB disconnected");
    }
    catch (error) {
        console.error("MongoDB disconnection error:", error.message);
    }
};
exports.disconnectDB = disconnectDB;
//# sourceMappingURL=database.js.map