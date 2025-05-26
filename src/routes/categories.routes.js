import { Router } from "express";
import {
  createCategory,
  getCategories
} from "../controllers/categories.controller.js";
import { verifyToken } from "../middleware/authJwt.js";

const router = Router();

router.post("/", verifyToken, createCategory);
router.get("/", getCategories);

export default router;
