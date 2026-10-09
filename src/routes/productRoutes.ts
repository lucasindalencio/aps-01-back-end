import { Router } from "express";
import ProductController from "../controllers/ProductController.js";

const router = Router();

router.get("/", ProductController.getAll);
router.get("/search/:keyword", ProductController.getByKeyword);
router.get("/:id", ProductController.getById);
router.post("/", ProductController.create);
router.put("/:id", ProductController.update);
router.delete("/:id", ProductController.remove);

export default router;
