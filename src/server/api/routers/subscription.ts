import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"

const SubscriptionSchema = {
    name: z.string().min(1),
    price: z.string().min(1),
    nextBillingDate: z.date().min(new Date()),
    paymentMethod: z.string(),
    totalSpent: z.number().optional()
}
const SubscriptionUpdateSchema = {
    id: z.number(),
    name: z.string().min(1).optional(),
    price: z.string().min(1).optional(),
    nextBillingDate: z.date().min(new Date()).optional(),
    paymentMethod: z.string().optional(),
    totalSpent: z.number().optional()
}

export const subscriptionRouter = createTRPCRouter({
    getAll: publicProcedure
        .query(async ({ctx}) => {
            return ctx.db.subscription.findMany()
        }),
    getOne: publicProcedure
        .input(z.number())
        .query(async ({ctx,input}) => {
            return ctx.db.subscription.findFirst({
                where: {
                    id: input
                }
            })
        }),
    getUpcoming: publicProcedure
        .query(async ({ ctx }) => {
            const currentDatePlusSeven = new Date();
            currentDatePlusSeven.setDate(currentDatePlusSeven.getDate() + 7);

            return ctx.db.subscription.findMany({
                where: {
                    nextBillingDate: {
                        gte: new Date(),
                        lte: currentDatePlusSeven
                    }
                }
            })
        }),
    
    // creation + modification + deletion
    create: publicProcedure
        .input(z.object(SubscriptionSchema))
        .mutation(async ({ctx, input}) => {
            input.price = input.price.replace("$", "")

            return ctx.db.subscription.create({
                data: {
                    ...input
                }
            })
        }),
    delete: publicProcedure
        .input(z.number())
        .mutation(async ({ctx, input}) => {
            return ctx.db.subscription.delete({
                where: {
                    id: input
                }
            })
        }),
    update: publicProcedure
        .input(z.object(SubscriptionUpdateSchema))
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input

            return ctx.db.subscription.update({
                where: {
                    id
                },
                data: {
                    ...data
                }
            })
        })
})