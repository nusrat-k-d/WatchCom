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
  'Mystery': 9648,
  'Family': 10751,
  'Adventure': 12,
  'Documentary': 99,
  'History': 36,
  'War': 10752,
  'Western': 37
};

/**
 * Retrieves candidate movies based on user intent.
 * Decides whether to query similar movies, discover movies by genres, or return trending movies.
 * Filters duplicates, filters by runtime, and limits to top 20 candidates.
 * 
 * @param {object} intent - The extracted user intent containing:
 *   originalQuery, referenceMovie, genres, mood, runtime, avoid, complexity
 * @returns {Promise<object[]>} Array of clean movie objects
 */
export const getCandidateMovies = async (intent) => {
  let rawCandidates = [];
  const query = intent.originalQuery || '';

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
      
      // Combine the reference movie itself and its recommendations
      rawCandidates = [refMovie, ...(recommendationsResult.results || [])];
    }
  } else {
    let searchCandidates = [];
    const wordCount = query.trim().split(/\s+/).length;

    // A. If the query is relatively short, try directly searching for it on TMDB
    if (query && wordCount <= 5) {
      try {
        const searchResult = await tmdbService.searchMovies(query);
        if (searchResult && searchResult.results && searchResult.results.length > 0) {
          searchCandidates = searchResult.results;
          // Also fetch recommendations for the top search result
          const topMovie = searchCandidates[0];
          const recommendations = await tmdbService.getMovieRecommendations(topMovie.id).catch(() => null);
          if (recommendations && recommendations.results) {
            searchCandidates = [...searchCandidates, ...recommendations.results];
          }
        }
      } catch (err) {
        console.error("Error doing movie query search:", err.message);
      }
    }

    // B. Fetch candidates by genres (if genres are specified or mapped)
    let genreCandidates = [];
    const genreIds = intent.genres
      .map(name => GENRE_MAP[name])
      .filter(id => id !== undefined);

    if (genreIds.length > 0) {
      console.log("Searching by genres:", intent.genres);
      const genreIdsString = genreIds.join(',');
      try {
        // Fetch pages 1 and 2 of discover results for a wider candidate selection
        const discoverResult1 = await tmdbService.discoverMoviesByGenres(genreIdsString, 1);
        const discoverResult2 = await tmdbService.discoverMoviesByGenres(genreIdsString, 2).catch(() => ({ results: [] }));
        genreCandidates = [...(discoverResult1.results || []), ...(discoverResult2.results || [])];
      } catch (err) {
        console.error("Error discovering movies by genres:", err.message);
      }
    }

    // C. Fetch trending movies as fallback and additional pool candidates
    let trendingCandidates = [];
    try {
      const trendingResult1 = await tmdbService.getTrendingMovies('day', 1);
      const trendingResult2 = await tmdbService.getTrendingMovies('day', 2).catch(() => ({ results: [] }));
      trendingCandidates = [...(trendingResult1.results || []), ...(trendingResult2.results || [])];
    } catch (err) {
      console.error("Error fetching trending movies:", err.message);
    }

    // Combine candidate pools
    rawCandidates = [...searchCandidates, ...genreCandidates, ...trendingCandidates];
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
    vote_average: movie.vote_average || 0,
    genre_ids: movie.genre_ids || (movie.genres ? movie.genres.map(g => g.id) : []),
    runtime: movie.runtime || null,
    popularity: movie.popularity || 0
  }));

  // Step 5: Return only the first 20 candidate movies
  const finalCandidates = cleanCandidates.slice(0, 20);
  console.log("Final Candidate Count:", finalCandidates.length);
  return finalCandidates;
};
