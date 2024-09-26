import {Router} from 'express';
import SettingsController from '../controllers/Settings.js';

const router = Router();
router.get("/notifications", SettingsController.GetNotificationSettings);

export default router;