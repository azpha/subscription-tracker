import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import { ZodError } from "zod";
import "dotenv/config";
import "./cron";

// routers
import ItemsRouter from "./routers/Items";
import SettingsRouter from "./routers/Settings";
import MetricsRouter from "./routers/Metrics";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// routes
app.use("/items", ItemsRouter);
app.use("/settings", SettingsRouter);
app.use("/metrics", MetricsRouter);

// error handling
const errorHandler = (
  err: Error | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 400,
      message: "Request body validation error",
      issues: err.issues,
    });
  }

  console.error(err);
  return res.status(500).json({
    status: 500,
    message: "An unexpected error occurred while handling your request",
  });
};
app.use(errorHandler as any);

// 404
app.use("/*splat", (req: Request, res: Response) => {
  return res.status(404).json({
    status: 404,
    message: "No resource found",
  }) as any;
});

app.listen(process.env.PORT || 3002, () => {
  console.log("Listening on port " + (process.env.PORT || 3002));
});
