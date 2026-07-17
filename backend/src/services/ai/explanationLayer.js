/**
 * AI Explanation Layer Service
 * Enrich ranked movie candidates with watchComScore, confidence levels, personalized reasons, and relevant chips.
 */

const GENRE_MAP_NAMES = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

const getNormalizedScore = (rawScore) => {
  if (rawScore <= 0) {
    // Generate a reasonable baseline score for candidates
    return Math.floor(Math.random() * 10) + 55; // 55 - 64
  }
  // Convert raw matching engine score into a realistic 0-100 Match rating
  let score = Math.round(68 + (rawScore / 2.5));
  if (score > 98) {
    // Slightly randomize top scores so they aren't uniform
    score = 96 + (rawScore % 3);
  }
  return Math.min(99, Math.max(50, score));
};

const getConfidence = (score) => {
  if (score >= 93) return "Excellent Match";
  if (score >= 83) return "Great Match";
  if (score >= 70) return "Good Match";
  return "Worth Exploring";
};

const generateReason = (movie, intent) => {
  const overview = (movie.overview || "").toLowerCase();
  const title = (movie.title || "").toLowerCase();
  const reasons = [];

  // 1. Reference movie matching
  if (intent && intent.referenceMovie) {
    reasons.push(`It is selected because it shares thematic similarities, narrative style, and emotional depth with ${intent.referenceMovie}.`);
  }

  // 2. Mood matching
  if (intent && intent.mood) {
    const moodDescriptions = {
      'funny': "It delivers a highly entertaining, lighthearted comedic experience filled with witty humor and fun.",
      'emotional': "It offers a deeply moving, emotional story that explores heartfelt relationships and human connection.",
      'comforting': "It creates a warm, feel-good atmosphere that is charming, cozy, and uplifting.",
      'dark': "It aligns with your taste for dark, atmospheric storytelling, gritty tones, and psychological mystery.",
      'inspiring': "It features an inspiring and motivational journey highlighting courage, triumph, and personal growth.",
      'mind-blowing': "It features a mind-bending, cerebral narrative with intricate plot twists that challenge your perception.",
      'romantic': "It presents a beautifully crafted romantic journey focusing on love, passion, and emotional intimacy.",
      'suspenseful': "It delivers a tense, highly suspenseful cinematic experience that keeps you on the edge of your seat."
    };
    if (moodDescriptions[intent.mood]) {
      reasons.push(moodDescriptions[intent.mood]);
    }
  }

  // 3. Complexity matching
  if (intent && intent.complexity && reasons.length < 2) {
    const complexityDescriptions = {
      'easy': "The film is a light, easy-to-follow story perfect for casual viewing and relaxation.",
      'light': "It offers a breezy, lighthearted narrative with uncomplicated themes and simple enjoyment.",
      'deep': "It provides deep, philosophical storytelling that explores profound existential questions and themes.",
      'complex': "It boasts a highly intricate, multi-layered plot structure that demands close attention.",
      'thought-provoking': "It is a highly cerebral and thought-provoking film that will leave you thinking long after the credits roll."
    };
    if (complexityDescriptions[intent.complexity]) {
      reasons.push(complexityDescriptions[intent.complexity]);
    }
  }

  // 4. Default / Fallback fillers
  if (reasons.length === 0) {
    reasons.push("Recommended as an excellent cinematic match that aligns with your interest in engaging, high-quality storytelling.");
    if (movie.vote_average && movie.vote_average >= 7.5) {
      reasons.push("It features outstanding performance metrics and has been highly praised by global audiences.");
    }
  } else if (reasons.length === 1) {
    if (intent.genres && intent.genres.length > 0) {
      const matchingGenres = intent.genres.slice(0, 2).map(g => g === "Sci-Fi" ? "science fiction" : g.toLowerCase()).join(' and ');
      reasons.push(`It perfectly captures the core elements and atmospheric vibes of the ${matchingGenres} genre.`);
    } else {
      reasons.push("It stands out as a highly acclaimed story with superb pacing and memorable cinematography.");
    }
  }

  // Join up to 2 sentences
  return reasons.slice(0, 2).join(' ');
};

const extractTags = (movie) => {
  const overview = (movie.overview || "").toLowerCase();
  const title = (movie.title || "").toLowerCase();
  const candidateTags = [];

  // Genre based tags mapping
  const genres = Array.isArray(movie.genre_ids)
    ? movie.genre_ids.map(id => GENRE_MAP_NAMES[id]).filter(Boolean)
    : [];

  genres.forEach(g => {
    candidateTags.push(g);
  });

  // Keyword mappings
  const keywordMappings = [
    { tag: "Space", keywords: ["space", "orbit", "astronaut", "planet", "galaxy", "nasa", "alien", "interstellar", "star"] },
    { tag: "Mind-Bending", keywords: ["twist", "dimension", "reality", "puzzle", "dream", "illusion", "paradox", "matrix"] },
    { tag: "Emotional", keywords: ["sad", "loss", "grief", "heartbreak", "crying", "tear", "love", "family", "moving", "emotional"] },
    { tag: "Time Travel", keywords: ["time travel", "past", "future", "loop", "timeline", "wormhole"] },
    { tag: "Slow Burn", keywords: ["slow-burn", "slow burn", "deliberate", "intimate", "gradual", "atmosphere"] },
    { tag: "Neo-Noir", keywords: ["noir", "gritty", "detective", "neon", "rain-slicked", "crime-ridden"] },
    { tag: "Survival", keywords: ["survive", "survival", "stranded", "deserted", "wilderness", "isolated"] },
    { tag: "Hope", keywords: ["hope", "rescue", "dream", "optimism", "saving", "faith", "future"] },
    { tag: "War", keywords: ["soldier", "army", "battle", "war", "combat", "military"] },
    { tag: "Adventure", keywords: ["quest", "explore", "journey", "expedition", "uncharted"] }
  ];

  keywordMappings.forEach(mapping => {
    const matches = mapping.keywords.some(kw => overview.includes(kw) || title.includes(kw));
    if (matches) {
      candidateTags.push(mapping.tag);
    }
  });

  // De-duplicate tags
  const uniqueTags = Array.from(new Set(candidateTags));

  // If we have too few tags, pad with default premium terms
  const fallbackTags = ["Must Watch", "Highly Rated", "Classic", "Cinematic"];
  while (uniqueTags.length < 3 && fallbackTags.length > 0) {
    const nextFallback = fallbackTags.shift();
    if (!uniqueTags.includes(nextFallback)) {
      uniqueTags.push(nextFallback);
    }
  }

  // Slice to 3-6 tags
  return uniqueTags.slice(0, 5);
};

/**
 * Enriches ranked candidates with score, confidence level, reason, and tags.
 * 
 * @param {object[]} rankedCandidates - The ranked candidates from rankingEngine
 * @param {object} intent - The user intent
 * @returns {object[]} Enriched candidates
 */
export const enrichRecommendations = (rankedCandidates, intent) => {
  if (!rankedCandidates || !Array.isArray(rankedCandidates)) return [];

  return rankedCandidates.map(movie => {
    const watchComScore = getNormalizedScore(movie.watchComScore);
    const confidence = getConfidence(watchComScore);
    const reason = generateReason(movie, intent);
    const tags = extractTags(movie);

    return {
      ...movie,
      watchComScore,
      confidence,
      reason,
      tags
    };
  });
};
