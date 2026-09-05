import { GoogleGenAI } from '@google/genai';

let aiClient = null;

export const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null;
  }

  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }

  return aiClient;
};

/**
 * Extracts structured intent using Gemini 1.5 Flash
 * @param {string} query 
 * @returns {Promise<object|null>}
 */
export const extractIntentWithGemini = async (query) => {
  const ai = getGeminiClient();
  if (!ai) return null;

  const prompt = `You are the AI brain of WatchCom, an intelligent movie recommendation engine.
Analyze the user's natural language movie search query and extract structured JSON metadata.

User query: "${query}"

Return a STRICT JSON object with this exact shape:
{
  "referenceMovie": "Movie Title string if they mentioned wanting something like a specific movie, otherwise null",
  "genres": ["Array of standard genres like Sci-Fi, Thriller, Drama, Action, Comedy, Romance, Horror, Mystery, Crime, Adventure, Fantasy, Animation, History, War, Documentary, Western"],
  "mood": "Single mood descriptor like funny, dark, emotional, suspenseful, mind-blowing, comforting, inspiring, romantic, or null",
  "runtime": "Max runtime in minutes as an integer if specified (e.g. 90, 120), otherwise null",
  "avoid": ["Array of elements/tropes the user wants to avoid, e.g. 'depressing', 'gore', 'jump scares']",
  "complexity": "Complexity level like 'light', 'easy', 'deep', 'complex', 'thought-provoking', or null",
  "microThemes": ["2-4 specific thematic tags or plot concepts, e.g. 'time loop', 'courtroom drama', 'heist', 'space exploration'"]
}

Output only valid JSON without markdown fences.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text ? response.text.trim() : '';
    if (!text) return null;

    const parsed = JSON.parse(text);
    return {
      originalQuery: query,
      referenceMovie: parsed.referenceMovie || null,
      genres: Array.isArray(parsed.genres) ? parsed.genres : [],
      mood: parsed.mood || null,
      runtime: typeof parsed.runtime === 'number' ? parsed.runtime : null,
      avoid: Array.isArray(parsed.avoid) ? parsed.avoid : [],
      complexity: parsed.complexity || null,
      microThemes: Array.isArray(parsed.microThemes) ? parsed.microThemes : []
    };
  } catch (error) {
    console.warn('[Gemini AI] Intent extraction error or fallback triggered:', error.message);
    return null;
  }
};

/**
 * Generates dynamic, contextual explanations for why movies match the user's request.
 * @param {object[]} topMovies 
 * @param {object} intent 
 * @returns {Promise<Map<number, string>|null>}
 */
export const generateDynamicExplanations = async (topMovies, intent) => {
  const ai = getGeminiClient();
  if (!ai || !topMovies || topMovies.length === 0) return null;

  const moviesSummary = topMovies.slice(0, 5).map(m => ({
    id: m.id,
    title: m.title,
    year: m.release_date ? m.release_date.split('-')[0] : '',
    overview: m.overview
  }));

  const prompt = `You are WatchCom's AI Recommendation Explainer.
Given the user's request intent and a list of recommended movies, write a personalized, compelling, 1-2 sentence justification for EACH movie explaining specifically WHY it fits their request and how it satisfies their taste.

User Request Intent:
- Query: "${intent.originalQuery || ''}"
- Reference Movie: ${intent.referenceMovie || 'None'}
- Mood / Vibe: ${intent.mood || 'None'}
- Avoid: ${intent.avoid?.join(', ') || 'None'}

Movies to explain:
${JSON.stringify(moviesSummary, null, 2)}

Return a JSON array of objects with "id" and "reason":
[
  {
    "id": 12345,
    "reason": "1-2 sharp, engaging sentences explaining the connection to their prompt."
  }
]

Output ONLY valid JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text ? response.text.trim() : '';
    if (!text) return null;

    const parsed = JSON.parse(text);
    const explanationMap = new Map();
    if (Array.isArray(parsed)) {
      parsed.forEach(item => {
        if (item.id && item.reason) {
          explanationMap.set(item.id, item.reason);
        }
      });
    }
    return explanationMap;
  } catch (error) {
    console.warn('[Gemini AI] Dynamic explanation error:', error.message);
    return null;
  }
};
