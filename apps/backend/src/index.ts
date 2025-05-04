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

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// routes
app.use("/items", ItemsRouter);

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

// @ts-ignore pathparams err
app.use(errorHandler);

app.listen(process.env.PORT || 3001, () => {
  console.log("Listening on port " + (process.env.PORT || 3001));
});
