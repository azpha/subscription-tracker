import {Router} from 'express';
import SettingsController from '../controllers/Settings.js';
import Authentication from '../services/Authentication.js';

const router = Router();
router.post("/update", Authentication.verifyJwt, SettingsController.UpdateSettings);
router.get("/notifications", Authentication.verifyJwt, SettingsController.GetNotificationSettings);
router.get("/version", SettingsController.GetImageVersion);

export default router;