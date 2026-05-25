import { Router } from "express";
import settingsController from "../controllers/settings";

const router = Router();

router.get("/version", settingsController.getVersion);
router.get("/", settingsController.getSettings);
router.post("/", settingsController.setSetting);

export default router;
