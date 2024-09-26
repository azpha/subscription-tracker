import type {
    Request,
    Response,
} from 'express';

const GetNotificationSettings = (
    _: Request,
    res: Response
) => {
    // is defined & isn't default
    const isDiscordEnabled = (!!process.env.DISCORD_NOTIFICATION_WEBHOOK && process.env.DISCORD_NOTIFICATION_WEBHOOK !== "https://discord.com/api/webhooks/") 

    return res.status(200).json({
        status: 200,
        notifications: {
            "discord": isDiscordEnabled
        }
    })
}

export default {
    GetNotificationSettings
}