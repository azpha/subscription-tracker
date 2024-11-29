import { Router } from 'express';
import AnalyticController from '../controllers/Analytics.js';
import Authentication from '../services/Authentication.js';

const router = Router();
router.get('/expiring', Authentication.verifyJwt, AnalyticController.ExpiringSoon);
router.get('/count', Authentication.verifyJwt, AnalyticController.GetSubscriptionCount);
router.get('/totalSpent', Authentication.verifyJwt, AnalyticController.GetTotalSpentForSubscriptions);

export default router;