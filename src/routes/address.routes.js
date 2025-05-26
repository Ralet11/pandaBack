/* routes/addresses.routes.js */
import { Router } from "express";
import {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/address.controller.js";
import { verifyToken } from "../middleware/authJwt.js";

const router = Router();

router.use(verifyToken);          // todas requieren usuario logueado

router.route("/")
      .get(getAddresses)          // GET /api/addresses
      .post(createAddress);       // POST /api/addresses

router.route("/:id")
      .get(getAddressById)        // GET /api/addresses/:id
      .put(updateAddress)         // PUT /api/addresses/:id
      .delete(deleteAddress);     // DELETE /api/addresses/:id

router.put("/:id/default", setDefaultAddress); // PUT /api/addresses/:id/default

export default router;
