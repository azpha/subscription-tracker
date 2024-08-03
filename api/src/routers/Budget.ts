import { Router } from 'express';
import BudgetController from '../controllers/Budget';
const router = Router();

router.get("/", BudgetController.RetrieveAllItems);
router.post("/", BudgetController.CreateItem);
router.get("/:id", BudgetController.RetrieveItem);
router.delete("/:id", BudgetController.DeleteItem);

export default router;