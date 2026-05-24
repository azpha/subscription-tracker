import { prisma } from "database";
import schemas from "../utils/schemas";
import type { Request, Response, NextFunction } from "express";

async function fetchAllCategories(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const categories = await prisma.category.findMany();

    res.status(200).json(categories);
    return;
  } catch (e) {
    next(e);
  }
}

async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = schemas.category.parse(req.body);

    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    res.status(200).json(category);
    return;
  } catch (e) {
    next(e);
  }
}

async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const id = schemas.id.parse(req.params.id);

    if (id) {
      await prisma.category.delete({
        where: {
          id,
        },
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "No ID provided",
      });
      return;
    }

    res.sendStatus(204);
    return;
  } catch (e) {
    next(e);
  }
}

async function renameCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const id = schemas.id.parse(req.params.id);
    const { name } = schemas.category.parse(req.body);

    const category = await prisma.category.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    res.status(200).json(category);
    return;
  } catch (e) {
    next(e);
  }
}

export default {
  fetchAllCategories,
  createCategory,
  deleteCategory,
  renameCategory,
};
