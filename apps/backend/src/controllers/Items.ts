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
    const { nextBillingDate, lastBillingDate } = req.body;
    const nextBillingDateTime = new Date(nextBillingDate);
    const lastBillingDateTime = new Date(lastBillingDate);
    const differenceInMonths =
      (nextBillingDateTime.getFullYear() - lastBillingDateTime.getFullYear()) *
        12 +
      (nextBillingDateTime.getMonth() - lastBillingDateTime.getMonth());

    const data = await Database.subscription.create({
      data: {
        ...req.body,
        billingFrequencyInMonths: differenceInMonths,
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

    if (!isNaN(id)) {
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
    } else {
      return res.status(400).json({
        status: 400,
        message: "Invalid body parameters",
      });
    }

    const data = await Database.subscription.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        ...req.body,
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
    const data = await Database.subscription.findMany();

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
  FetchItems,
  FetchSpecificItem,
  SearchForItem,
};
