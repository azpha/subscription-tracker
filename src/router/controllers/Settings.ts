import Storage from '../services/Storage.js';
import Schemas from '../utilities/Schemas.js';
import type {
    Request,
    Response,
    NextFunction
} from 'express';

async function UpdateSettings(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        Schemas.UpdateSettingsSchema.parse(req.body)

        const exists = await Storage.userSettings.findFirst({
            where: {
                userId: req.user?.userId,
                name: req.body.name
            }
        })

        if (exists) {
            const setting = await Storage.userSettings.update({
                where: {
                    userId: req.user?.userId,
                    id: exists.id
                },
                data: {
                    name: req.body.name,
                    value: req.body.value,
                    type: req.body.type
                },
                select: {
                    name: true,
                    type: true,
                    value: true
                }
            })

            return res.status(200).json({
                success: true,
                setting
            })
        } else {
            const setting = await Storage.userSettings.create({
                data: {
                    name: req.body.name,
                    value: req.body.value,
                    type: req.body.type,
                    userId: req.user!.userId
                },
                select: {
                    name: true,
                    type: true,
                    value: true
                }
            })

            return res.status(200).json({
                success: true,
                setting
            })
        }
    } catch (e) {
        next(e)
    }
}

async function GetNotificationSettings(
    req: Request,
    res: Response
) {
    // is defined & isn't default
    const notificationSettings = await Storage.userSettings.findFirst({
        where: {
            type: "notifications",
            userId: req.user?.userId
        },
        select: {
            name: true,
            value: true
        }
    })

    return res.status(200).json({
        success: true,
        notificationSettings
    })
}

const GetImageVersion = (
    _: Request,
    res: Response
) => {
    return res.status(200).json({
        success: true,
        version: process.env.APPLICATION_VERSION || "dev"
    })
}

export default {
    UpdateSettings,
    GetNotificationSettings,
    GetImageVersion
}