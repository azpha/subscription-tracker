import { z } from "zod";

const paymentMethod = z.enum(["Card", "PayPal", "Bank"]);
export default {
  id: z.coerce.number(),
  subscriptionCreation: z.object({
    name: z.string(),
    image: z.string().min(1),
    price: z.coerce.number().multipleOf(0.01),
    paymentMethod,
    billingDate: z.coerce.date(),
    shouldNotifyExpiry: z.boolean().optional(),
    categoryId: z.coerce.number().optional().nullable(),
  }),
  subscriptionUpdate: z.object({
    name: z.string().optional(),
    price: z.coerce.number().multipleOf(0.01).optional(),
    paymentMethod: paymentMethod.optional(),
    billingDate: z.coerce.date().optional(),
    shouldNotifyExpiry: z.boolean().optional(),
    totalSpend: z.coerce.number().optional(),
    categoryId: z.coerce.number().optional().nullable(),
  }),
  subscriptionSortDirection: z.enum(["desc", "asc"]).optional(),
  subscriptionSortBy: z.enum(["price", "date"]).optional(),
  subscriptionDateRange: z.enum(["7-days", "30-days"]).optional(),
  searchForSubscription: z.string(),
  category: z.object({
    name: z.string().min(1),
  }),
  monthlyReport: z.coerce.number().optional(),
  createSetting: z.array(
    z.object({
      name: z.enum(["DISCORD_WEBHOOK", "NTFY_WEBHOOK"]),
      value: z.string().min(1),
    }),
  ),
  discordWebhook: z
    .string()
    .includes("https://discord.com/api/webhooks")
    .url()
    .min(1),
  ntfyWebhook: z.string().url().min(1),
};
