import { Router } from 'express';
import AnalyticController from '../controllers/Analytics.js';

const router = Router();
router.get('/expiring', AnalyticController.ExpiringSoon);
router.get('/count', AnalyticController.GetSubscriptionCount);
router.get('/totalSpent', AnalyticController.GetTotalSpentForSubscriptions);

export default router;