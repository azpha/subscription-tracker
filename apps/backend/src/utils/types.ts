type DiscordWebhook = {
  username: string;
  embeds: {
    title: string;
    url: string;
    description: string;
    color: number;
    fields: {
      name: string;
      value: string;
      inline: boolean;
    }[];
  }[];
};

export type { DiscordWebhook };
