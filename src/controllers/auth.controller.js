// src/controllers/auth.controller.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Owner from "../models/owner.model.js";
import Shop from "../models/shop.model.js";

dotenv.config();

/* ─────────────────────────────  HELPERS  ───────────────────────────── */

const generateJwt = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });

/* ─────────────────────────────  USERS  ─────────────────────────────── */

export const registerUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = generateJwt(user.id, "user");
    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error al registrar usuario." });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Credenciales inválidas." });

    const token = generateJwt(user.id, "user");
    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al iniciar sesión." });
  }
};

/* ─────────────────────────────  OWNERS  ────────────────────────────── */

export const registerOwner = async (req, res) => {
  console.log(req.body)
  try {
    // Validación básica de campos requeridos
    const required = [
      "name",
      "lastName",
      "address",
      "latitude",
      "longitude",
      "email",
      "password",
    ];
    const missing = required.filter((k) => !req.body[k]);

    if (missing.length)
      return res
        .status(400)
        .json({ message: `Missing fields: ${missing.join(", ")}` });

    const owner = await Owner.create(req.body);
    const token = generateJwt(owner.id, "owner");

    res.status(201).json({ user: owner, token });
  } catch (err) {
    if (err.name === "SequelizeValidationError")
      return res.status(400).json({ message: err.errors[0].message });

    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginOwner = async (req, res) => {
  try {
    const { email, password } = req.body

    // incluye la tienda asociada (puede ser null)
    const owner = await Owner.findOne({
      where: { email },
      include: { model: Shop, attributes: { exclude: ["createdAt", "updatedAt"] } },
    })

    if (!owner)
      return res.status(401).json({ message: "Credenciales inválidas." })

    const token = generateJwt(owner.id, "owner")

    console.log(owner.shops, "owner en back")

    // Sequelize anida la tienda en owner.Shop
    res.json({ owner, shop: owner.shops ?? null, token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Error al iniciar sesión." })
  }
}

export const getMeOwner = async (req, res) => {
  console.log(req.ownerId)
  try {
    const owner = await Owner.findByPk(req.ownerId);
    if (!owner) return res.status(404).json({ message: "No encontrado." });
    res.json(owner);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener perfil." });
  }
};