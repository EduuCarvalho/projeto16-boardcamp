import { getCategories, postCategories } from '../controllers/categories.controllers.js';

import { Router } from 'express';

const router = Router();

router.get("/categories",getCategories);
router.post("/categories",postCategories)

export default router;