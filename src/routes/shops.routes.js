import { Router } from "express";
import {
  createShop,
  getShops,
  getShopById,
  updateShop,
  deleteShop
} from "../controllers/shops.controller.js";
import { verifyToken } from "../middleware/authJwt.js";

const router = Router();

router.post("/", verifyToken, createShop);
router.get("/", getShops);
router
  .route("/:id")
  .get(getShopById)
  .put(verifyToken, updateShop)
  .delete(verifyToken, deleteShop);

export default router;
