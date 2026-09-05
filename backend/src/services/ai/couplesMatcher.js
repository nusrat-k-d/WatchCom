import { extractIntent } from './intentExtractor.js';
import { getCandidateMovies } from './candidateRetriever.js';
import { rankMovies } from './rankingEngine.js';
import { enrichRecommendations } from './explanationLayer.js';
import { getGeminiClient } from './geminiClient.js';

/**
 * Calculates dual-user recommendation intersection
 * @param {object} input 
 * @returns {Promise<object>}
 */
export const matchCouplesTastes = async ({ person1Query, person2Query, person1Name = "Person 1", person2Name = "Person 2" }) => {
  // 1. Extract intents for both
  const [intent1, intent2] = await Promise.all([
    extractIntent(person1Query || ''),
    extractIntent(person2Query || '')
  ]);

  // 2. Fetch candidates for both intents
  const [candidates1, candidates2] = await Promise.all([
    getCandidateMovies(intent1),
    getCandidateMovies(intent2)
  ]);

  // 3. Merge candidates with deduplication and overlap boosting
  const candidateMap = new Map();
  
  // Add candidates from Person 1
  candidates1.forEach(movie => {
    candidateMap.set(movie.id, {
      ...movie,
      p1Score: 1.0,
      p2Score: 0.0,
      bothMatch: false
    });
  });

  // Merge candidates from Person 2, flagging direct overlap
  candidates2.forEach(movie => {
    if (candidateMap.has(movie.id)) {
      const existing = candidateMap.get(movie.id);
      existing.p2Score = 1.0;
      existing.bothMatch = true;
    } else {
      candidateMap.set(movie.id, {
        ...movie,
        p1Score: 0.0,
        p2Score: 1.0,
        bothMatch: false
      });
    }
  });

  // Combined intent for ranking
  const mergedIntent = {
    originalQuery: `${person1Query} AND ${person2Query}`,
    referenceMovie: intent1.referenceMovie || intent2.referenceMovie,
    genres: Array.from(new Set([...(intent1.genres || []), ...(intent2.genres || [])])),
    mood: intent1.mood || intent2.mood,
    avoid: Array.from(new Set([...(intent1.avoid || []), ...(intent2.avoid || [])])),
    runtime: (intent1.runtime && intent2.runtime) ? Math.min(intent1.runtime, intent2.runtime) : (intent1.runtime || intent2.runtime || null),
    complexity: intent1.complexity || intent2.complexity
  };

  const allCandidates = Array.from(candidateMap.values());

  // Re-rank candidates based on combined intent
  const ranked = await rankMovies(allCandidates, mergedIntent);

  // Boost candidates that appeal to both tastes
  const couplesRanked = ranked.map(movie => {
    let boost = 0;
    if (movie.bothMatch) {
      boost += 25; // Big bonus for movies appearing in both candidate pools
    }

    // Genre overlap bonus
    const movieGenres = movie.genre_ids || [];
    const p1Genres = intent1.genres || [];
    const p2Genres = intent2.genres || [];
    
    const hasP1Genre = p1Genres.length === 0 || p1Genres.some(g => (movie.overview || '').toLowerCase().includes(g.toLowerCase()));
    const hasP2Genre = p2Genres.length === 0 || p2Genres.some(g => (movie.overview || '').toLowerCase().includes(g.toLowerCase()));
    
    if (hasP1Genre && hasP2Genre) {
      boost += 15;
    }

    return {
      ...movie,
      watchComScore: Math.min(100, (movie.watchComScore || 70) + boost)
    };
  }).sort((a, b) => (b.watchComScore || 0) - (a.watchComScore || 0));

  // Enrich with baseline recommendations (Top 18 movies)
  const enriched = await enrichRecommendations(couplesRanked.slice(0, 18), mergedIntent);

  // Generate dual-perspective justifications
  const enrichedWithCouplesReasons = await generateCouplesJustifications(
    enriched,
    intent1,
    intent2,
    person1Name,
    person2Name
  );

  return {
    person1: { name: person1Name, intent: intent1 },
    person2: { name: person2Name, intent: intent2 },
    recommendations: enrichedWithCouplesReasons
  };
};

/**
 * Generates custom dual-perspective justifications for each couple recommendation
 */
async function generateCouplesJustifications(movies, intent1, intent2, name1, name2) {
  const ai = getGeminiClient();

  if (ai && movies.length > 0) {
    try {
      const summaryList = movies.slice(0, 8).map(m => ({ id: m.id, title: m.title, overview: m.overview }));
      const prompt = `You are WatchCom's Couples Recommendation Engine.
We have two viewers with different tastes:
- ${name1}'s Taste: "${intent1.originalQuery || 'General film'}" (Mood: ${intent1.mood || 'Any'}, Genres: ${intent1.genres?.join(', ') || 'Any'})
- ${name2}'s Taste: "${intent2.originalQuery || 'General film'}" (Mood: ${intent2.mood || 'Any'}, Genres: ${intent2.genres?.join(', ') || 'Any'})

For each movie below, write a crisp 2-part justification showing why BOTH will enjoy it:
- For ${name1}: (1 sentence)
- For ${name2}: (1 sentence)

Movies:
${JSON.stringify(summaryList, null, 2)}

Return JSON array with "id", "forPerson1", and "forPerson2":
[
  {
    "id": 123,
    "forPerson1": "...",
    "forPerson2": "..."
  }
]
Output ONLY valid JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const parsed = JSON.parse(response.text.trim());
      const map = new Map();
      if (Array.isArray(parsed)) {
        parsed.forEach(p => map.set(p.id, p));
      }

      return movies.map(movie => {
        const custom = map.get(movie.id);
        if (custom) {
          return {
            ...movie,
            couplesBreakdown: {
              forPerson1: custom.forPerson1,
              forPerson2: custom.forPerson2
            }
          };
        }
        return {
          ...movie,
          couplesBreakdown: {
            forPerson1: `Satisfies ${name1}'s taste with engaging storytelling.`,
            forPerson2: `Satisfies ${name2}'s taste with great pacing and depth.`
          }
        };
      });
    } catch (e) {
      console.warn('[Couples Matcher] Gemini justification fallback:', e.message);
    }
  }

  // Fallback if LLM unavailable
  return movies.map(movie => ({
    ...movie,
    couplesBreakdown: {
      forPerson1: `Brings the ${intent1.genres?.[0] || 'thematic'} elements that ${name1} enjoys.`,
      forPerson2: `Brings the ${intent2.genres?.[0] || 'emotional'} depth that ${name2} is looking for.`
    }
  }));
}
