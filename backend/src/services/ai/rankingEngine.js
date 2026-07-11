import * as tmdbService from '../tmdb/tmdbService.js';

const POPULARITY_THRESHOLD = 15;

/**
 * Scores a single movie candidate based on user intent and predefined rules.
 * 
 * @param {object} movie - The candidate movie object
 * @param {object} intent - User intent containing referenceMovie, runtime, etc.
 * @param {number[]} refMovieGenreIds - Genre IDs of the reference movie, if available
 * @returns {number} The calculated watchComScore
 */
const calculateScore = (movie, intent, refMovieGenreIds) => {
  let score = 0;

  // Rule 1: Reference movie exists and genres overlap (+40 points)
  if (intent && intent.referenceMovie && refMovieGenreIds && refMovieGenreIds.length > 0) {
    const candidateGenreIds = movie.genre_ids || [];
    const hasGenreOverlap = candidateGenreIds.some(id => refMovieGenreIds.includes(id));
    if (hasGenreOverlap) {
      score += 40;
    }
  }

  // Rule 2: Runtime is within the user's requested runtime (+20 points)
  if (intent && intent.runtime !== undefined && intent.runtime !== null) {
    if (movie.runtime && movie.runtime <= intent.runtime) {
      score += 20;
    }
  }

  // Rule 3: vote_average >= 7 (+20 points)
  if (movie.vote_average !== undefined && movie.vote_average >= 7) {
    score += 20;
  }

  // Rule 4: Popularity is reasonably high (+10 points)
  if (movie.popularity !== undefined && movie.popularity >= POPULARITY_THRESHOLD) {
    score += 10;
  }

  // Rule 5: Release year is newer than 2000 (+10 points)
  if (movie.release_date) {
    const releaseYear = parseInt(movie.release_date.split('-')[0], 10);
    if (!isNaN(releaseYear) && releaseYear > 2000) {
      score += 10;
    }
  }

  return score;
};

/**
 * Ranks candidate movies based on user intent and WatchCom scoring rules.
 * 
 * @param {object[]} candidates - Array of candidate movie objects
 * @param {object} intent - Extracted user intent
 * @returns {Promise<object[]>} Sorted array of movies with watchComScore added
 */
export const rankMovies = async (candidates, intent) => {
  if (!candidates || !Array.isArray(candidates)) {
    return [];
  }

  let refMovieGenreIds = [];

  // Fetch reference movie genre IDs if it exists in intent
  if (intent && intent.referenceMovie) {
    try {
      const searchResult = await tmdbService.searchMovies(intent.referenceMovie);
      const refMovie = searchResult.results?.[0];
      if (refMovie && Array.isArray(refMovie.genre_ids)) {
        refMovieGenreIds = refMovie.genre_ids;
      }
    } catch (error) {
      console.error(`[Ranking Engine] Error fetching reference movie "${intent.referenceMovie}":`, error.message);
    }
  }

  // Calculate scores
  const scoredCandidates = candidates.map(movie => {
    const watchComScore = calculateScore(movie, intent, refMovieGenreIds);
    return {
      ...movie,
      watchComScore
    };
  });

  // Sort descending by watchComScore
  return scoredCandidates.sort((a, b) => b.watchComScore - a.watchComScore);
};
