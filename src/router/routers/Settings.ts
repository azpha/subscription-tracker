import {Router} from 'express';
import SettingsController from '../controllers/Settings.js';

const router = Router();
router.get("/notifications", SettingsController.GetNotificationSettings);
router.get("/version", SettingsController.GetImageVersion);

export default router;