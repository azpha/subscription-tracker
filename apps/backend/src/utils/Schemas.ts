import { z } from "zod";

const paymentMethod = z.enum(["Card", "PayPal", "Bank"]);
export default {
  SubscriptionCreation: z.object({
    name: z.string(),
    price: z.number(),
    paymentMethod,
    lastBillingDate: z.string().date(),
    nextBillingDate: z.string().date(),
    shouldNotifyExpiry: z.boolean().optional(),
  }),
  SubscriptionUpdate: z.object({
    id: z.number(),
    name: z.string().optional(),
    price: z.number().optional(),
    paymentMethod,
    nextBillingDate: z.string().date().optional(),
    shouldNotifyExpiry: z.boolean().optional(),
    totalSpend: z.number().optional(),
  }),
  SearchForSubscription: z.string(),
};
