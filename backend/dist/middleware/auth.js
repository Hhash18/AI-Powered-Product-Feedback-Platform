"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.replace("Bearer ", "") || req.headers["x-auth-token"];
    if (!token) {
        res.status(401).json({
            success: false,
            error: "No authentication token provided",
            message: "Authorization required",
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
        req.admin = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            error: "Invalid or expired token",
            message: "Authentication failed",
        });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.js.map