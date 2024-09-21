import Storage from '../services/Storage';
import Schemas from '../utilities/Schemas';
import type {
    Request,
    Response,
    NextFunction
} from 'express';

const CreateItem = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        Schemas.CreateItemSchema.parse({
            ...req.body,
            nextBillingDate: new Date(req.body.nextBillingDate),
            lastBillingDate: new Date(req.body.lastBillingDate)
        });

        const subscription = await Storage.subscription.create({
            data: {
                name: req.body.name,
                image: req.body.image,
                price: req.body.price,
                lastBillingDate: req.body.lastBillingDate,
                nextBillingDate: req.body.nextBillingDate,
                billingMethod: req.body.billingMethod,
                billingFrequency: req.body.billingFrequency 
            }
        })

        return res.status(200).json({
            status: 200,
            message: "Created record",
            subscription
        })
    } catch (e) {
        next(e)
    }
}

const RetrieveItem = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        Schemas.RetrieveItemSchema.parse(parseInt(req.params.id));

        // retrieve the item using id
        const subscription = await Storage.subscription.findFirst({
            where: {
                id: parseInt(req.params.id)
            }
        })

        if (subscription) {
            return res.status(200).json({
                status: 200,
                subscription
            })
        } else {
            return res.status(404).json({
                status: 404,
                message: "No subscription exists with that ID"
            })
        }
    } catch (e) {
        next(e);
    }
}

const DeleteItem = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        Schemas.DeleteItemSchema.parse(parseInt(req.params.id));

        await Storage.subscription.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })
    
        return res.status(200).json({
            status: 200,
            message: "Successfully deleted subscription"
        })
    } catch (e) {
        next(e);
    }
}

const RetrieveAllItems = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await Storage.subscription.findMany();

        return res.status(200).json({
            status: 200,
            subscription: data
        })
    } catch (e) {
        next(e);
    }
}

export default {
    CreateItem,
    RetrieveItem,
    DeleteItem,
    RetrieveAllItems
}