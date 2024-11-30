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
const EditItemSchema = z.object({
    id: z.number(),
    name: z.string().min(1).optional(),
    price: z.string().min(1).optional(),
    nextBillingDate: z.date().optional(),
    billingMethod: z.string().optional(),
    billingFrequencyInMonths: z.number().optional(),
    image: z.string().optional()
})
const RetrieveItemSchema = z.number();
const DeleteItemSchema = z.number();
const PushToNextMonthSchema = z.number();

// authentication
const RegisterUserSchema = z.object({
    email: z.string(),
    name: z.string(),
    password: z.string()
})
const AddPasswordToUserSchema = z.object({
    email: z.string(),
    password: z.string()
})
const LoginUserSchema = z.object({
    email: z.string(),
    password: z.string()
})

// settings
const UpdateSettingsSchema = z.object({
    name: z.string(),
    type: z.enum(["notifications"]),
    value: z.string()
})

export default {
    // items
    CreateItemSchema,
    EditItemSchema,
    RetrieveItemSchema,
    DeleteItemSchema,
    PushToNextMonthSchema,

    // authentication
    RegisterUserSchema,
    AddPasswordToUserSchema,
    LoginUserSchema,

    // settings
    UpdateSettingsSchema
}