import express from 'express';
import { FeedbackController } from '../controllers/feedbackController';

const router = express.Router();

// Routes
router.post('/', FeedbackController.create);
router.get('/', FeedbackController.getAll);
router.get('/analytics', FeedbackController.getAnalytics);
router.get('/insights', FeedbackController.getInsights);
router.get('/:id', FeedbackController.getById);
router.put('/:id', FeedbackController.update);
router.delete('/:id', FeedbackController.delete);

export default router;
