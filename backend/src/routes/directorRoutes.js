import express from 'express';
import * as directorController from '../controllers/directorController.js';

const router = express.Router();

router.get('/:id', directorController.getDirectorDetails);
router.get('/:id/movies', directorController.getDirectorMovies);

export default router;
