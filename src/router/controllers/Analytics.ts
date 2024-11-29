import Storage from "../services/Storage.js";
import type {
    Request,
    Response,
    NextFunction
} from 'express';

async function ExpiringSoon(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const currentDate = new Date();
        const currentDatePlusSeven = new Date();
        currentDatePlusSeven.setDate(currentDatePlusSeven.getDate() + 7);
    
        const expiringSoon = await Storage.subscription.findMany({
            where: {
                userId: req.user?.userId,
                nextBillingDate: {
                    lte: currentDatePlusSeven,
                    gte: currentDate
                }
            }
        });
    
        return res.status(200).json({
            success: true,
            subscription: expiringSoon
        })
    } catch (e) {
        next(e);
    }
}

async function GetSubscriptionCount(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const monthlyCount = await Storage.subscription.count({
            where: {
                userId: req.user?.userId,
                billingFrequencyInMonths: {
                    lt: 12
                }
            }
        })
        const yearlyCount = await Storage.subscription.count({
            where: {
                userId: req.user?.userId,
                billingFrequencyInMonths: {
                    gte: 12
                }
            }
        })

        return res.status(200).json({
            success: true,
            count: {
                monthly: monthlyCount,
                yearly: yearlyCount
            }
        })
    } catch (e) {
        next(e);
    }
}

async function GetTotalSpentForSubscriptions(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const allTotalSpent = await Storage.subscription.findMany({
            where: {
                userId: req.user?.userId
            },
            select: {
                id: true,
                name: true,
                totalSpent: true
            }
        })

        return res.status(200).json({
            success: true,
            subscriptions: allTotalSpent
        })
    } catch (e) {
        next(e);
    }
}

export default {
    ExpiringSoon,
    GetSubscriptionCount,
    GetTotalSpentForSubscriptions
}