import { Router } from 'express';
import AnalyticController from '../controllers/Analytics';

const router = Router();
router.get('/expiring', AnalyticController.ExpiringSoon);
router.get('/count', AnalyticController.GetSubscriptionCount);

export default router;