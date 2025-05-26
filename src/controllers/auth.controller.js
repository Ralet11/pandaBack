import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Owner from "../models/owner.model.js";

dotenv.config();

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });

/* ------------------------------------------------------------------------ */
/* Usuarios */
/* ------------------------------------------------------------------------ */
export const registerUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = generateToken(user.id, "user");
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

    const token = generateToken(user.id, "user");
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: "Error al iniciar sesión." });
  }
};

/* ------------------------------------------------------------------------ */
/* Owners */
/* ------------------------------------------------------------------------ */
export const registerOwner = async (req, res) => {
  try {
    const owner = await Owner.create(req.body);
    const token = generateToken(owner.id, "owner");
    res.status(201).json({ owner, token });
  } catch (err) {
    res.status(400).json({ message: "Error al registrar owner." });
  }
};

export const loginOwner = async (req, res) => {
  try {
    const { email, password } = req.body;
    const owner = await Owner.findOne({ where: { email } });
    if (!owner || !(await owner.comparePassword(password)))
      return res.status(401).json({ message: "Credenciales inválidas." });

    const token = generateToken(owner.id, "owner");
    res.json({ owner, token });
  } catch (err) {
    res.status(500).json({ message: "Error al iniciar sesión." });
  }
};
