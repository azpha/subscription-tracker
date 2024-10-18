import Storage from "../services/Storage.js";
import type {
    Request,
    Response,
    NextFunction
} from 'express';

async function ExpiringSoon(
    _: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const currentDate = new Date();
        const currentDatePlusSeven = new Date();
        currentDatePlusSeven.setDate(currentDatePlusSeven.getDate() + 7);
    
        const expiringSoon = await Storage.subscription.findMany({
            where: {
                nextBillingDate: {
                    lte: currentDatePlusSeven,
                    gte: currentDate
                }
            }
        });
    
        return res.status(200).json({
            status: 200,
            subscription: expiringSoon
        })
    } catch (e) {
        next(e);
    }
}

async function GetSubscriptionCount(
    _: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const monthlyCount = await Storage.subscription.count({
            where: {
                billingFrequency: "monthly"
            }
        })
        const yearlyCount = await Storage.subscription.count({
            where: {
                billingFrequency: "yearly"
            }
        })

        return res.status(200).json({
            status: 200,
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
    _: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const allTotalSpent = await Storage.subscription.findMany({
            select: {
                id: true,
                name: true,
                totalSpent: true
            }
        })

        return res.status(200).json({
            status: 200,
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