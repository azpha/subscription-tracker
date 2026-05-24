import { Router } from "express";
import metricsController from "../controllers/metrics";

const router = Router();

router.get("/", metricsController.getMetrics);

export default router;
