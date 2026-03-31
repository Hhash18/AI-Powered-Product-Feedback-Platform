"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./utils/database");
const feedbackRoutes_1 = __importDefault(require("./routes/feedbackRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Connect to MongoDB
(0, database_1.connectDB)().catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
});
// Routes
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        data: {
            status: "OK",
            timestamp: new Date(),
            service: "FeedPulse Backend",
        },
        message: "Service is healthy",
    });
});
app.use("/api/auth", authRoutes_1.default);
app.use("/api/feedback", feedbackRoutes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || "Internal server error",
        message: "An error occurred",
    });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found",
        message: `${req.method} ${req.path} not found`,
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Health: http://localhost:${PORT}/api/health`);
});
//# sourceMappingURL=server.js.map