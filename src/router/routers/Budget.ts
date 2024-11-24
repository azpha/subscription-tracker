import { Router } from 'express';
import BudgetController from '../controllers/Budget.js';
const router = Router();

// get
router.get("/", BudgetController.RetrieveAllItems);
router.get("/:id", BudgetController.RetrieveItem);

// post
router.post("/", BudgetController.CreateItem);

// patch
router.patch("/:id", BudgetController.EditItem);
router.patch("/:id/pushToNext", BudgetController.PushToNextCycle);

// delete
router.delete("/:id", BudgetController.DeleteItem);

export default router;