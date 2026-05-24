import { Router } from "express";
import SettingsController from "../controllers/Settings";

const router = Router();

router.get("/version", SettingsController.GetApplicationVersion);
router.get("/notifications", SettingsController.GetWebhookStatus);
router.post("/notifications/test/discord", SettingsController.TestWebhook);
router.post(
  "/notifications/test/ntfy",
  SettingsController.TestPushNotification
);

export default router;
