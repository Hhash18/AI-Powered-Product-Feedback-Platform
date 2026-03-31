import { Request, Response } from "express";
export declare class FeedbackController {
    static create(req: Request, res: Response): Promise<void>;
    static getAll(req: Request, res: Response): Promise<void>;
    static getById(req: Request, res: Response): Promise<void>;
    static update(req: Request, res: Response): Promise<void>;
    static delete(req: Request, res: Response): Promise<void>;
    static getAnalytics(req: Request, res: Response): Promise<void>;
    static getInsights(req: Request, res: Response): Promise<void>;
    static getSummary(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=feedbackController.d.ts.map