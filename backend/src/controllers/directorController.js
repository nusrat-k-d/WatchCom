import * as tmdbService from '../services/tmdb/tmdbService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Controller for getting director details by person ID
 * Route: GET /api/directors/:id
 */
export const getDirectorDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const personId = parseInt(id, 10);

  if (isNaN(personId) || personId <= 0) {
    const error = new Error('Person ID must be a valid positive integer');
    error.status = 400;
    throw error;
  }

  const data = await tmdbService.getActorDetails(personId);
  res.status(200).json(data);
});

/**
 * Controller for getting movies a director has directed
 * Route: GET /api/directors/:id/movies
 */
export const getDirectorMovies = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const personId = parseInt(id, 10);

  if (isNaN(personId) || personId <= 0) {
    const error = new Error('Person ID must be a valid positive integer');
    error.status = 400;
    throw error;
  }

  const data = await tmdbService.getActorMovieCredits(personId);
  const crewCredits = data.crew || [];

  // Filter only movies where the person worked as Director
  const directedMovies = crewCredits.filter(credit => credit.job === "Director");

  // Remove duplicates
  const uniqueMoviesMap = new Map();
  for (const m of directedMovies) {
    if (m && m.id && !uniqueMoviesMap.has(m.id)) {
      uniqueMoviesMap.set(m.id, m);
    }
  }
  const uniqueMovies = Array.from(uniqueMoviesMap.values());

  // Sort by popularity descending
  uniqueMovies.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

  const GENRE_ID_TO_NAME = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
  };

  // Map to clean movie objects compatible with frontend MovieCard component
  const cleanMovies = uniqueMovies.map(m => {
    const genres = Array.isArray(m.genre_ids)
      ? m.genre_ids.map(id => GENRE_ID_TO_NAME[id] || "").filter(Boolean)
      : [];
    if (genres.length === 0) genres.push("Drama");

    const releaseYear = m.release_date ? parseInt(m.release_date.split("-")[0], 10) : 0;

    return {
      id: String(m.id),
      title: m.title || m.original_title || "Untitled",
      year: isNaN(releaseYear) ? 0 : releaseYear,
      runtime: "N/A",
      genres,
      overview: m.overview || "",
      posterUrl: m.poster_path 
        ? `https://image.tmdb.org/t/p/w500${m.poster_path}` 
        : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500",
      rating: m.vote_average ? Number((m.vote_average / 2).toFixed(1)) : 0,
      voteCount: m.vote_count || 0,
      popularity: m.popularity || 0
    };
  });

  res.status(200).json({
    cast: cleanMovies
  });
});
