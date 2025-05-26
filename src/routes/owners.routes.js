import { Router } from "express";
import {
  getOwners,
  getOwnerById,
  updateOwner,
  deleteOwner
} from "../controllers/owners.controller.js";
import { verifyToken } from "../middleware/authJwt.js";

const router = Router();

router.get("/", verifyToken, getOwners);
router
  .route("/:id")
  .get(verifyToken, getOwnerById)
  .put(verifyToken, updateOwner)
  .delete(verifyToken, deleteOwner);

export default router;
