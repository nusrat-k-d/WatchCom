import { extractIntent } from '../services/ai/intentExtractor.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const extractMovieIntent = asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim() === '') {
    const error = new Error('Query is required');
    error.status = 400;
    throw error;
  }

  const intent = extractIntent(query);

  res.status(200).json(intent);
});