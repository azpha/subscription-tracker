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

async function job() {
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
  const discordWebhookMessage = DISCORD_WEBHOOK_SCHEMA;
  for (const subscription of expiringSoonSubscriptions) {
    const differenceInMs = Math.abs(
      currentDate.getTime() - subscription.nextBillingDate.getTime()
    );
    const diffInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

    if (diffInDays <= 7) {
      const field = {
        name: subscription.name,
        value: `${diffInDays} day(s), ${subscription.paymentMethod}`,
        inline: true,
      };
      discordWebhookMessage.embeds[0].fields.push(field);
    }
  }

  if (discordWebhookMessage.embeds[0].fields.length > 0) {
    sendDiscordMessage(discordWebhookMessage);
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

// cron.schedule("*/5 * * * * *", () => {
//   console.log("5 seconds");
//   job();
// });
cron.schedule("0 0 */1 * *", () => {
  job();
});
