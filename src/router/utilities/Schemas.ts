import { z } from "zod";

// items
const CreateItemSchema = z.object({
    name: z.string().min(1),
    price: z.string().min(1),
    nextBillingDate: z.date(),
    billingMethod: z.string(),
    billingFrequencyInMonths: z.number(),
    image: z.string()
})
const RetrieveItemSchema = z.number();
const DeleteItemSchema = z.number();
const PushToNextMonthSchema = z.number();

export default {
    // items
    CreateItemSchema,
    RetrieveItemSchema,
    DeleteItemSchema,
    PushToNextMonthSchema
}