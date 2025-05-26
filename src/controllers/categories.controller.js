import Category from "../models/category.model.js";

export const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: "Error al crear categoría." });
  }
};

export const getCategories = async (_, res) => {
  const categories = await Category.findAll();
  res.json(categories);
};
