import { Router } from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  getOrdersOwner,
  updateOrderStatus,
  deleteOrder,
  finishOrder,
  updateDeliveryPayload,
  driverLocation,
  sendingOrder,
} from "../controllers/orders.controller.js";
import { verifyToken, verifyTokenOwner } from "../middleware/authJwt.js";

const router = Router();

/* --------------------------- Cliente final --------------------------- */
router.post("/", verifyToken, createOrder);       // generar orden
router.get("/",  verifyToken, getOrders);         // órdenes del usuario
router.get("/:id", verifyToken, getOrderById);

/* --------------------------- Panel del dueño ------------------------ */
router.get("/owner/:shopId", verifyTokenOwner, getOrdersOwner);

/* --------------------------- Acciones sobre orden ------------------- */
router.patch("/:id/status", verifyTokenOwner, updateOrderStatus); // ← PATCH + socket
router.delete("/:id",        verifyTokenOwner, deleteOrder);
router.post("/finish", finishOrder);
router.post("/sending", sendingOrder)
router.post("/tracking", driverLocation);
router.put("/:id/delivery-payload", updateDeliveryPayload);
export default router;
