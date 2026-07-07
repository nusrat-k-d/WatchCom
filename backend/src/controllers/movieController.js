import * as tmdbService from '../services/tmdb/tmdbService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Controller for searching movies
 * Route: GET /api/movies/search?q=...
 */
export const searchMovies = asyncHandler(async (req, res) => {
  const { q, page } = req.query;
  const parsedPage = parseInt(page, 10) || 1;

  if (!q || q.trim() === '') {
    const error = new Error('Query parameter "q" is required and cannot be empty');
    error.status = 400;
    throw error;
  }

  const data = await tmdbService.searchMovies(q, parsedPage);
  res.status(200).json(data);
});

/**
 * Controller for getting trending movies
 * Route: GET /api/movies/trending
 */
export const getTrendingMovies = asyncHandler(async (req, res) => {
  const { timeWindow, page } = req.query;
  const parsedPage = parseInt(page, 10) || 1;

  const data = await tmdbService.getTrendingMovies(timeWindow || 'day', parsedPage);
  res.status(200).json(data);
});

/**
 * Controller for getting detailed movie information by TMDb ID
 * Route: GET /api/movies/:id
 */
export const getMovieDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const movieId = parseInt(id, 10);

  if (isNaN(movieId) || movieId <= 0) {
    const error = new Error('Movie ID must be a valid positive integer');
    error.status = 400;
    throw error;
  }

  const data = await tmdbService.getMovieDetails(movieId);
  res.status(200).json(data);
});

/**
 * Controller for getting movie credits (cast & crew)
 * Route: GET /api/movies/:id/cast
 */
export const getMovieCredits = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const movieId = parseInt(id, 10);

  if (isNaN(movieId) || movieId <= 0) {
    const error = new Error('Movie ID must be a valid positive integer');
    error.status = 400;
    throw error;
  }

  const data = await tmdbService.getMovieCredits(movieId);
  res.status(200).json(data);
});

/**
 * Controller for getting similar movies
 * Route: GET /api/movies/:id/similar
 */
export const getSimilarMovies = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page } = req.query;
  const movieId = parseInt(id, 10);
  const parsedPage = parseInt(page, 10) || 1;

  if (isNaN(movieId) || movieId <= 0) {
    const error = new Error('Movie ID must be a valid positive integer');
    error.status = 400;
    throw error;
  }

  const data = await tmdbService.getSimilarMovies(movieId, parsedPage);
  res.status(200).json(data);
});
