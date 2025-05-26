// src/controllers/address.controller.js

import { Op } from "sequelize";
import Address from "../models/address.model.js";

/**
 * Helper: verifica que la dirección exista y pertenezca al usuario.
 * @throws Error si no existe o no es del usuario.
 */
const ensureOwnership = async (id, userId) => {
  const addr = await Address.findByPk(id);
  if (!addr || addr.user_id !== userId) {
    throw new Error("Address not found");
  }
  return addr;
};

/**
 * GET /api/addresses
 * Lista todas las direcciones del usuario, ordenadas por isDefault DESC y createdAt DESC.
 */
export const getAddresses = async (req, res) => {
  try {
    const list = await Address.findAll({
      where: { user_id: req.userId },
      order: [
        ["isDefault", "DESC"],
        ["createdAt", "DESC"],
      ],
    });
    res.json(list);
  } catch (err) {
    console.error("getAddresses:", err);
    res.status(500).json({ message: "Error fetching addresses" });
  }
};

/**
 * GET /api/addresses/:id
 * Obtiene una sola dirección si pertenece al usuario.
 */
export const getAddressById = async (req, res) => {
  try {
    const addr = await ensureOwnership(req.params.id, req.userId);
    res.json(addr);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/**
 * POST /api/addresses
 * Crea una nueva dirección. Si viene isDefault=true, desmarca las demás.
 */
export const createAddress = async (req, res) => {
  try {
    const data = {
      ...req.body,
      user_id: req.userId,
      // Garantizar booleano
      isDefault: Boolean(req.body.isDefault),
    };

    // Si estamos marcando esta nueva dirección como por defecto,
    // desmarcamos todas las demás del usuario.
    if (data.isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { user_id: req.userId } }
      );
    }

    const addr = await Address.create(data);
    res.status(201).json(addr);
  } catch (err) {
    console.error("createAddress:", err);
    res.status(400).json({ message: "Error creating address" });
  }
};

/**
 * PUT /api/addresses/:id
 * Actualiza una dirección existente. Si se marca isDefault=true, desmarca las demás.
 */
export const updateAddress = async (req, res) => {
  try {
    const addr = await ensureOwnership(req.params.id, req.userId);

    // Si el body pide isDefault=true, desmarcamos las demás primero
    if (req.body.isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { user_id: req.userId } }
      );
    }

    await addr.update(req.body);
    res.json(addr);
  } catch (err) {
    console.error("updateAddress:", err);
    res.status(err.message === "Address not found" ? 404 : 400).json({ message: err.message });
  }
};

/**
 * DELETE /api/addresses/:id
 * Elimina una dirección del usuario.
 */
export const deleteAddress = async (req, res) => {
  try {
    const addr = await ensureOwnership(req.params.id, req.userId);
    await addr.destroy();
    res.json({ message: "Address deleted" });
  } catch (err) {
    console.error("deleteAddress:", err);
    res.status(404).json({ message: err.message });
  }
};

/**
 * PUT /api/addresses/:id/default
 * Marca explícitamente una dirección como por defecto, desmarcando las demás.
 */
export const setDefaultAddress = async (req, res) => {
  try {
    const addr = await ensureOwnership(req.params.id, req.userId);

    // Desmarcar todas
    await Address.update(
      { isDefault: false },
      { where: { user_id: req.userId } }
    );

    // Marcar esta
    await addr.update({ isDefault: true });
    res.json(addr);
  } catch (err) {
    console.error("setDefaultAddress:", err);
    res.status(404).json({ message: err.message });
  }
};
