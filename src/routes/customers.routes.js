import { getCustomers, getCustomersByID, postCustomers } from "../controllers/customers.controllers.js";

import { Router } from "express";

const router = Router();

router.get("/customers",getCustomers);
router.get("/customers/:id",getCustomersByID);
router.post("/custormers",postCustomers);

export default router;