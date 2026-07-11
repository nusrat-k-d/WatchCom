import express from 'express';
import * as movieController from '../controllers/movieController.js';

const router = express.Router();

router.get('/search', movieController.searchMovies);
router.get('/trending', movieController.getTrendingMovies);
router.get('/:id', movieController.getMovieDetails);
router.get('/:id/cast', movieController.getMovieCredits);
router.get('/:id/similar', movieController.getSimilarMovies);
router.get('/:id/videos', movieController.getMovieVideos);

export default router;
