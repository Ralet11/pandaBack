import Product from "../models/product.model.js";
import Shop from "../models/shop.model.js";
import Category from "../models/category.model.js";

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: "Error al crear producto." });
  }
};

export const getProducts = async (_, res) => {
  const products = await Product.findAll({ include: [Shop, Category] });
  res.json(products);
};

export const getProductById = async (req, res) => {
  const product = await Product.findByPk(req.params.id, {
    include: [Shop, Category]
  });
  if (!product) return res.status(404).json({ message: "Producto no encontrado." });
  res.json(product);
};

export const updateProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: "Producto no encontrado." });
  await product.update(req.body);
  res.json(product);
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: "Producto no encontrado." });
  await product.destroy();
  res.json({ message: "Producto eliminado." });
};
