import { Router } from "express";
import CategoryController from "../controllers/CategoryController.js";

const router = Router();

router.get("/", CategoryController.getAll);
router.get("/search/:keyword", CategoryController.getByKeyword);
router.get("/:id", CategoryController.getById);
router.post("/", CategoryController.create);
router.put("/:id", CategoryController.update);
router.delete("/:id", CategoryController.remove);

export default router;
