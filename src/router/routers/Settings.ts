import {Router} from 'express';
import SettingsController from '../controllers/Settings.js';
import Authentication from '../services/Authentication.js';

const router = Router();
router.get("/notifications", Authentication.verifyJwt, SettingsController.GetNotificationSettings);
router.get("/version", SettingsController.GetImageVersion);

export default router;