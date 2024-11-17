import cron from 'node-cron';
import Storage from './Storage.js';
import 'dotenv/config';

const runNotificationService = async () => {
    const currentDate = new Date()
    const currentDatePlusSeven = new Date();
    const currentDateMinusSeven = new Date();
    currentDatePlusSeven.setDate(currentDatePlusSeven.getDate() + 7);
    currentDateMinusSeven.setDate(currentDateMinusSeven.getDate() - 7);

    const expiringSoon = await Storage.subscription.findMany({
        where: {
            nextBillingDate: {
                gte: currentDate,
                lte: currentDatePlusSeven
            }
        }
    })
    const hasExpired = await Storage.subscription.findMany({
        where: {
            nextBillingDate: {
                gte: currentDateMinusSeven,
                lte: currentDate
            }
        }
    })

    if (expiringSoon.length > 0) {
        console.log("checking which I should send notifications for..")
        const inThresholdForNotification = [];

        for (const subscription of expiringSoon) {
            const currentDate = new Date()
            const nextDate = subscription.nextBillingDate;
            const differnceInMs = Math.abs(currentDate.getTime() - nextDate.getTime());
            const diffInDays = Math.floor(differnceInMs / (1000 * 60 * 60 * 24));

            if (diffInDays <= 7) {
                console.log("sending notification!")
                inThresholdForNotification.push(subscription);
            }
        }

        if (inThresholdForNotification.length > 0 && process.env.DISCORD_NOTIFICATION_WEBHOOK) {
            await fetch(process.env.DISCORD_NOTIFICATION_WEBHOOK as string, {
                method: 'post',
                headers: {
                    'content-type': "application/json"
                },
                body: JSON.stringify({
                    username: "Subscriptions",
                    embeds: [
                        {
                            title: "Subscriptions expiring!",
                            description: "You have subscriptions expiring soon!",
                            color: 16711680,
                            fields: inThresholdForNotification.map((v) => {
                                const currentDate = new Date()
                                const nextDate = v.nextBillingDate;
                                const differnceInMs = Math.abs(currentDate.getTime() - nextDate.getTime());
                                const diffInDays = Math.floor(differnceInMs / (1000 * 60 * 60 * 24));
    
                                return {
                                    name: v.name,
                                    value: `${diffInDays} day(s), ${v.billingMethod}`,
                                    inline: true
                                }
                            })
                        }
                    ]
                })
            })
        }
    }
    if (hasExpired.length > 0) {
        for (const subscription of hasExpired) {
            console.log('updating subscription', subscription)
            const newSubBillingDate = subscription.nextBillingDate;
            newSubBillingDate.setUTCMonth(newSubBillingDate.getUTCMonth() + subscription.billingFrequencyInMonths);

            await Storage.subscription.update({
                where: {
                    id: subscription.id
                },
                data: {
                    nextBillingDate: newSubBillingDate,
                    totalSpent: parseFloat(subscription.price) + subscription.totalSpent
                }
            })
        }
    }
};

// cron.schedule('*/10 * * * * *', runNotificationService);
cron.schedule('0 0 * * *', runNotificationService, {
    timezone: process.env.TIMEZONE as string || "America/New_York"
});

