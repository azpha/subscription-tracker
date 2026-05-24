import { Router } from "express";
import itemsController from "../controllers/Items";

const router = Router();

router.get("/", itemsController.fetchItems);
router.get("/:id", itemsController.fetchItem);
router.get("/search", itemsController.searchForItem);
router.post("/", itemsController.createItem);
router.patch("/:id", itemsController.updateItem);
router.delete("/:id", itemsController.deleteItem);

export default router;
