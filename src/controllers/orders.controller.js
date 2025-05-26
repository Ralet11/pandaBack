// src/controllers/order.controller.js

import Order     from "../models/order.model.js";
import OrderItem from "../models/orderItem.model.js";
import Product   from "../models/product.model.js";
import Shop      from "../models/shop.model.js";
import User      from "../models/user.model.js";
import Owner     from "../models/owner.model.js";
import Address   from "../models/address.model.js";

/* ---- Utility to generate 4-char codes ---- */
const genCode = () => Math.random().toString(36).slice(-4).toUpperCase();

/* ---- Create a new order ---- */
export const createOrder = async (req, res) => {
  const { items, shop_id, ...orderData } = req.body;
  if (!shop_id) {
    return res.status(400).json({ message: "shop_id required" });
  }

  try {
    // 1. Assign shop and generate codes
    orderData.shop_id      = shop_id;
    orderData.pickupCode   = genCode();
    orderData.deliveryCode = genCode();

    // 2. Create the order
    const order = await Order.create(orderData);

    // 3. Create each OrderItem
    for (const it of items) {
      const product = await Product.findByPk(it.product_id);
      await OrderItem.create({
        order_id:   order.id,
        product_id: it.product_id,
        quantity:   it.quantity,
        unitPrice:  product.price,
      });
    }

    // 4. Load shop details
    const shop = await Shop.findByPk(shop_id, {
      attributes: ["id", "name", "description", "latitude", "longitude", "logo"],
    });

    // 5. Return the new order plus shop info
    const orderJSON = order.toJSON();
    orderJSON.shop = shop;
    res.status(201).json(orderJSON);

  } catch (err) {
    console.error("createOrder:", err);
    res.status(400).json({ message: "Error creating order." });
  }
};

/* ---- List all orders for the authenticated user ---- */
export const getOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.findAll({
      where: { user_id: userId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Shop,
          as: "shop",
          attributes: ["id", "name", "logo", "description"],
        },
        {
          model: OrderItem,
          as: "order_items",
          attributes: ["id", "quantity", "unitPrice"],
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "price", "img"],
            },
          ],
        },
        {
          model: Address,
          as: "address",
          attributes: ["id", "street", "number", "apartment", "city", "state", "zip"],
        },
      ],
    });
    res.json(orders);
  } catch (err) {
    console.error("[ORDERS] getOrders:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ---- Retrieve a single order by ID ---- */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: Shop,
          as: "shop",
          attributes: ["id", "name", "logo", "description"],
        },
        {
          model: OrderItem,
          as: "order_items",
          attributes: ["id", "quantity", "unitPrice"],
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "price", "img"],
            },
          ],
        },
        {
          model: Address,
          as: "address"
        },
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
        {
          model: Owner,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json(order);
  } catch (err) {
    console.error("[ORDERS] getOrderById:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ---- Update the status of an order ---- */
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByPk(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found." });
  }
  await order.update({ status });
  res.json(order);
};

/* ---- Delete an order ---- */
export const deleteOrder = async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found." });
  }
  await order.destroy();
  res.json({ message: "Order deleted." });
};

/* ---- Mark an order as finished ---- */
export const finishOrder = async (req, res) => {
  const order = await Order.findByPk(req.body.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found." });
  }
  await order.update({ status: "finalizada" });
  res.json(order);
};
