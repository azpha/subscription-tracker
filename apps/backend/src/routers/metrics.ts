import { Router } from "express";
import metricsController from "../controllers/metrics";

const router = Router();

router.get("/", metricsController.getMetrics);
router.get("/monthlyReport", metricsController.getMonthlyReport);
router.get("/monthlyReport/:year", metricsController.getMonthlyReport);

export default router;
