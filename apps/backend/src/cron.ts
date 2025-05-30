import cron from "node-cron";
import Database from "./utils/Database";

type DiscordWebhook = {
  username: string;
  embeds: DiscordEmbed[];
};
type DiscordEmbed = {
  title: string;
  description: string;
  color: number;
  fields: DiscordEmbedField[];
};
type DiscordEmbedField = {
  name: string;
  value: string;
  inline: boolean;
};

const isDevelopmentFlagEnabled =
  (process.env.SHORT_CRON_EXPIRY as string) === "true";

async function job() {
  const DISCORD_WEBHOOK_SCHEMA: DiscordWebhook = {
    username: "Subscriptions",
    embeds: [
      {
        title: "Subscriptions expiring!",
        description: "You have subscriptions expiring soon!",
        color: 16711680,
        fields: [],
      },
    ],
  };

  const currentDatePlusSeven = new Date();
  currentDatePlusSeven.setDate(currentDatePlusSeven.getDate() + 7);

  const expiringSoonSubscriptions = await Database.subscription.findMany({
    where: {
      nextBillingDate: {
        gte: new Date(),
        lte: currentDatePlusSeven,
      },
    },
  });

  const currentDate = new Date();
  for (const subscription of expiringSoonSubscriptions) {
    const differenceInMs = Math.abs(
      currentDate.getTime() - subscription.nextBillingDate.getTime()
    );
    const diffInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

    // any subscription expiring in sub-7 days will be sent to
    // the subscription
    if (diffInDays <= 7) {
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
      const newBillingDate = subscription.nextBillingDate;
      newBillingDate.setMonth(
        subscription.nextBillingDate.getMonth() +
          subscription.billingFrequencyInMonths
      );

      await Database.subscription.update({
        where: {
          id: subscription.id,
        },
        data: {
          nextBillingDate: newBillingDate,
          lastBillingDate: new Date(),
          totalSpend: subscription.totalSpend.add(subscription.price),
        },
      });
    }
  }

  // send the webhook if there are more than 1 subscription
  // in the fields
  if (DISCORD_WEBHOOK_SCHEMA.embeds[0].fields.length > 0) {
    sendDiscordMessage(DISCORD_WEBHOOK_SCHEMA);
  }
}

async function sendDiscordMessage(message: DiscordWebhook) {
  fetch(process.env.DISCORD_WEBHOOK as string, {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

if (process.env.DISCORD_WEBHOOK) {
  if (isDevelopmentFlagEnabled) {
    cron.schedule("*/5 * * * * *", () => {
      console.log("5 seconds");
      job();
    });
  } else {
    cron.schedule("0 0 */1 * *", () => {
      job();
    });
  }
} else {
  console.warn("DISCORD_WEBHOOK not defined, not starting cron schedule");
}
