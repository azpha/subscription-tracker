import { Decimal } from "database/generated/prisma/internal/prismaNamespace";
import { prisma } from "database";
import Schemas from "../utils/schemas";
import type { Request, Response, NextFunction } from "express";

async function createItem(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  try {
    const body = Schemas.subscriptionCreation.parse(req.body);

    const data = await prisma.subscription.create({
      data: body,
    });

    return res.status(200).json({
      status: 200,
      data,
    });
  } catch (e) {
    next(e);
  }
}

async function deleteItem(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid body parameters",
      });
    }

    const doesSubExist = await prisma.subscription.findFirst({
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

    await prisma.subscription.delete({
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

async function updateItem(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  try {
    const body = Schemas.subscriptionUpdate.parse({
      ...req.body,
    });

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid body parameters",
      });
    }

    const sub = await prisma.subscription.findFirst({
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

    const data = await prisma.subscription.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: body,
    });

    return res.status(200).json({
      status: 200,
      data,
    });
  } catch (e) {
    next(e);
  }
}

async function fetchItems(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  try {
    const { minPrice, maxPrice, dateRange, q, sortBy, sortDirection } =
      req.query;

    if (q) Schemas.searchForSubscription.parse(q);
    if (dateRange) Schemas.subscriptionDateRange.parse(dateRange);
    if (sortBy) Schemas.subscriptionSortBy.parse(sortBy);
    if (sortDirection) Schemas.subscriptionSortDirection.parse(sortDirection);

    const sortObject = {
      where: {},
      orderBy: {},
    };

    if (q) {
      sortObject.where = {
        ...sortObject.where,
        name: {
          contains: q,
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
        billingDate: {
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
    if (sortBy) {
      if (sortBy === "price") {
        sortObject.orderBy = {
          price: sortDirection || "desc",
        };
      } else {
        sortObject.orderBy = {
          billingDate: sortDirection || "desc",
        };
      }
    } else {
      sortObject.orderBy = {
        billingDate: "desc",
      };
    }

    const data = await prisma.subscription.findMany(sortObject);

    return res.status(200).json({
      status: 200,
      data,
    });
  } catch (e) {
    next(e);
  }
}

async function fetchItem(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid body parameters",
      });
    }

    const data = await prisma.subscription.findFirst({
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

async function searchForItem(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  try {
    Schemas.searchForSubscription.parse(req.query.q);

    const data = await prisma.subscription.findMany({
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

async function uploadIcon(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.file) {
      res.status(200).json({
        status: 200,
        name: req.file.filename,
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "No file provided",
      });
    }
  } catch (e) {
    next(e);
  }
}

export default {
  createItem,
  updateItem,
  searchForItem,
  fetchItem,
  fetchItems,
  deleteItem,
  uploadIcon,
};
