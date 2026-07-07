const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Helper function to perform fetch requests to TMDb API
 * @param {string} endpoint - The target endpoint path (e.g. '/search/movie')
 * @param {object} params - Key-value search parameters to append to query string
 * @returns {Promise<object>} Parsed JSON response
 */
const fetchFromTMDB = async (endpoint, params = {}) => {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey || apiKey === 'your_tmdb_api_key_here') {
    const error = new Error('TMDb API key is not configured. Please add a valid TMDB_API_KEY to your .env file.');
    error.status = 401;
    throw error;
  }

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', apiKey);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  }

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const status = response.status;
      const message = errorData.status_message || response.statusText || 'Error fetching from TMDb';
      const error = new Error(message);
      error.status = status;
      throw error;
    }

    return await response.json();
  } catch (error) {
    if (error.status) throw error;
    const err = new Error(error.message || 'Error communicating with TMDb API');
    err.status = 502; // Bad Gateway
    throw err;
  }
};

/**
 * Search movies by title
 */
export const searchMovies = async (query, page = 1) => {
  if (!query || query.trim() === '') {
    const error = new Error('Search query is required');
    error.status = 400;
    throw error;
  }
  return fetchFromTMDB('/search/movie', { query, page });
};

/**
 * Get trending movies (defaults to daily trending)
 */
export const getTrendingMovies = async (timeWindow = 'day', page = 1) => {
  const window = timeWindow === 'week' ? 'week' : 'day';
  return fetchFromTMDB(`/trending/movie/${window}`, { page });
};

/**
 * Get details for a specific movie by TMDb ID
 */
export const getMovieDetails = async (movieId) => {
  if (!movieId) {
    const error = new Error('Movie ID is required');
    error.status = 400;
    throw error;
  }
  return fetchFromTMDB(`/movie/${movieId}`);
};

/**
 * Get movie credits (cast & crew)
 */
export const getMovieCredits = async (movieId) => {
  if (!movieId) {
    const error = new Error('Movie ID is required');
    error.status = 400;
    throw error;
  }
  return fetchFromTMDB(`/movie/${movieId}/credits`);
};

/**
 * Get similar movies
 */
export const getSimilarMovies = async (movieId, page = 1) => {
  if (!movieId) {
    const error = new Error('Movie ID is required');
    error.status = 400;
    throw error;
  }
  return fetchFromTMDB(`/movie/${movieId}/similar`, { page });
};

/**
 * Get movie recommendations (TMDb algorithm only)
 */
export const getMovieRecommendations = async (movieId, page = 1) => {
  if (!movieId) {
    const error = new Error('Movie ID is required');
    error.status = 400;
    throw error;
  }
  return fetchFromTMDB(`/movie/${movieId}/recommendations`, { page });
};

/**
 * Get movie images
 */
export const getMovieImages = async (movieId) => {
  if (!movieId) {
    const error = new Error('Movie ID is required');
    error.status = 400;
    throw error;
  }
  return fetchFromTMDB(`/movie/${movieId}/images`);
};

/**
 * Get list of official genres
 */
export const getGenres = async (language = 'en-US') => {
  return fetchFromTMDB('/genre/movie/list', { language });
};

/**
 * Discover movies by genres
 */
export const discoverMoviesByGenres = async (genreIds, page = 1) => {
  return fetchFromTMDB('/discover/movie', { with_genres: genreIds, page });
};
