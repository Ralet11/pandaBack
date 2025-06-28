// src/middleware/authJwt.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyTokenOwner = (req, res, next) => {
  console.log("aqui token")
  const raw = req.headers["x-access-token"] || req.headers.authorization;
  if (!raw) return res.status(401).json({ message: "Token no proporcionado." });

  try {
    const token = raw.replace("Bearer ", "");
    console.log(token, "token en jwt")
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.ownerId = decoded.id;        // <── solo id
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido." });
  }
};


dotenv.config();

export const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers.authorization;
  if (!token)
    return res.status(401).json({ message: "Token no proporcionado." });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido." });
  }
};
