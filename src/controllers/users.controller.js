import User from "../models/user.model.js";

export const getUsers = async (_, res) => {
  const users = await User.findAll();
  res.json(users);
};

export const getUserById = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "Usuario no encontrado." });
  res.json(user);
};

export const updateUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "Usuario no encontrado." });
  await user.update(req.body);
  res.json(user);
};

export const deleteUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "Usuario no encontrado." });
  await user.destroy();
  res.json({ message: "Usuario eliminado." });
};
