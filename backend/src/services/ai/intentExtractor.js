/**
 * Intent Extraction Service for WatchCom
 * Parses natural language user queries into structured search metadata.
 * 
 * ============================================================================
 * Example Inputs & Expected JSON Outputs
 * ============================================================================
 * 
 * 1. Input: "I want to watch a science fiction movie like Interstellar that is under 2 hours and not depressing"
 *    Output:
 *    {
 *      "referenceMovie": "Interstellar",
 *      "genres": ["Sci-Fi"],
 *      "mood": null,
 *      "runtime": 120,
 *      "avoid": ["depressing"],
 *      "complexity": null
 *    }
 * 
 * 2. Input: "Looking for a dark thriller under 90 minutes with complex plot"
 *    Output:
 *    {
 *      "referenceMovie": null,
 *      "genres": ["Thriller"],
 *      "mood": "dark",
 *      "runtime": 90,
 *      "avoid": [],
 *      "complexity": "complex"
 *    }
 * 
 * 3. Input: "Something funny and light without jump scares"
 *    Output:
 *    {
 *      "referenceMovie": null,
 *      "genres": ["Comedy"],
 *      "mood": "funny",
 *      "runtime": null,
 *      "avoid": ["jump scares"],
 *      "complexity": "light"
 *    }
 * 
 * 4. Input: "a romantic comedy similar to Notting Hill"
 *    Output:
 *    {
 *      "referenceMovie": "Notting Hill",
 *      "genres": ["Romance", "Comedy"],
 *      "mood": "romantic",
 *      "runtime": null,
 *      "avoid": [],
 *      "complexity": null
 *    }
 * ============================================================================
 */

/**
 * Normalizes input query for parsing (lowercasing, cleaning extra whitespace).
 * Keeps original query intact for parts where casing matters (like movie names).
 * @param {string} query 
 * @returns {string} Normalized query
 */
const normalizeQuery = (query) => {
  return query ? query.trim() : '';
};

/**
 * Extracts a movie mentioned as a reference (e.g. "like Interstellar").
 * Preserves the original casing of the movie title.
 * @param {string} query 
 * @returns {string|null}
 */
const extractReferenceMovie = (query) => {
  if (!query) return null;

  // First, handle the autocomplete suggestion template: "Tell me more about [Movie] and movies like it"
  const templateMatch = query.match(/Tell me more about\s+([^,.;!?]+?)\s+and movies like it/i);
  if (templateMatch) {
    return templateMatch[1].trim();
  }

  // Look for patterns: "like [movie]", "similar to [movie]", "reminiscent of [movie]"
  const regex = /\b(?:like|similar to|reminiscent of|resembles|analogous to)\s+([^,.;!?]+)/i;
  const match = query.match(regex);
  if (!match) return null;

  let movieName = match[1].trim();

  // Ignore pronoun matches like "it", "this", "that", "them", "movie", "film"
  if (/^(it|this|that|them|movie|film|something)$/i.test(movieName)) {
    // Attempt to extract reference movie from before "and movies like it/this"
    const beforeAnd = query.split(/\band\b/i)[0];
    const aboutMatch = beforeAnd.match(/\b(?:about|for|of)\s+([^,.;!?]+)/i);
    if (aboutMatch) {
      return aboutMatch[1].trim();
    }
    return null;
  }

  // Strip out trailing phrases/modifiers that might be captured (e.g., "under 2 hours", "not depressing")
  // We split by common transition keywords
  const parts = movieName.split(/\b(?:under|less than|no|without|not|avoid|with|that is|which is|and|but)\b/i);
  movieName = parts[0].trim();

  return movieName || null;
};

/**
 * Extracts the maximum runtime constraint in minutes.
 * Supports patterns like "under 2 hours", "90 minutes", "less than 1.5h".
 * @param {string} query 
 * @returns {number|null} Max runtime in minutes
 */
const extractRuntime = (query) => {
  if (!query) return null;
  const lowercaseQuery = query.toLowerCase();

  // Pattern: "under 2 hours", "less than 1.5 hours"
  const hourRegex = /(?:under|less than|below|max|maximum of|within)\s+(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)\b/i;
  const hourMatch = lowercaseQuery.match(hourRegex);
  if (hourMatch) {
    const hours = parseFloat(hourMatch[1]);
    return Math.round(hours * 60);
  }

  // Pattern: "under 90 minutes", "less than 120 mins"
  const minRegex = /(?:under|less than|below|max|maximum of|within)\s+(\d+)\s*(?:minutes|mins|min|m)\b/i;
  const minMatch = lowercaseQuery.match(minRegex);
  if (minMatch) {
    return parseInt(minMatch[1], 10);
  }

  // Pattern: "90 minutes", "120 min" (no prefix)
  const simpleMinRegex = /\b(\d+)\s*(?:minutes|mins|min)\b/i;
  const simpleMinMatch = lowercaseQuery.match(simpleMinRegex);
  if (simpleMinMatch) {
    return parseInt(simpleMinMatch[1], 10);
  }

  return null;
};

/**
 * Extracts genres from the query.
 * Valid genres: Comedy, Drama, Sci-Fi, Action, Horror, Thriller, Romance, Animation, Fantasy, Crime, Mystery.
 * Avoids matching genres inside negative conditions (e.g. "no horror").
 * @param {string} query 
 * @returns {string[]} List of matched genres
 */
const extractGenres = (query) => {
  if (!query) return [];
  const lowercaseQuery = query.toLowerCase();

  // Strip out avoid clauses so we don't extract genre keywords from them (e.g. "no horror")
  const avoidClausesRegex = /\b(?:no|without|not|avoid|except)\s+[a-zA-Z0-9\s-]+(?:\b|$)/gi;
  const cleanedQuery = lowercaseQuery.replace(avoidClausesRegex, '');

  const genreKeywords = {
    'Comedy': ['comedy', 'comedies', 'funny', 'hilarious', 'humorous', 'laugh'],
    'Drama': ['drama', 'dramas', 'dramatic', 'sad'],
    'Sci-Fi': ['sci-fi', 'scifi', 'science fiction', 'space', 'futuristic'],
    'Action': ['action', 'explosive'],
    'Adventure': ['adventure', 'adventures', 'quest', 'journey', 'expedition', 'explore'],
    'Horror': ['horror', 'scary', 'spooky', 'creepy'],
    'Thriller': ['thriller', 'thrillers', 'suspenseful', 'suspense'],
    'Romance': ['romance', 'romantic', 'love story', 'lovey-dovey'],
    'Animation': ['animation', 'animated', 'cartoon', 'cartoons', 'anime'],
    'Fantasy': ['fantasy', 'magic', 'magical', 'myth', 'mythical', 'fairy tale'],
    'Crime': ['crime', 'gangster', 'detective', 'police', 'heist'],
    'Mystery': ['mystery', 'mysteries', 'mysterious', 'whodunit'],
    'Family': ['family', 'kids', 'children', 'parent', 'parents', 'childhood', 'wholesome'],
    'Documentary': ['documentary', 'documentaries', 'biography', 'real life', 'true story'],
    'History': ['history', 'historical', 'period piece', 'biographical', 'past'],
    'War': ['war', 'combat', 'military', 'soldier', 'battle'],
    'Western': ['western', 'cowboy', 'saloon', 'west']
  };

  const detectedGenres = [];

  for (const [genre, keywords] of Object.entries(genreKeywords)) {
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(cleanedQuery)) {
        detectedGenres.push(genre);
        break; // Stop checking keywords for this genre once found
      }
    }
  }

  // Concept mapping for moods/keywords to relevant genres if no genres were directly matched
  if (detectedGenres.length === 0) {
    if (/\b(?:mind-bending|mind-blowing|cerebral|trippy|twist)\b/i.test(cleanedQuery)) {
      detectedGenres.push('Sci-Fi', 'Mystery', 'Thriller');
    } else if (/\b(?:emotional|tear-jerker|moving|sad|depressing|heartbreaking)\b/i.test(cleanedQuery)) {
      detectedGenres.push('Drama');
    } else if (/\b(?:date night|romantic|romance|love)\b/i.test(cleanedQuery)) {
      detectedGenres.push('Romance', 'Comedy');
    } else if (/\b(?:rainy day|cozy|warm|quiet|relaxing)\b/i.test(cleanedQuery)) {
      detectedGenres.push('Drama', 'Comedy');
    } else if (/\b(?:oscar|award|masterpiece|acclaimed)\b/i.test(cleanedQuery)) {
      detectedGenres.push('Drama');
    } else if (/\b(?:hidden gem|underrated)\b/i.test(cleanedQuery)) {
      detectedGenres.push('Drama', 'Thriller', 'Mystery');
    } else if (/\b(?:feel good|uplifting|lighthearted|hilarious)\b/i.test(cleanedQuery)) {
      detectedGenres.push('Comedy', 'Family');
    } else if (/\b(?:psychological|tense|gripping|suspense)\b/i.test(cleanedQuery)) {
      detectedGenres.push('Thriller', 'Mystery');
    } else if (/\b(?:classic|timeless|legendary)\b/i.test(cleanedQuery)) {
      detectedGenres.push('Drama');
    }
  }

  return [...new Set(detectedGenres)];
};

/**
 * Extracts mood from the query.
 * Valid moods: funny, emotional, comforting, dark, inspiring, mind-blowing, romantic, suspenseful.
 * Avoids matching moods inside negative conditions (e.g. "not depressing").
 * @param {string} query 
 * @returns {string|null} Matched mood
 */
const extractMood = (query) => {
  if (!query) return null;
  const lowercaseQuery = query.toLowerCase();

  // Strip out avoid clauses to prevent extracting moods from negative context
  const avoidClausesRegex = /\b(?:no|without|not|avoid|except)\s+[a-zA-Z0-9\s-]+(?:\b|$)/gi;
  const cleanedQuery = lowercaseQuery.replace(avoidClausesRegex, '');

  const moodKeywords = {
    'funny': ['funny', 'hilarious', 'humorous', 'laugh'],
    'emotional': ['emotional', 'sad', 'tear-jerker', 'moving', 'touching', 'depressing', 'melancholy'],
    'comforting': ['comforting', 'cozy', 'feel-good', 'warm', 'comfort', 'relaxing'],
    'dark': ['dark', 'gritty', 'gloomy', 'bleak', 'sinister'],
    'inspiring': ['inspiring', 'uplifting', 'motivational', 'inspire'],
    'mind-blowing': ['mind-blowing', 'mind-bending', 'cerebral', 'trippy', 'intellectual', 'thought-provoking'],
    'romantic': ['romantic', 'romance', 'love'],
    'suspenseful': ['suspenseful', 'suspense', 'tense', 'gripping', 'thrilling']
  };

  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(cleanedQuery)) {
        return mood;
      }
    }
  }

  return null;
};

/**
 * Extracts avoidance constraints (e.g. "no horror", "without jump scares").
 * @param {string} query 
 * @returns {string[]} List of items to avoid
 */
const extractAvoid = (query) => {
  if (!query) return [];
  const lowercaseQuery = query.toLowerCase();

  const avoidList = [];
  // Regex to extract clauses starting with negative words
  const regex = /\b(?:no|without|not|avoid|except)\s+([a-zA-Z0-9\s-]+)(?:\b|$)/gi;
  let match;

  while ((match = regex.exec(lowercaseQuery)) !== null) {
    const rawMatch = match[1].trim();
    // Split by commas, "and", "or" to handle lists: "no horror, gore or jump scares"
    const subItems = rawMatch.split(/\b(?:and|or)\b|,/gi);
    for (const subItem of subItems) {
      const cleanedItem = subItem.trim();
      if (cleanedItem) {
        avoidList.push(cleanedItem);
      }
    }
  }

  return avoidList;
};

/**
 * Extracts complexity.
 * Valid complexities: easy, light, deep, complex, thought-provoking.
 * @param {string} query 
 * @returns {string|null} Matched complexity
 */
const extractComplexity = (query) => {
  if (!query) return null;
  const lowercaseQuery = query.toLowerCase();

  const complexityKeywords = {
    'easy': ['easy', 'brainless', 'casual', 'simple', 'straightforward'],
    'light': ['light', 'lighthearted', 'fun', 'relaxing'],
    'deep': ['deep', 'philosophical', 'profound', 'heavy'],
    'complex': ['complex', 'intricate', 'convoluted', 'multi-layered'],
    'thought-provoking': ['thought-provoking', 'cerebral', 'stimulating', 'reflective', 'intellectual']
  };

  for (const [complexity, keywords] of Object.entries(complexityKeywords)) {
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(lowercaseQuery)) {
        return complexity;
      }
    }
  }

  return null;
};

/**
 * Extracts structured movie request parameters from natural language query.
 * @param {string} query - Natural language user request
 * @returns {object} Structured intent representation
 */
export const extractIntent = (query) => {
  const normalized = normalizeQuery(query);
  
  if (!normalized) {
    return {
      originalQuery: '',
      referenceMovie: null,
      genres: [],
      mood: null,
      runtime: null,
      avoid: [],
      complexity: null
    };
  }

  return {
    originalQuery: normalized,
    referenceMovie: extractReferenceMovie(normalized),
    genres: extractGenres(normalized),
    mood: extractMood(normalized),
    runtime: extractRuntime(normalized),
    avoid: extractAvoid(normalized),
    complexity: extractComplexity(normalized)
  };
};
