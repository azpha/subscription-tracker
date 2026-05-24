import { Decimal } from "database/generated/prisma/internal/prismaNamespace";
import { prisma } from "database";
import type { Request, Response, NextFunction } from "express";

async function getMetrics(req: Request, res: Response, next: NextFunction) {
  try {
    const subs = await prisma.subscription.findMany();
    let totalSpendPerMonth = new Decimal(0);
    let totalSpendPerYear = new Decimal(0);
    for (const subscription of subs) {
      totalSpendPerMonth = totalSpendPerMonth.add(subscription.price);
      totalSpendPerYear = totalSpendPerYear.add(subscription.price.mul(12));
    }

    const top5 = await prisma.subscription.findMany({
      take: 5,
      orderBy: {
        price: "desc",
      },
    });

    const currentDatePlusSeven = new Date();
    currentDatePlusSeven.setDate(currentDatePlusSeven.getDate() + 7);
    const expiringSoon = await prisma.subscription.findMany({
      where: {
        billingDate: {
          gte: new Date(),
          lte: currentDatePlusSeven,
        },
      },
    });

    res.status(200).json({
      totalSpendPerMonth,
      totalSpendPerYear,
      expiringSoon,
      top5,
    });
  } catch (e) {
    next(e);
  }
}

export default {
  getMetrics,
};
