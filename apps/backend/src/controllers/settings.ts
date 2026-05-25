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

// async function TestWebhook(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): Promise<any> {
//   try {
//     if (env.DISCORD_WEBHOOK) {
//       const payload = {
//         username: "Subscriptions",
//         embeds: [
//           {
//             title: "It works!",
//             url: `${env.BASE_URL}/`,
//             description:
//               "Your subscription-tracker Discord webhook configuration works!",
//             color: 16711680,
//           },
//         ],
//       };

//       const result = await fetch(env.DISCORD_WEBHOOK, {
//         method: "post",
//         headers: {
//           "content-type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       res.status(result.status).json({
//         status: result,
//       });
//     } else {
//       return res.status(400).json({
//         status: 400,
//         message: "Discord webhook not configured",
//       });
//     }
//   } catch (e) {
//     next(e);
//   }
// }

// async function TestPushNotification(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): Promise<any> {
//   try {
//     if (env.NTFY_HOST) {
//       const host = new URL(env.NTFY_HOST);

//       const payload = {
//         topic: host.pathname.replace("/", ""),
//         title: "It works!",
//         message: "Your subscription-tracker notification configuration works!",
//         priority: 4,
//         click: `${env.BASE_URL}/`,
//       };

//       const result = await fetch(host.origin, {
//         method: "post",
//         headers: {
//           "content-type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       res.status(result.status).json({
//         status: result,
//       });
//     } else {
//       return res.status(400).json({
//         status: 400,
//         message: "Ntfy host not configured",
//       });
//     }
//   } catch (e) {
//     next(e);
//   }
// }

export default {
  getVersion,
  getSettings,
  setSetting,
};
