// Auth utility - calls backend for JWT token

import axios from "axios";

const ADMIN_EMAIL = "admin@feedpulse.com";
const ADMIN_PASSWORD = "FeedPulse@123";
const AUTH_TOKEN_KEY = "feedpulse_auth_token";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const authClient = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        "Content-Type": "application/json",
    },
});

export const auth = {
    login: async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await authClient.post("/auth/login", { email, password });
            if (response.data.success && response.data.data?.token) {
                if (typeof window !== "undefined") {
                    localStorage.setItem(AUTH_TOKEN_KEY, response.data.data.token);
                }
                return true;
            }
            return false;
        } catch {
            return false;
        }
    },

    logout: (): void => {
        if (typeof window !== "undefined") {
            localStorage.removeItem(AUTH_TOKEN_KEY);
        }
    },

    isAuthenticated: (): boolean => {
        if (typeof window === "undefined") return false;
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        return !!token;
    },

    getToken: (): string | null => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(AUTH_TOKEN_KEY);
    },

    getCredentials: () => ({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
    }),
};
