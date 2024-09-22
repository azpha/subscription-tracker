import Storage from "../services/Storage.js";
import Schemas from "../utilities/Schemas.js";
import type {
    Request,
    Response,
    NextFunction
} from 'express';

const RetrieveSettings = async (
    _: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const settings = await Storage.settings.findMany();
        return res.status(200).json({
            status: 200,
            settings
        })
    } catch (e) {
        console.log(e)
        next(e);
    }
}

const UpdateSetting = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        Schemas.UpdateSettingSchema.parse({
            ...req.body,
            id: parseInt(req.body.id)
        });

        const setting = await Storage.settings.findFirst({
            where: {
                id: parseInt(req.body.id)
            }
        })

        if (setting) {
            await Storage.settings.update({
                where: {
                    id: parseInt(req.body.id)
                },
                data: {
                    value: req.body.value
                }
            })

            return res.status(200).json({
                status: 200,
                message: "Successfully updated settings"
            })
        } else {
            return res.status(404).json({
                status: 404,
                message: "No setting exists with that ID"
            })
        }
    } catch (e) {
        next(e);
    }
}

export default {
    RetrieveSettings,
    UpdateSetting
}