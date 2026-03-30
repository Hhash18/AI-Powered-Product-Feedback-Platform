import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { connectDB } from "./utils/database";
import feedbackRoutes from "./routes/feedbackRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB().catch((error) => {
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

app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
