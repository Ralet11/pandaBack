import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/products.controller.js";
import { verifyToken } from "../middleware/authJwt.js";

const router = Router();

router.post("/", verifyToken, createProduct);
router.get("/", getProducts);
router
  .route("/:id")
  .get(getProductById)
  .put(verifyToken, updateProduct)
  .delete(verifyToken, deleteProduct);

export default router;
