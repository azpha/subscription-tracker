import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import env from "./utils/env";
import path from "node:path";
import { ZodError } from "zod";
import "./cron";

// routers
import itemsRouter from "./routers/items";
import settingsRouter from "./routers/settings";
import metricsRouter from "./routers/metrics";
import categoriesRouter from "./routers/categories";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// routes
app.use("/api/icons", express.static(path.join(env.DATA_PATH, "files")));
app.use("/api/items", itemsRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/metrics", metricsRouter);
app.use("/api/categories", categoriesRouter);

// error handling
const errorHandler = (
  err: Error | ZodError,
  req: Request,
  res: Response,
  next: NextFunction,
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

app.listen(env.PORT || 3002, () => {
  console.log("Listening on port " + (env.PORT || 3002));
});
