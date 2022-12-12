import { getCustomers, getCustomersByID, postCustomers,updateCustomers } from "../controllers/customers.controllers.js";

import { Router } from "express";
import { schemaCustomersValidation } from "../middlewares/schema.customers.validation.js";

const router = Router();

router.get("/customers",getCustomers);
router.get("/customers/:id",getCustomersByID);
router.post("/customers",schemaCustomersValidation,postCustomers);
router.put("/customers/:id",schemaCustomersValidation,updateCustomers)

export default router;