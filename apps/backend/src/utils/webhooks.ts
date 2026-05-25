import env from "./env";
import { Subscription } from "database";
import type { DiscordWebhook } from "./types";

const sendAllPushNotification = (url: string) => {
  const host = new URL(url);

  const payload = {
    topic: host.pathname.replace("/", ""),
    title: "Subscriptions Expiring!",
    message: "You have multiple subscriptions expiring soon!",
    priority: 4,
    click: `${env.BASE_URL}/?filter=7-days`,
  };

  return fetch(host.origin, {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

const sendSpecificPushNotification = (
  url: string,
  subscription: Subscription,
) => {
  const host = new URL(url);

  const payload = {
    topic: host.pathname.replace("/", ""),
    title: `'${subscription.name}' expiring!`,
    message: `${subscription.name} ($${Number(subscription.price).toFixed(
      2,
    )}, ${subscription.paymentMethod}) is expiring on ${new Date(
      subscription.billingDate,
    ).toLocaleDateString()}!`,
    priority: 4,
    click: `${env.BASE_URL}/?filter=7-days`,
  };

  return fetch(host.origin, {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

async function sendDiscordWebhook(url: string, schema: DiscordWebhook) {
  fetch(url, {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(schema),
  });
}

export default {
  sendAllPushNotification,
  sendSpecificPushNotification,
  sendDiscordWebhook,
};
