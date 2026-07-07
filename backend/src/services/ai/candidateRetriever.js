import * as tmdbService from '../tmdb/tmdbService.js';

const GENRE_MAP = {
  'Comedy': 35,
  'Drama': 18,
  'Sci-Fi': 878,
  'Action': 28,
  'Horror': 27,
  'Thriller': 53,
  'Romance': 10749,
  'Animation': 16,
  'Fantasy': 14,
  'Crime': 80,
  'Mystery': 9648
};

/**
 * Retrieves candidate movies based on user intent.
 * Decides whether to query similar movies, discover movies by genres, or return trending movies.
 * Filters duplicates, filters by runtime, and limits to top 20 candidates.
 * 
 * @param {object} intent - The extracted user intent containing:
 *   referenceMovie, genres, mood, runtime, avoid, complexity
 * @returns {Promise<object[]>} Array of clean movie objects
 */
export const getCandidateMovies = async (intent) => {
  let rawCandidates = [];

  // Step 1: Candidate Generation
  console.log("Reference Movie:", intent.referenceMovie || "None");

  if (intent.referenceMovie) {
    // 1. Search for the reference movie title
    const searchResult = await tmdbService.searchMovies(intent.referenceMovie);
    const refMovie = searchResult.results?.[0];
    
    console.log("Search Result:", refMovie ? refMovie.title : "None");
    console.log("TMDb ID:", refMovie ? refMovie.id : "None");

    if (refMovie) {
      // 2. Fetch recommended movies using the found movie ID
      const recommendationsResult = await tmdbService.getMovieRecommendations(refMovie.id);
      
      console.log("TMDb URL:", `https://api.themoviedb.org/3/movie/${refMovie.id}/recommendations`);
      console.log("Similar Movies Count:", recommendationsResult.results?.length || 0);
      console.log("First 5 Similar Movie Titles:", (recommendationsResult.results || []).slice(0, 5).map(m => m.title));
      
      rawCandidates = recommendationsResult.results || [];
    }
  } else if (intent.genres && intent.genres.length > 0) {
    console.log("Search Result: None (No reference movie, searching by genres)");
    console.log("TMDb ID: None");
    console.log("TMDb URL: None");
    console.log("Similar Movies Count: 0");
    console.log("First 5 Similar Movie Titles: []");

    // 1. Map genre names to TMDb IDs
    const genreIds = intent.genres
      .map(name => GENRE_MAP[name])
      .filter(id => id !== undefined);

    if (genreIds.length > 0) {
      // 2. Search using Discover API
      const genreIdsString = genreIds.join(',');
      const discoverResult = await tmdbService.discoverMoviesByGenres(genreIdsString);
      rawCandidates = discoverResult.results || [];
    } else {
      // Fallback if genres did not map to any IDs
      const trendingResult = await tmdbService.getTrendingMovies('day');
      rawCandidates = trendingResult.results || [];
    }
  } else {
    console.log("Search Result: None (No reference movie or genres, fallback to trending)");
    console.log("TMDb ID: None");
    console.log("TMDb URL: None");
    console.log("Similar Movies Count: 0");
    console.log("First 5 Similar Movie Titles: []");

    // 1. Fallback to trending movies
    const trendingResult = await tmdbService.getTrendingMovies('day');
    rawCandidates = trendingResult.results || [];
  }

  // Step 2: Remove Duplicates (using movie ID)
  const uniqueCandidates = [];
  const seenIds = new Set();
  for (const movie of rawCandidates) {
    if (movie && movie.id && !seenIds.has(movie.id)) {
      seenIds.add(movie.id);
      uniqueCandidates.push(movie);
    }
  }

  // Step 3: Filter by Runtime (if runtime exists)
  let filteredCandidates = uniqueCandidates;
  if (intent.runtime) {
    const detailedCandidates = [];
    for (const movie of uniqueCandidates) {
      try {
        const details = await tmdbService.getMovieDetails(movie.id);
        if (details) {
          detailedCandidates.push(details);
        }
      } catch (error) {
        console.error(`Failed to fetch details for movie ID ${movie.id}:`, error.message);
      }
    }

    filteredCandidates = detailedCandidates.filter(movie => {
      if (!movie) return false;
      // If runtime exists and exceeds the requested limit, filter it out
      if (movie.runtime && movie.runtime > intent.runtime) {
        return false;
      }
      return true;
    });

    console.log("Runtime Filter Count:", uniqueCandidates.length - filteredCandidates.length);
  } else {
    console.log("Runtime Filter Count: 0");
  }

  // Step 4: Map and format into clean movie objects
  const cleanCandidates = filteredCandidates.map(movie => ({
    id: movie.id,
    title: movie.title || movie.original_title || 'Untitled',
    overview: movie.overview || '',
    poster_path: movie.poster_path || null,
    release_date: movie.release_date || null,
    vote_average: movie.vote_average || 0
  }));

  // Step 5: Return only the first 20 candidate movies
  const finalCandidates = cleanCandidates.slice(0, 20);
  console.log("Final Candidate Count:", finalCandidates.length);
  return finalCandidates;
};
