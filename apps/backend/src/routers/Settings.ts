import { Router } from "express";
import SettingsController from "../controllers/Settings";

const router = Router();

router.get("/version", SettingsController.GetApplicationVersion);
router.get("/notifications", SettingsController.GetWebhookStatus);

export default router;
