import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/users.controller.js";
import { verifyToken } from "../middleware/authJwt.js";

const router = Router();

router.get("/", verifyToken, getUsers);
router
  .route("/:id")
  .get(verifyToken, getUserById)
  .put(verifyToken, updateUser)
  .delete(verifyToken, deleteUser);

export default router;