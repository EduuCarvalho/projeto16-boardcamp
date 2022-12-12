import { getGames, postGames } from '../controllers/games.controllers.js';

import { Router } from 'express';

const router = Router();

router.get("/games",getGames)
router.post("/games", postGames)

export default router;