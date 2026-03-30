import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const ADMIN_CREDENTIALS = {
    email: "admin@feedpulse.com",
    password: "admin123",
};

export class AuthController {
    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            // Validate input
            if (!email || !password) {
                res.status(400).json({
                    success: false,
                    error: "Email and password are required",
                    message: "Missing credentials",
                });
                return;
            }

            // Validate credentials
            if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
                res.status(401).json({
                    success: false,
                    error: "Invalid email or password",
                    message: "Authentication failed",
                });
                return;
            }

            // Generate JWT token
            const token = jwt.sign({ id: "admin", email }, process.env.JWT_SECRET || "secret", { expiresIn: "24h" });

            res.status(200).json({
                success: true,
                data: { token, email },
                message: "Login successful",
            });
        } catch (error: any) {
            console.error("Error during login:", error);
            res.status(500).json({
                success: false,
                error: "Failed to login",
                message: error.message,
            });
        }
    }
}
