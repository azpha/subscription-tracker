import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  NODE_ENV: z.enum(["production", "development"]).default("development"),
  APPLICATION_VERSION: z.string().default("1.0.0"),
  PORT: z.coerce.number().default(3000),
  DISCORD_WEBHOOK: z.string().url().min(1).optional(),
  NTFY_HOST: z.string().url().min(1).optional(),
  BASE_URL: z.string().url().min(1),
  DATA_PATH: z.string().url().min(1).default("/files").optional(),
  SHORT_CRON_EXPIRY: z.coerce.boolean().default(false),
});

export default envSchema.parse(process.env);
