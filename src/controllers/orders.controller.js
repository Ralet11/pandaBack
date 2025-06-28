import Order     from "../models/order.model.js";
import OrderItem from "../models/orderItem.model.js";
import Product   from "../models/product.model.js";
import Shop      from "../models/shop.model.js";
import User      from "../models/user.model.js";
import Owner     from "../models/owner.model.js";
import Address   from "../models/address.model.js";
import { getIo } from "../socket.js";
import axios     from "axios";     
/* ---- Utility to generate 4-char codes ---- */
const genCode = () => Math.random().toString(36).slice(-4).toUpperCase();

/* ──────────────────────────────────────────────────────────── */
/*                       CREATE  ORDER                         */
/* ──────────────────────────────────────────────────────────── */
export const createOrder = async (req, res) => {
  const { items, shop_id, ...orderData } = req.body;
  if (!shop_id) return res.status(400).json({ message: "shop_id required" });

  try {
    orderData.shop_id      = shop_id;
    orderData.pickupCode   = genCode();
    orderData.deliveryCode = genCode();

    const order = await Order.create(orderData);

    for (const it of items) {
      const product = await Product.findByPk(it.product_id);
      await OrderItem.create({
        order_id:   order.id,
        product_id: it.product_id,
        quantity:   it.quantity,
        unitPrice:  product.price,
      });
    }

    const shop = await Shop.findByPk(shop_id, {
      attributes: ["id", "name", "description", "latitude", "longitude", "logo"],
    });

    const orderJSON = order.toJSON();
    orderJSON.shop = shop;

    res.status(201).json(orderJSON);
  } catch (err) {
    console.error("createOrder:", err);
    res.status(400).json({ message: "Error creating order." });
  }
};

/* ──────────────────────────────────────────────────────────── */
/*                ORDERS OF LOGGED-IN USER                     */
/* ──────────────────────────────────────────────────────────── */
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.userId },
      order: [["createdAt", "DESC"]],
      include: [
        { model: Shop,      as: "shop",        attributes: ["id", "name", "logo", "description"] },
        { model: OrderItem, as: "order_items", attributes: ["id", "quantity", "unitPrice"],
          include: [{ model: Product, as: "product", attributes: ["id", "name", "price", "img"] }] },
        { model: Address,   as: "address" },
      ],
    });
    res.json(orders);
  } catch (err) {
    console.error("[ORDERS] getOrders:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ──────────────────────────────────────────────────────────── */
/*             ORDERS OF ONE SHOP  (OWNER PANEL)               */
/* ──────────────────────────────────────────────────────────── */
export const getOrdersOwner = async (req, res) => {
  try {
    const shopId = Number(req.params.shopId);
    if (!shopId) return res.status(400).json({ message: "shopId param required." });

    const shop = await Shop.findByPk(shopId, {
      attributes: ["id", "name", "logo", "description"],
    });
    if (!shop) return res.status(404).json({ message: "Shop not found." });

    const orders = await Order.findAll({
      where: { shop_id: shopId },
      order: [["createdAt", "DESC"]],
      include: [
        { model: Shop,      as: "shop",        attributes: ["id", "name", "logo", "description"] },
        { model: OrderItem, as: "order_items", attributes: ["id", "quantity", "unitPrice"],
          include: [{ model: Product, as: "product", attributes: ["id", "name", "price", "img"] }] },
        { model: Address,   as: "address" },
        { model: User,      attributes: ["id", "name", "email"] },
      ],
    });

    res.json(orders);
  } catch (err) {
    console.error("[ORDERS] getOrdersOwner:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ──────────────────────────────────────────────────────────── */
/*                       ORDER  BY  ID                         */
/* ──────────────────────────────────────────────────────────── */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: Shop,      as: "shop",        attributes: ["id", "name", "logo", "description"] },
        { model: OrderItem, as: "order_items", attributes: ["id", "quantity", "unitPrice"],
          include: [{ model: Product, as: "product", attributes: ["id", "name", "price", "img"] }] },
        { model: Address,   as: "address" },
        { model: User,      attributes: ["id", "name", "email"] },
      ],
    });

    if (!order) return res.status(404).json({ message: "Order not found." });

    res.json(order);
  } catch (err) {
    console.error("[ORDERS] getOrderById:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ──────────────────────────────────────────────────────────── */
/*                   UPDATE  ORDER  STATUS                     */
/* ──────────────────────────────────────────────────────────── */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    await order.update({ status });

    /* -------- Socket: notificar al usuario -------- */
    const io = getIo();
    io.to(String(order.user_id)).emit("order_state_changed", {
      orderId: order.id,
      status,
    });

    /* -------- Si pasa a "envio" → notificar al servicio de drivers -------- */
    if (status === "aceptada" && order.deliveryPayload) {
      console.log(order.deliveryPayload)
      try {
        console.log("enviando order")
        await axios.post(
          "https://cf38-143-105-137-227.ngrok-free.app/drivers/orders/new",
          order.deliveryPayload,
        );
        console.log("[Order] deliveryPayload enviado al micro-servicio");
      } catch (driverErr) {
        // logueamos pero no rompemos el flujo principal
        console.error("[Order] error enviando a drivers:", driverErr.message);
      }
    }

    res.json(order);
  } catch (err) {
    console.error("[ORDERS] updateOrderStatus:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ──────────────────────────────────────────────────────────── */
/*                    DELETE  &  FINISH                        */
/* ──────────────────────────────────────────────────────────── */
export const deleteOrder = async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found." });
  await order.destroy();
  res.json({ message: "Order deleted." });
};

export const finishOrder = async (req, res) => {
  const order = await Order.findByPk(req.body.id);
  if (!order) return res.status(404).json({ message: "Order not found." });
  await order.update({ status: "finalizada" });
  res.json(order);
};

export const sendingOrder = async (req, res) => {
  const order = await Order.findByPk(req.body.id);
  if (!order) return res.status(404).json({ message: "Order not found." });
  await order.update({ status: "envio" });

  const io = getIo();
    io.to(String(order.user_id)).emit("order_state_changed", {
      orderId: order.id,
      status: "envio",
    });

  res.json(order);
};

export const driverLocation = async (req, res) => {
  try {
    const { orderId, lat, lng, name } = req.body;
    console.log(req.body)

    if (!orderId || lat == null || lng == null || !name) {
      return res
        .status(400)
        .json({ message: "orderId, lat, lng y name son requeridos" });
    }

    /* 1. Buscar orden */
    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: "Order not found." });

    /* 2. Actualizar campos de entrega */
    await order.update({
      deliveryLat:  lat,
      deliveryLng:  lng,
      deliveryName: name,
    });

    /* 3. Notificar al usuario por WebSocket */
    const io = getIo();
    io.to(String(order.user_id)).emit("driver_assigned", {
      orderId: order.id,
      deliveryLat:  lat,
      deliveryLng:  lng,
      deliveryName: name,
    });

    res.json(order);
  } catch (err) {
    console.error("[ORDERS] driverLocation:", err);
    res.status(500).json({ message: err.message });
  }
};

export const updateDeliveryPayload = async (req, res) => {
  console.log("aqui")
  try {
    const { deliveryPayload } = req.body;
    console.log(req.body)
    if (!deliveryPayload)
      return res.status(400).json({ message: "deliveryPayload required." });

    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    await order.update({ deliveryPayload });

    res.json(order);
  } catch (err) {
    console.error("[ORDERS] updateDeliveryPayload:", err);
    res.status(500).json({ message: err.message });
  }
};