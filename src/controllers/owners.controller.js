import Owner from "../models/owner.model.js";

export const getOwners = async (_, res) => {
  const owners = await Owner.findAll();
  res.json(owners);
};

export const getOwnerById = async (req, res) => {
  const owner = await Owner.findByPk(req.params.id);
  if (!owner) return res.status(404).json({ message: "Owner no encontrado." });
  res.json(owner);
};

export const updateOwner = async (req, res) => {
  const owner = await Owner.findByPk(req.params.id);
  if (!owner) return res.status(404).json({ message: "Owner no encontrado." });
  await owner.update(req.body);
  res.json(owner);
};

export const deleteOwner = async (req, res) => {
  const owner = await Owner.findByPk(req.params.id);
  if (!owner) return res.status(404).json({ message: "Owner no encontrado." });
  await owner.destroy();
  res.json({ message: "Owner eliminado." });
};
