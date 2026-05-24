import { Decimal } from "database/generated/prisma/internal/prismaNamespace";
import { prisma } from "database";
import type { Request, Response, NextFunction } from "express";
import schemas from "../utils/schemas";

async function getMetrics(req: Request, res: Response, next: NextFunction) {
  try {
    const subs = await prisma.subscription.findMany();
    let totalSpendPerMonth = new Decimal(0);
    let totalSpendPerYear = new Decimal(0);
    let previousMonthsTotalSpend = new Decimal(0);
    for (const subscription of subs) {
      totalSpendPerMonth = totalSpendPerMonth.add(subscription.price);
      previousMonthsTotalSpend = previousMonthsTotalSpend.add(
        subscription.previousTotalSpend,
      );
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

    const expiringNext = await prisma.subscription.findFirst({
      where: {
        billingDate: {
          gte: new Date(),
        },
      },
      orderBy: {
        billingDate: "asc",
      },
    });

    res.status(200).json({
      totalSpendPerMonth,
      previousMonthsTotalSpend,
      totalSpendPerYear,
      expiringSoon,
      expiringNext,
      top5,
    });
  } catch (e) {
    next(e);
  }
}

async function getMonthlyReport(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const year = schemas.monthlyReport.parse(req.params.year);
    const data = await prisma.monthlyReport.findFirst({
      where: {
        year: year || new Date().getFullYear(),
      },
    });
    res.status(200).json(data);
  } catch (e) {
    next(e);
  }
}

export default {
  getMetrics,
  getMonthlyReport,
};
