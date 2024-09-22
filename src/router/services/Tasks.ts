import cron from 'node-cron';
import Storage from './Storage.js';
import moment from 'moment';
import 'dotenv/config';

const runNotificationService = async () => {
    const currentDate = new Date();
    const currentDatePlusSeven = moment(new Date()).add(7, 'days');
    const currentDateMinusSeven = moment(new Date()).subtract(7, 'days');

    const expiringSoon = await Storage.subscription.findMany({
        where: {
            nextBillingDate: {
                gte: currentDate,
                lte: currentDatePlusSeven.toDate()
            }
        }
    })
    const hasExpired = await Storage.subscription.findMany({
        where: {
            nextBillingDate: {
                gte: currentDateMinusSeven.toDate(),
                lte: currentDate
            }
        }
    })

    if (expiringSoon.length > 0) {
        console.log("checking which I should send notifications for..")
        const inThresholdForNotification = [];

        for (const subscription of expiringSoon) {
            const currentDate = moment(new Date());
            const nextDate = moment(subscription.nextBillingDate);
            const diffInDays = nextDate.diff(currentDate, 'days');

            if (diffInDays <= 7) {
                console.log("sending notification!")
                inThresholdForNotification.push(subscription);
            }
        }

        if (inThresholdForNotification.length > 0) {
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
                                const currentDate = moment(new Date());
                                const nextDate = moment(v.nextBillingDate);
                                const diffInDays = nextDate.diff(currentDate, 'days');
    
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
            const newBillingDate = moment(subscription.nextBillingDate).add(
                1,
                (subscription.billingFrequency === "yearly" ? "year" : "month")
            )

            await Storage.subscription.update({
                where: {
                    id: subscription.id
                },
                data: {
                    nextBillingDate: newBillingDate.toDate(),
                    lastBillingDate: subscription.nextBillingDate,
                    totalSpent: parseFloat(subscription.price) + subscription.totalSpent
                }
            })
        }
    }
};

// cron.schedule('*/10 * * * * *', runNotificationService);
cron.schedule('0 0 * * *', runNotificationService, {
    timezone: process.env.TIMEZONE as string
});

