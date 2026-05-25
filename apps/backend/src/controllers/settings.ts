import type { Request, Response, NextFunction } from "express";
import { prisma } from "database";
import env from "../utils/env";
import schemas from "../utils/schemas";

async function getVersion(req: Request, res: Response, next: NextFunction) {
  try {
    const version = env.APPLICATION_VERSION;
    res.status(200).json({
      version,
    });
    return;
  } catch (e) {
    next(e);
  }
}

async function setSetting(req: Request, res: Response, next: NextFunction) {
  try {
    const settings = schemas.createSetting.parse(req.body);

    for (const setting of settings) {
      await prisma.settings.upsert({
        where: {
          name: setting.name,
        },
        create: {
          name: setting.name,
          value: setting.value,
        },
        update: {
          value: setting.value,
        },
        select: {
          name: true,
          value: true,
        },
      });
    }

    res.sendStatus(204);
    return;
  } catch (e) {
    next(e);
  }
}

async function getSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const settings = await prisma.settings.findMany({
      select: {
        name: true,
        value: true,
      },
    });

    res.status(200).json(settings);
  } catch (e) {
    next(e);
  }
}

async function testDiscordWebhook(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const discordWebhook = schemas.discordWebhook.parse(req.query.webhook);

    if (!discordWebhook) {
      res.status(404).json({
        status: 404,
        message: "No Discord webhook provided",
      });
    } else {
      const payload = {
        username: "Subscriptions",
        embeds: [
          {
            title: "It works!",
            url: `${env.BASE_URL}/`,
            description:
              "Your subscription-tracker Discord webhook configuration works!",
            color: 16711680,
          },
        ],
      };

      const result = await fetch(discordWebhook, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      res.sendStatus(result.status);
      return;
    }
  } catch (e) {
    next(e);
  }
}

async function testNtfyWebhook(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const ntfyWebhook = schemas.ntfyWebhook.parse(req.query.webhook);
    const host = new URL(ntfyWebhook);

    const payload = {
      topic: host.pathname.replace("/", ""),
      title: "It works!",
      message: "Your subscription-tracker notification configuration works!",
      priority: 4,
      click: `${env.BASE_URL}/`,
    };

    const result = await fetch(host.origin, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    res.sendStatus(result.status);
  } catch (e) {
    next(e);
  }
}

export default {
  getVersion,
  getSettings,
  setSetting,
  testDiscordWebhook,
  testNtfyWebhook,
};
