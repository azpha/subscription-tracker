import { Router } from 'express';
import BudgetController from '../controllers/Budget.js';
import Authentication from '../services/Authentication.js';
const router = Router();

// get
router.get("/", BudgetController.RetrieveAllItems);
router.get("/:id", BudgetController.RetrieveItem);

// post
router.post("/", Authentication.verifyJwt, BudgetController.CreateItem);

// patch
router.patch("/:id", Authentication.verifyJwt, BudgetController.EditItem);
router.patch("/:id/pushToNext", Authentication.verifyJwt, BudgetController.PushToNextCycle);

// delete
router.delete("/:id", Authentication.verifyJwt, BudgetController.DeleteItem);

export default router;