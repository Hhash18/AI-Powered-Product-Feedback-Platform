import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    admin?: { id: string; email: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
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
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET || "secret") as { id: string; email: string };
        req.admin = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            error: "Invalid or expired token",
            message: "Authentication failed",
        });
    }
};
