import express from 'express';
import * as actorController from '../controllers/actorController.js';

const router = express.Router();

router.get('/:id', actorController.getActorDetails);
router.get('/:id/movies', actorController.getActorMovies);

export default router;
