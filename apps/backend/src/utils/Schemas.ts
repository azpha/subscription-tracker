import { z } from "zod";

const paymentMethod = z.enum(["Card", "PayPal", "Bank"]);
export default {
  SubscriptionCreation: z.object({
    name: z.string(),
    price: z.coerce.number().multipleOf(0.01),
    paymentMethod,
    lastBillingDate: z.coerce.date(),
    nextBillingDate: z.coerce.date(),
    shouldNotifyExpiry: z.boolean().optional(),
  }),
  SubscriptionUpdate: z.object({
    name: z.string().optional(),
    price: z.coerce.number().multipleOf(0.01).optional(),
    paymentMethod: paymentMethod.optional(),
    nextBillingDate: z.coerce.date().optional(),
    shouldNotifyExpiry: z.boolean().optional(),
    totalSpend: z.number().optional(),
  }),
  SubscriptionSortDirection: z.enum(["desc", "asc"]).optional(),
  SubscriptionSortBy: z.enum(["price", "date"]).optional(),
  SubscriptionDateRange: z.enum(["7-days", "30-days"]).optional(),
  SearchForSubscription: z.string(),
};
