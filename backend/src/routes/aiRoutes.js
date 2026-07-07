import express from 'express';
import { extractMovieIntent } from '../controllers/aiController.js';

const router = express.Router();

router.post('/intent', extractMovieIntent);

export default router;