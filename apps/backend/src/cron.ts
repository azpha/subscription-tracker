import cron from "node-cron";
import { prisma } from "database";
import webhooks from "./utils/webhooks";
import env from "./utils/env";
import { Decimal } from "database/generated/prisma/internal/prismaNamespace";
import type { DiscordWebhook } from "./utils/types";

const isDevelopmentFlagEnabled = env.SHORT_CRON_EXPIRY;
const MONTHS = {
  0: "jan",
  1: "feb",
  2: "mar",
  3: "apr",
  4: "may",
  5: "jun",
  6: "jul",
  7: "aug",
  8: "sep",
  9: "oct",
  10: "nov",
  11: "dec",
};

async function dailyJob() {
  const discordWebhookUrl = await prisma.settings.findFirst({
    where: {
      name: "DISCORD_WEBHOOK",
    },
  });
  const ntfyWebhookUrl = await prisma.settings.findFirst({
    where: {
      name: "NTFY_WEBHOOK",
    },
  });
  const DISCORD_WEBHOOK_SCHEMA: DiscordWebhook = {
    username: "Subscriptions",
    embeds: [
      {
        title: "Subscriptions expiring!",
        url: `${env.BASE_URL}/`,
        description: "You have subscriptions expiring soon!",
        color: 16711680,
        fields: [],
      },
    ],
  };

  const currentDatePlusSeven = new Date();
  currentDatePlusSeven.setDate(currentDatePlusSeven.getDate() + 7);

  const expiringSoonSubscriptions = await prisma.subscription.findMany({
    where: {
      billingDate: {
        gte: new Date(),
        lte: currentDatePlusSeven,
      },
    },
  });

  const currentDate = new Date();
  for (const subscription of expiringSoonSubscriptions) {
    const differenceInMs = Math.abs(
      currentDate.getTime() - subscription.billingDate.getTime(),
    );
    const diffInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

    // any subscription expiring in sub-7 days will be sent to
    // the subscription
    if (diffInDays <= 7 && discordWebhookUrl) {
      const field = {
        name: subscription.name,
        value: `${diffInDays} day(s), ${subscription.paymentMethod}`,
        inline: true,
      };
      DISCORD_WEBHOOK_SCHEMA.embeds[0].fields.push(field);
    }

    // update the subscriptions billing date + total tracked spend
    // if there are no more days until expiration
    if (diffInDays === 0) {
      const newBillingDate = subscription.billingDate;
      newBillingDate.setMonth(subscription.billingDate.getMonth() + 1);

      await prisma.subscription.update({
        where: {
          id: subscription.id,
        },
        data: {
          billingDate: newBillingDate,
          lastBillingDate: subscription.billingDate,
          totalSpend: subscription.totalSpend.add(subscription.price),
          previousTotalSpend: subscription.totalSpend,
        },
      });
    }
  }

  // send the webhook if configured
  if (discordWebhookUrl && DISCORD_WEBHOOK_SCHEMA.embeds[0].fields.length > 0) {
    webhooks.sendDiscordWebhook(
      discordWebhookUrl.value,
      DISCORD_WEBHOOK_SCHEMA,
    );
  }

  // send ntfy push notification if configured
  if (ntfyWebhookUrl) {
    if (expiringSoonSubscriptions.length === 1) {
      webhooks.sendSpecificPushNotification(
        ntfyWebhookUrl.value,
        expiringSoonSubscriptions[0],
      );
    } else if (expiringSoonSubscriptions.length > 0) {
      webhooks.sendAllPushNotification(ntfyWebhookUrl.value);
    }
  }
}

async function monthlyJob() {
  const date = new Date();
  const month = MONTHS[date.getMonth() as keyof typeof MONTHS];

  let monthlyPrice = new Decimal(0);
  const subs = await prisma.subscription.findMany();
  for (const sub of subs) {
    if (
      MONTHS[sub.lastBillingDate?.getMonth() as keyof typeof MONTHS] ===
        month ||
      MONTHS[sub.billingDate?.getMonth() as keyof typeof MONTHS] === month
    ) {
      monthlyPrice = monthlyPrice.add(sub.price);
    }
  }

  await prisma.monthlyReport.upsert({
    where: {
      year: date.getFullYear(),
    },
    create: {
      year: date.getFullYear(),
      [month]: monthlyPrice,
    },
    update: {
      [month]: monthlyPrice,
    },
  });
}

if (isDevelopmentFlagEnabled) {
  cron.schedule("*/5 * * * * *", () => {
    console.log("5 seconds");
    dailyJob();
  });
  cron.schedule("*/7 * * * * *", () => {
    console.log("7 seconds");
    monthlyJob();
  });
} else {
  cron.schedule("0 0 */1 * *", () => {
    dailyJob();
  });
  cron.schedule("0 0 */1 * *", () => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (today.getMonth() != tomorrow.getMonth()) {
      monthlyJob();
    }
  });
}
