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
declare class TestStore {
    private feedbackList;
    addFeedback(feedback: Omit<TestFeedback, "_id" | "createdAt" | "updatedAt">): TestFeedback;
    getAllFeedback(filters?: {
        status?: string;
        category?: string;
        priority?: string;
    }): {
        items: TestFeedback[];
        total: number;
    };
    getFeedbackById(id: string): TestFeedback | null;
    updateFeedback(id: string, updates: Partial<TestFeedback>): TestFeedback | null;
    deleteFeedback(id: string): boolean;
    getAnalytics(): {
        total: number;
        byStatus: Record<string, number>;
        byCategory: Record<string, number>;
        byPriority: Record<string, number>;
        bySentiment: Record<string, number>;
    };
    clear(): void;
}
export declare const testStore: TestStore;
export {};
//# sourceMappingURL=testStore.d.ts.map