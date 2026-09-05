import express from 'express';
import { extractMovieIntent } from '../controllers/aiController.js';
import { recommendMovies, couplesMatch } from '../controllers/recommendationController.js';

const router = express.Router();

router.post('/intent', extractMovieIntent);
router.post('/recommend', recommendMovies);
router.post('/recommend/couples-match', couplesMatch);
router.post('/couples-match', couplesMatch);

export default router;