import { Decimal } from "../../../../prisma/generated/prisma/runtime/library";
import Database from "../utils/Database";
import Schemas from "../utils/Schemas";
import type { Request, Response, NextFunction } from "express";

async function CreateNewItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    Schemas.SubscriptionCreation.parse(req.body);

    // calculate billing frequency
    let { nextBillingDate, lastBillingDate } = req.body;
    const nextBillingDateTime = new Date(nextBillingDate);
    const lastBillingDateTime = new Date(lastBillingDate);
    const differenceInMonths =
      (nextBillingDateTime.getFullYear() - lastBillingDateTime.getFullYear()) *
        12 +
      (nextBillingDateTime.getMonth() - lastBillingDateTime.getMonth());

    if (lastBillingDateTime.getTime() > nextBillingDateTime.getTime()) {
      return res.status(400).json({
        status: 400,
        message: "Last billing date cannot be greater than next billing date",
      });
    }

    const data = await Database.subscription.create({
      data: {
        ...req.body,
        billingFrequencyInMonths: differenceInMonths,
        nextBillingDate: nextBillingDateTime,
        lastBillingDate: lastBillingDateTime,
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

async function DeleteItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid body parameters",
      });
    }

    const doesSubExist = await Database.subscription.findFirst({
      where: {
        id,
      },
    });
    if (!doesSubExist) {
      return res.status(404).json({
        status: 404,
        message: "No subscription with that id exists",
      });
    }

    await Database.subscription.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      status: 200,
      message: "Successfully deleted item",
    });
  } catch (e) {
    next(e);
  }
}

async function UpdateItems(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    Schemas.SubscriptionUpdate.parse({
      ...req.body,
    });

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid body parameters",
      });
    }

    const sub = await Database.subscription.findFirst({
      where: {
        id,
      },
    });
    if (!sub) {
      return res.status(404).json({
        status: 404,
        message: "No subscription with that id exists",
      });
    }

    // recalculate billing frequency if billing date changed
    let updateObject = {
      billingFrequencyInMonths: sub.billingFrequencyInMonths,
      nextBillingDate: sub.nextBillingDate,
      lastBillingDate: sub.lastBillingDate,
    };
    if (req.body.nextBillingDate || req.body.lastBillingDate) {
      const nextBillingDateTime = new Date(
        req.body.nextBillingDate || sub.nextBillingDate
      );
      const lastBillingDateTime = new Date(
        req.body.lastBillingDate || sub.lastBillingDate
      );

      if (lastBillingDateTime.getTime() > nextBillingDateTime.getTime()) {
        return res.status(400).json({
          status: 400,
          message: "Last billing date cannot be greater than next billing date",
        });
      }

      updateObject.billingFrequencyInMonths =
        (nextBillingDateTime.getFullYear() -
          lastBillingDateTime.getFullYear()) *
          12 +
        (nextBillingDateTime.getMonth() - lastBillingDateTime.getMonth());

      (updateObject.nextBillingDate = nextBillingDateTime),
        (updateObject.lastBillingDate = lastBillingDateTime);
    }

    const data = await Database.subscription.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        ...req.body,
        ...updateObject,
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

async function FetchItems(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const { minPrice, maxPrice, dateRange, q } = req.query;

    if (q) Schemas.SearchForSubscription.parse(q);
    if (dateRange) Schemas.SubscriptionDateRange.parse(dateRange);

    const sortObject = {
      where: {},
    };

    if (q) {
      sortObject.where = {
        ...sortObject.where,
        name: {
          includes: q,
        },
      };
    }
    if (dateRange) {
      const currentDate = new Date();
      const modifiedDate = new Date();

      if (dateRange === "7-days") {
        modifiedDate.setDate(modifiedDate.getDate() + 7);
      } else if (dateRange === "30-days") {
        modifiedDate.setDate(modifiedDate.getDate() + 30);
      }

      sortObject.where = {
        ...sortObject.where,
        nextBillingDate: {
          lte: modifiedDate,
          gte: currentDate,
        },
      };
    }
    if (minPrice && maxPrice) {
      const minDecimal = new Decimal(minPrice as string);
      const maxDecimal = new Decimal(maxPrice as string);

      sortObject.where = {
        ...sortObject.where,
        price: {
          lte: maxDecimal,
          gte: minDecimal,
        },
      };
    }

    const data = await Database.subscription.findMany(sortObject);

    return res.status(200).json({
      status: 200,
      data,
    });
  } catch (e) {
    next(e);
  }
}

async function FetchSpecificItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid body parameters",
      });
    }

    const data = await Database.subscription.findFirst({
      where: {
        id,
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

async function SearchForItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    Schemas.SearchForSubscription.parse(req.query.q);

    const data = await Database.subscription.findMany({
      where: {
        name: {
          contains: req.query.q as string,
        },
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
  CreateNewItem,
  UpdateItems,
  DeleteItem,
  FetchItems,
  FetchSpecificItem,
  SearchForItem,
};
