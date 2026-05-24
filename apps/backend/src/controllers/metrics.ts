import { Decimal } from "database/generated/prisma/internal/prismaNamespace";
import { prisma } from "database";
import type { Request, Response, NextFunction } from "express";

async function GetEstimatedCostPerMonth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  try {
    const data = await prisma.subscription.findMany({
      where: {
        billingFrequencyInMonths: 1, // only true monthly subscriptions
      },
    });

    let totalSpend = new Decimal(0);
    for (const subscription of data) {
      totalSpend = totalSpend.add(subscription.price);
    }

    return res.status(200).json({
      status: 200,
      totalSpend,
    });
  } catch (e) {
    next(e);
  }
}

async function TopFiveSpenders(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  try {
    const data = await prisma.subscription.findMany({
      take: 5,
      orderBy: {
        price: "desc",
      },
    });

    return res.status(200).json({
      status: 200,
      data,
    });
  } catch (e) {
    next(e);
  }
}

export default {
  GetEstimatedCostPerMonth,
  TopFiveSpenders,
};
