import { z } from "zod";

// items
const CreateItemSchema = z.object({
    name: z.string().min(1),
    price: z.string().min(1),
    lastBillingDate: z.date(),
    nextBillingDate: z.date(),
    billingMethod: z.string(),
    billingFrequency: z.enum(["yearly", "monthly"]),
    image: z.string()
})
const RetrieveItemSchema = z.number();
const DeleteItemSchema = z.number();

// settings
const UpdateSettingSchema = z.object({
    id: z.number(),
    value: z.string().min(1)
})

export default {
    // items
    CreateItemSchema,
    RetrieveItemSchema,
    DeleteItemSchema,

    // settings
    UpdateSettingSchema
}