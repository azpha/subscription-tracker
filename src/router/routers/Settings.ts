import { Router } from 'express';
import SettingsController from '../controllers/Settings.js';

const router = Router();
router.get('/', SettingsController.RetrieveSettings);
router.patch('/', SettingsController.UpdateSetting);

export default router;