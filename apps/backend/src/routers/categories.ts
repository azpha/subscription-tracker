import { Router } from "express";
import categories from "../controllers/categories";

const router = Router();
router.post("/", categories.createCategory);
router.delete("/:id", categories.deleteCategory);
router.patch("/:id", categories.renameCategory);

export default router;
