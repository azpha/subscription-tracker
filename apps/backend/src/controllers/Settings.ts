import type { Request, Response, NextFunction } from "express";

async function GetApplicationVersion(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const version = process.env.APPLICATION_VERSION as string;
    return res.status(200).json({
      status: 200,
      version,
    });
  } catch (e) {
    next(e);
  }
}

async function GetWebhookStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const discordWebhook = process.env.DISCORD_WEBHOOK as string;

    return res.status(200).json({
      status: 200,
      data: {
        discordWebhook,
      },
    });
  } catch (e) {
    next(e);
  }
}

export default {
  GetApplicationVersion,
  GetWebhookStatus,
};
