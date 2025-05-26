import Shop from "../models/shop.model.js";
import Owner from "../models/owner.model.js";

export const createShop = async (req, res) => {
  try {
    const shop = await Shop.create(req.body);
    res.status(201).json(shop);
  } catch (err) {
    res.status(400).json({ message: "Error al crear shop." });
  }
};

export const getShops = async (_, res) => {
  const shops = await Shop.findAll({ include: Owner });
  res.json(shops);
};

export const getShopById = async (req, res) => {
  const shop = await Shop.findByPk(req.params.id, { include: Owner });
  if (!shop) return res.status(404).json({ message: "Shop no encontrado." });
  res.json(shop);
};

export const updateShop = async (req, res) => {
  const shop = await Shop.findByPk(req.params.id);
  if (!shop) return res.status(404).json({ message: "Shop no encontrado." });
  await shop.update(req.body);
  res.json(shop);
};

export const deleteShop = async (req, res) => {
  const shop = await Shop.findByPk(req.params.id);
  if (!shop) return res.status(404).json({ message: "Shop no encontrado." });
  await shop.destroy();
  res.json({ message: "Shop eliminado." });
};
