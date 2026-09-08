import express from 'express';
import { extractMovieIntent } from '../controllers/aiController.js';
import { recommendMovies, couplesMatch } from '../controllers/recommendationController.js';
import { generateMarathon } from '../controllers/marathonController.js';

const router = express.Router();

router.post('/intent', extractMovieIntent);
router.post('/recommend', recommendMovies);
router.post('/recommend/couples-match', couplesMatch);
router.post('/couples-match', couplesMatch);
router.post('/marathon', generateMarathon);
router.post('/double-feature', generateMarathon);

export default router;