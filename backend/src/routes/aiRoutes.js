import express from 'express';
import { extractMovieIntent } from '../controllers/aiController.js';
import { recommendMovies } from '../controllers/recommendationController.js';

const router = express.Router();

router.get('/intent', extractMovieIntent);
router.post('/intent', extractMovieIntent);

router.get('/recommend', recommendMovies);
router.post('/recommend', recommendMovies);

export default router;