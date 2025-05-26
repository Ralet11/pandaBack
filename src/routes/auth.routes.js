import { Router } from "express";
import {
  registerUser,
  loginUser,
  registerOwner,
  loginOwner
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/users/register", registerUser);
router.post("/users/login",    loginUser);
router.post("/owners/register", registerOwner);
router.post("/owners/login",    loginOwner);

export default router;
