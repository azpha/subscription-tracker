import { z } from "zod";

const paymentMethod = z.enum(["Card", "PayPal", "Bank"]);
export default {
  id: z.coerce.number(),
  subscriptionCreation: z.object({
    name: z.string(),
    price: z.coerce.number().multipleOf(0.01),
    paymentMethod,
    lastBillingDate: z.coerce.date(),
    nextBillingDate: z.coerce.date(),
    shouldNotifyExpiry: z.boolean().optional(),
  }),
  subscriptionUpdate: z.object({
    name: z.string().optional(),
    price: z.coerce.number().multipleOf(0.01).optional(),
    paymentMethod: paymentMethod.optional(),
    nextBillingDate: z.coerce.date().optional(),
    shouldNotifyExpiry: z.boolean().optional(),
    totalSpend: z.number().optional(),
  }),
  subscriptionSortDirection: z.enum(["desc", "asc"]).optional(),
  subscriptionSortBy: z.enum(["price", "date"]).optional(),
  subscriptionDateRange: z.enum(["7-days", "30-days"]).optional(),
  searchForSubscription: z.string(),
  category: z.object({
    name: z.string().min(1),
  }),
};
