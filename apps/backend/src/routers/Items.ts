import { Router } from "express";
import ItemsController from "../controllers/Items";

const router = Router();

router.get("/", ItemsController.FetchItems);
router.get("/:id", ItemsController.FetchSpecificItem);
router.get("/search", ItemsController.SearchForItem);
router.post("/", ItemsController.CreateNewItem);
router.patch("/:id", ItemsController.UpdateItems);

export default router;
