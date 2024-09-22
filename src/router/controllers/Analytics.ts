import Storage from "../services/Storage.js";
import moment from 'moment';
import type {
    Request,
    Response,
    NextFunction
} from 'express';

function ExpiringSoon(
    _: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const currentDate = moment(new Date()).toDate();
        const currentDatePlusSeven = moment(new Date()).add(7, 'days').toDate();
    
        const expiringSoon = Storage.subscription.findMany({
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

export default {
    ExpiringSoon,
    GetSubscriptionCount
}