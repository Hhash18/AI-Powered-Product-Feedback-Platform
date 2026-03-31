// In-memory store for test mode feedback (when MongoDB is unavailable)

interface TestFeedback {
    _id: string;
    title: string;
    description: string;
    category: string;
    userEmail?: string;
    userName?: string;
    userType?: string;
    priority: string;
    sentiment: string;
    priorityScore: number;
    summary: string;
    tags: string[];
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

class TestStore {
    private feedbackList: TestFeedback[] = [];

    addFeedback(feedback: Omit<TestFeedback, "_id" | "createdAt" | "updatedAt">): TestFeedback {
        const now = new Date();
        const testFeedback: TestFeedback = {
            ...feedback,
            _id: "test-" + Date.now(),
            createdAt: now,
            updatedAt: now,
        };
        this.feedbackList.push(testFeedback);
        return testFeedback;
    }

    getAllFeedback(filters?: { status?: string; category?: string; priority?: string }): { items: TestFeedback[]; total: number } {
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

    getFeedbackById(id: string): TestFeedback | null {
        return this.feedbackList.find((f) => f._id === id) || null;
    }

    updateFeedback(id: string, updates: Partial<TestFeedback>): TestFeedback | null {
        const feedback = this.feedbackList.find((f) => f._id === id);
        if (!feedback) return null;

        Object.assign(feedback, updates, { updatedAt: new Date() });
        return feedback;
    }

    deleteFeedback(id: string): boolean {
        const index = this.feedbackList.findIndex((f) => f._id === id);
        if (index === -1) return false;

        this.feedbackList.splice(index, 1);
        return true;
    }

    getAnalytics() {
        const stats = {
            total: this.feedbackList.length,
            byStatus: {} as Record<string, number>,
            byCategory: {} as Record<string, number>,
            byPriority: {} as Record<string, number>,
            bySentiment: {} as Record<string, number>,
        };

        this.feedbackList.forEach((f) => {
            stats.byStatus[f.status] = (stats.byStatus[f.status] || 0) + 1;
            stats.byCategory[f.category] = (stats.byCategory[f.category] || 0) + 1;
            stats.byPriority[f.priority] = (stats.byPriority[f.priority] || 0) + 1;
            stats.bySentiment[f.sentiment] = (stats.bySentiment[f.sentiment] || 0) + 1;
        });

        return stats;
    }

    clear(): void {
        this.feedbackList = [];
    }
}

export const testStore = new TestStore();
