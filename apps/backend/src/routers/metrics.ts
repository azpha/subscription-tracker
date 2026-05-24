import { Router } from "express";
import MetricsController from "../controllers/metrics";

const router = Router();

router.get(
  "/estimatedCostPerMonth",
  MetricsController.GetEstimatedCostPerMonth,
);
router.get("/topFive", MetricsController.TopFiveSpenders);

export default router;
