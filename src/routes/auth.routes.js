import { Router } from "express";
import {
  registerUser,
  loginUser,
  registerOwner,
  loginOwner,
  getMeOwner
} from "../controllers/auth.controller.js";
import { verifyToken, verifyTokenOwner } from "../middleware/authJwt.js";

const router = Router();

router.post("/users/register", registerUser);
router.post("/users/login",    loginUser);
router.post("/owners/register", registerOwner);
router.post("/owners/login",    loginOwner);
router.get("/owners/me", verifyTokenOwner, getMeOwner);
export default router;
