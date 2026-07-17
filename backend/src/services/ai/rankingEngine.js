import * as tmdbService from '../tmdb/tmdbService.js';

const POPULARITY_THRESHOLD = 15;

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
 * Scores a single movie candidate based on user intent and predefined rules.
 * 
 * @param {object} movie - The candidate movie object
 * @param {object} intent - User intent containing referenceMovie, runtime, etc.
 * @param {number[]} refMovieGenreIds - Genre IDs of the reference movie, if available
 * @returns {number} The calculated watchComScore
 */
const calculateScore = (movie, intent, refMovieGenreIds) => {
  let score = 0;
  const overview = (movie.overview || '').toLowerCase();
  const title = (movie.title || '').toLowerCase();

  // Rule 1: Reference movie exists and genres overlap (+40 points)
  if (intent && intent.referenceMovie && refMovieGenreIds && refMovieGenreIds.length > 0) {
    const candidateGenreIds = movie.genre_ids || [];
    const hasGenreOverlap = candidateGenreIds.some(id => refMovieGenreIds.includes(id));
    if (hasGenreOverlap) {
      score += 40;
    }
  }

  // Rule 2: Genres overlap with user's requested genres (+25 points per matching genre)
  if (intent && intent.genres && intent.genres.length > 0) {
    const candidateGenreIds = movie.genre_ids || [];
    const targetGenreIds = intent.genres
      .map(name => GENRE_MAP[name])
      .filter(id => id !== undefined);

    let matchingGenresCount = 0;
    for (const id of targetGenreIds) {
      if (candidateGenreIds.includes(id)) {
        matchingGenresCount++;
      }
    }
    score += matchingGenresCount * 25;
  }

  // Rule 3: Runtime is within the user's requested runtime (+20 points)
  if (intent && intent.runtime !== undefined && intent.runtime !== null) {
    if (movie.runtime && movie.runtime <= intent.runtime) {
      score += 20;
    }
  }

  // Rule 4: Match mood based on keywords in overview/title (+35 points max)
  if (intent && intent.mood) {
    const moodKeywords = {
      'funny': ['funny', 'hilarious', 'humorous', 'laugh', 'comedy', 'joke', 'witty', 'lighthearted'],
      'emotional': ['emotional', 'sad', 'tear-jerker', 'moving', 'touching', 'depressing', 'melancholy', 'heartbreaking', 'cried', 'cry', 'grief', 'tragedy'],
      'comforting': ['comforting', 'cozy', 'feel-good', 'warm', 'comfort', 'relaxing', 'heartwarming', 'charming', 'gentle', 'sweet'],
      'dark': ['dark', 'gritty', 'gloomy', 'bleak', 'sinister', 'murder', 'death', 'killer', 'crime', 'shadow', 'gloom', 'fear', 'creepy'],
      'inspiring': ['inspiring', 'uplifting', 'motivational', 'inspire', 'dream', 'courage', 'triumph', 'struggle', 'achieve'],
      'mind-blowing': ['mind-blowing', 'mind-bending', 'cerebral', 'trippy', 'intellectual', 'thought-provoking', 'twist', 'puzzle', 'mystery', 'complex', 'reality', 'dimension', 'time', 'space', 'psychological'],
      'romantic': ['romantic', 'romance', 'love', 'relationship', 'marry', 'boyfriend', 'girlfriend', 'fall in love'],
      'suspenseful': ['suspenseful', 'suspense', 'tense', 'gripping', 'thrilling', 'chase', 'danger', 'escape', 'survival']
    };

    const keywords = moodKeywords[intent.mood] || [];
    let moodMatch = false;
    for (const kw of keywords) {
      if (overview.includes(kw) || title.includes(kw)) {
        moodMatch = true;
        score += 15;
      }
    }
    if (moodMatch) {
      score += 20; // Bonus for matching the mood
    }
  }

  // Rule 5: Match complexity based on keywords in overview/title (+30 points max)
  if (intent && intent.complexity) {
    const complexityKeywords = {
      'easy': ['easy', 'brainless', 'casual', 'simple', 'straightforward', 'fun', 'light'],
      'light': ['light', 'lighthearted', 'fun', 'relaxing', 'breeze', 'simple'],
      'deep': ['deep', 'philosophical', 'profound', 'heavy', 'meaningful', 'existential'],
      'complex': ['complex', 'intricate', 'convoluted', 'multi-layered', 'puzzle', 'twist', 'mystery'],
      'thought-provoking': ['thought-provoking', 'cerebral', 'stimulating', 'reflective', 'intellectual', 'existential', 'philosophical']
    };

    const keywords = complexityKeywords[intent.complexity] || [];
    let complexityMatch = false;
    for (const kw of keywords) {
      if (overview.includes(kw) || title.includes(kw)) {
        complexityMatch = true;
        score += 15;
      }
    }
    if (complexityMatch) {
      score += 15; // Bonus for matching the complexity
    }
  }

  // Rule 6: Avoid list filtering (heavily penalize matching avoid items: -100 points)
  if (intent && intent.avoid && intent.avoid.length > 0) {
    for (const avoidWord of intent.avoid) {
      if (avoidWord && (overview.includes(avoidWord.toLowerCase()) || title.includes(avoidWord.toLowerCase()))) {
        score -= 100;
      }
    }
  }

  // Rule 7: vote_average >= 7 (+20 points)
  if (movie.vote_average !== undefined && movie.vote_average >= 7) {
    score += 20;
  }

  // Rule 8: Popularity is reasonably high (+10 points)
  if (movie.popularity !== undefined && movie.popularity >= POPULARITY_THRESHOLD) {
    score += 10;
  }

  // Rule 9: Release year is newer than 2000 (+10 points)
  // (unless classic cinema is requested, then reward older movies)
  if (movie.release_date) {
    const releaseYear = parseInt(movie.release_date.split('-')[0], 10);
    if (!isNaN(releaseYear)) {
      const isClassicRequested = intent && (
        (intent.originalQuery && intent.originalQuery.toLowerCase().includes('classic')) ||
        (intent.mood && intent.mood === 'classic')
      );
      if (isClassicRequested) {
        if (releaseYear < 1995) {
          score += 25;
        }
      } else {
        if (releaseYear > 2000) {
          score += 10;
        }
      }
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
