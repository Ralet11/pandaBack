import { Router } from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  finishOrder
} from "../controllers/orders.controller.js";
import { verifyToken } from "../middleware/authJwt.js";

const router = Router();

router.post("/", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
router
  .route("/:id")
  .get(verifyToken, getOrderById)
  .put(verifyToken, updateOrderStatus)
  .delete(verifyToken, deleteOrder);
router.post("/finish", finishOrder)
export default router;
