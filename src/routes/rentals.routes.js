

import { Router } from "express";
import { deleteRentals, getRentals, postRentals, postRentalsByID } from "../controllers/rentals.controllers.js";

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals",postRentals);
router.post ("/rentals/:id/return",postRentalsByID);
router.delete("/rentals/:id",deleteRentals)

export default router;