import { Router } from "express";
import itemsController from "../controllers/items";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import env from "../utils/env";

const router = Router();

const allowed_types = new Set(["image/png", "image/jpeg", "image/webp"]);
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(env.DATA_PATH, "files");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    cb(null, crypto.randomBytes(8).toString("hex") + extension);
  },
});
const upload = multer({
  storage: multerStorage,
  fileFilter: (req, file, cb) => {
    if (!allowed_types.has(file.mimetype)) {
      return cb(new Error("Bad mimetype!"));
    } else cb(null, true);
  },
});

router.get("/", itemsController.fetchItems);
router.get("/:id", itemsController.fetchItem);
router.get("/search", itemsController.searchForItem);
router.post("/", itemsController.createItem);
router.post("/icon", upload.single("content"), itemsController.uploadIcon);
router.patch("/:id", itemsController.updateItem);
router.delete("/:id", itemsController.deleteItem);

export default router;
