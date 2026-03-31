"use strict";
// In-memory store for test mode feedback (when MongoDB is unavailable)
Object.defineProperty(exports, "__esModule", { value: true });
exports.testStore = void 0;
class TestStore {
    constructor() {
        this.feedbackList = [];
    }
    addFeedback(feedback) {
        const now = new Date();
        const testFeedback = {
            ...feedback,
            _id: "test-" + Date.now(),
            createdAt: now,
            updatedAt: now,
        };
        this.feedbackList.push(testFeedback);
        return testFeedback;
    }
    getAllFeedback(filters) {
        let filtered = this.feedbackList;
        if (filters?.status) {
            filtered = filtered.filter((f) => f.status === filters.status);
        }
        if (filters?.category) {
            filtered = filtered.filter((f) => f.category === filters.category);
        }
        if (filters?.priority) {
            filtered = filtered.filter((f) => f.priority === filters.priority);
        }
        // Sort by newest first
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        return {
            items: filtered,
            total: filtered.length,
        };
    }
    getFeedbackById(id) {
        return this.feedbackList.find((f) => f._id === id) || null;
    }
    updateFeedback(id, updates) {
        const feedback = this.feedbackList.find((f) => f._id === id);
        if (!feedback)
            return null;
        Object.assign(feedback, updates, { updatedAt: new Date() });
        return feedback;
    }
    deleteFeedback(id) {
        const index = this.feedbackList.findIndex((f) => f._id === id);
        if (index === -1)
            return false;
        this.feedbackList.splice(index, 1);
        return true;
    }
    getAnalytics() {
        const stats = {
            total: this.feedbackList.length,
            byStatus: {},
            byCategory: {},
            byPriority: {},
            bySentiment: {},
        };
        this.feedbackList.forEach((f) => {
            stats.byStatus[f.status] = (stats.byStatus[f.status] || 0) + 1;
            stats.byCategory[f.category] = (stats.byCategory[f.category] || 0) + 1;
            stats.byPriority[f.priority] = (stats.byPriority[f.priority] || 0) + 1;
            stats.bySentiment[f.sentiment] = (stats.bySentiment[f.sentiment] || 0) + 1;
        });
        return stats;
    }
    clear() {
        this.feedbackList = [];
    }
}
exports.testStore = new TestStore();
//# sourceMappingURL=testStore.js.map