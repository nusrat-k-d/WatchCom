import express from 'express';
import { extractMovieIntent } from '../controllers/aiController.js';
import { recommendMovies } from '../controllers/recommendationController.js';

const router = express.Router();

router.post('/intent', extractMovieIntent);
router.post('/recommend', recommendMovies);

export default router;