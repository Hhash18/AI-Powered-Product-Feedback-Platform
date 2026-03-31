import axios from "axios";
import { auth } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const apiClient = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor to attach JWT token
apiClient.interceptors.request.use(
    (config) => {
        const token = auth.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export const feedbackAPI = {
    // Submit feedback
    create: async (data: { title: string; description: string; category?: string; userEmail?: string; userName?: string; userType?: string }) => {
        const response = await apiClient.post("/feedback", data);
        return response.data;
    },

    // Get all feedback
    getAll: async (filters?: { status?: string; category?: string; priority?: string; sort?: string }) => {
        const response = await apiClient.get("/feedback", { params: filters });
        return response.data;
    },

    // Get single feedback
    getById: async (id: string) => {
        const response = await apiClient.get(`/feedback/${id}`);
        return response.data;
    },

    // Update feedback
    update: async (
        id: string,
        data: {
            status?: string;
            priority?: string;
            category?: string;
        },
    ) => {
        const response = await apiClient.put(`/feedback/${id}`, data);
        return response.data;
    },

    // Delete feedback
    delete: async (id: string) => {
        const response = await apiClient.delete(`/feedback/${id}`);
        return response.data;
    },

    // Get analytics
    getAnalytics: async () => {
        const response = await apiClient.get("/feedback/analytics");
        return response.data;
    },

    // Get insights
    getInsights: async () => {
        const response = await apiClient.get("/feedback/insights");
        return response.data;
    },
};

export default apiClient;
