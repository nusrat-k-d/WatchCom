import { getGeminiClient } from './geminiClient.js';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_BEARER_TOKEN = process.env.TMDB_API_KEY || process.env.TMDB_BEARER_TOKEN;

const getTmdbHeaders = () => ({
  accept: 'application/json',
  Authorization: `Bearer ${TMDB_BEARER_TOKEN}`
});

/**
 * Searches TMDB for a single movie by title query
 */
async function searchTmdbMovie(query) {
  if (!query || !TMDB_BEARER_TOKEN) return null;
  try {
    const res = await fetch(`${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=false&page=1`, {
      headers: getTmdbHeaders()
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results[0];
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Fetches full details for a TMDB movie including runtime, genres, videos, director
 */
async function getTmdbMovieDetails(movieId) {
  if (!movieId || !TMDB_BEARER_TOKEN) return null;
  try {
    const [detailsRes, creditsRes] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/movie/${movieId}?append_to_response=videos,keywords`, { headers: getTmdbHeaders() }),
      fetch(`${TMDB_BASE_URL}/movie/${movieId}/credits`, { headers: getTmdbHeaders() })
    ]);

    if (!detailsRes.ok) return null;
    const details = await detailsRes.json();
    let director = null;
    if (creditsRes.ok) {
      const credits = await creditsRes.json();
      const dirObj = credits.crew?.find(c => c.job === 'Director');
      if (dirObj) director = dirObj.name;
    }

    return {
      id: String(details.id),
      title: details.title || 'Untitled',
      year: details.release_date ? parseInt(details.release_date.split('-')[0], 10) : 0,
      overview: details.overview || '',
      runtime: details.runtime ? `${details.runtime} min` : '110 min',
      runtimeMinutes: details.runtime || 110,
      rating: details.vote_average ? Number((details.vote_average / 2).toFixed(1)) : 4.0,
      posterUrl: details.poster_path 
        ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
        : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
      genres: details.genres ? details.genres.map(g => g.name) : [],
      director: director || 'Visionary Filmmaker'
    };
  } catch {
    return null;
  }
}

/**
 * Fetches TMDB recommendations for an anchor movie
 */
async function getTmdbRecommendations(movieId) {
  if (!movieId || !TMDB_BEARER_TOKEN) return [];
  try {
    const res = await fetch(`${TMDB_BASE_URL}/movie/${movieId}/recommendations?page=1`, {
      headers: getTmdbHeaders()
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch {
    return [];
  }
}

/**
 * Fallback curated marathons for popular genres/themes
 */
const SEED_MARATHONS = {
  noir: {
    title: "Shadows & Cigarette Smoke: The Neo-Noir Descent",
    prologue: "An escalation from rain-soaked moral ambiguity into fever-pitch psychological breakdown, linking methodical investigation with unraveling sanity.",
    films: [
      { title: "Zodiac", slotTitle: "Act I: The Obsessive Inquiry", whyThisSlot: "Lays down the meticulous, agonizing procedural groundwork where obsession replaces police procedure.", toneShift: "Clinical, grounded, and perpetually dread-inducing." },
      { title: "Se7en", slotTitle: "Act II: The Descent into Darkness", whyThisSlot: "Escalates from cold investigative obsession into visceral moral reckoning in a perpetual downpour.", toneShift: "Oppressive, shocking, and emotionally devastating." },
      { title: "Memento", slotTitle: "Act III: The Fractured Mind", whyThisSlot: "Deconstructs the very perception of memory and retribution, shattering the detective archetype.", toneShift: "Disorienting, thrilling, and mind-bending." }
    ],
    intermission: {
      theme: "The Cost of Knowing Too Much",
      prompt: "When does the pursuit of the truth cross the line into self-destruction?",
      snackVibe: "Double espresso, aged cheddar, and rain against the window"
    }
  },
  scifi: {
    title: "Cosmic Abyss & Digital Ghosts: Speculative Realities",
    prologue: "A sweeping voyage from celestial desolation to synthetic soul-searching, exploring what remains human at the edges of the universe.",
    films: [
      { title: "Arrival", slotTitle: "Act I: First Contact & Temporal Perception", whyThisSlot: "Opens with cerebral, deeply emotional linguistics and non-linear contemplation.", toneShift: "Melancholic, wonder-filled, and poetically pacing." },
      { title: "Blade Runner 2049", slotTitle: "Act II: The Neon Wasteland", whyThisSlot: "Expands the scope into breathtaking cybernetic existentialism and visual grandeur.", toneShift: "Hypnotic, bass-heavy, and grandiosely atmospheric." },
      { title: "Interstellar", slotTitle: "Act III: The Transcendent Leap", whyThisSlot: "Pushes beyond the stars into boundless emotion, relativity, and human triumph.", toneShift: "Epic, triumphant, and awe-inspiring." }
    ],
    intermission: {
      theme: "Memory, Time & Synthetic Love",
      prompt: "If time is non-linear, does pain matter as much as love?",
      snackVibe: "Black tea with honey, freeze-dried fruit, and synthwave synth pads"
    }
  },
  mindbend: {
    title: "Structural Hallucinations: The Cinema of Broken Realities",
    prologue: "A high-wire marathon through unreliable narrators, architectural dreams, and perception traps that test your grasp on reality.",
    films: [
      { title: "Shutter Island", slotTitle: "Act I: The Island Perimeter", whyThisSlot: "Establishes a Gothic, claustrophobic mystery shrouded in fog and psychological paranoia.", toneShift: "Suspenseful, haunting, and psychologically unmoored." },
      { title: "Inception", slotTitle: "Act II: The Dream Layer Heist", whyThisSlot: "Accelerates into adrenaline-fueled multi-layered gravity-defying architecture.", toneShift: "Kinetic, mathematically intricate, and exhilarating." },
      { title: "The Prestige", slotTitle: "Act III: The Final Pledge", whyThisSlot: "The ultimate climax of obsession and sacrifice where the viewer becomes the subject of the trick.", toneShift: "Obsessive, razor-sharp, and jaw-dropping." }
    ],
    intermission: {
      theme: "Trusting the Unreliable Mind",
      prompt: "Are you watching closely, or did you accept the illusion willingly?",
      snackVibe: "Popcorn with smoked paprika, dark roast coffee, and puzzle conversation"
    }
  }
};

/**
 * Builds an AI-powered Double or Triple Feature Marathon
 * @param {object} params
 * @param {string} [params.anchorQuery] - Name of a movie to anchor the marathon around
 * @param {string} [params.theme] - Theme or mood (e.g. "Cyberpunk", "A24 Folk Horror")
 * @param {"double"|"triple"} [params.mode="double"] - 2 or 3 films
 * @returns {Promise<object>}
 */
export async function architectMarathon({ anchorQuery = '', theme = '', mode = 'double' }) {
  const filmCount = mode === 'triple' ? 3 : 2;
  const ai = getGeminiClient();

  // 1. Resolve Anchor Movie if provided
  let anchorMovieData = null;
  if (anchorQuery && anchorQuery.trim().length > 0) {
    const tmdbAnchor = await searchTmdbMovie(anchorQuery);
    if (tmdbAnchor && tmdbAnchor.id) {
      anchorMovieData = await getTmdbMovieDetails(tmdbAnchor.id);
    }
  }

  // 2. Try Gemini 1.5 Flash structured synthesis
  if (ai) {
    try {
      const prompt = `You are the Master Film Programmer and Chief Curator at WatchCom.
Your mission is to construct the ultimate ${mode.toUpperCase()} FEATURE MOVIE MARATHON (${filmCount} films in sequential order).

INPUT SPECIFICATIONS:
- Anchor Movie: ${anchorMovieData ? `"${anchorMovieData.title}" (${anchorMovieData.year}) - Genres: ${anchorMovieData.genres.join(', ')} - Overview: ${anchorMovieData.overview}` : (anchorQuery || 'None specified')}
- Desired Theme/Mood: "${theme || 'Cinematic Masterpiece Pairing'}"
- Marathon Format: ${filmCount} films (${mode === 'double' ? 'Double Feature' : 'Triple Feature Marathon'})

RULES FOR CURATION:
1. The pairing must have intense thematic, tonal, stylistic, or director synergy.
2. ${anchorMovieData ? `The anchor movie "${anchorMovieData.title}" MUST be one of the films (usually Film 1 or Film 2 depending on best narrative pacing).` : 'Choose universally acclaimed, recognizable, top-tier movies that perfectly harmonize.'}
3. The viewing sequence must have a clear narrative momentum (e.g. Groundwork -> Escalation -> Climactic Explosion).
4. Provide a creative, marquee marathon title (e.g., "The Neon Paranoia Double Bill", "Dreams of the Cybernetic Soul").
5. Provide an insightful "curatorPrologue" explaining why watching these films back-to-back elevates both beyond a standalone viewing.
6. Provide "intermissionNotes" with a discussion question, thematic reflection, and ideal snack/beverage pairing.

Return STRICT JSON adhering to this exact schema:
{
  "marathonTitle": "Evocative Marquee Marathon Title",
  "curatorPrologue": "2-3 sentences of poetic, sophisticated film criticism explaining the connective tissue.",
  "intermission": {
    "theme": "Core overarching philosophical theme",
    "prompt": "Thought-provoking discussion question for the intermission break",
    "snackVibe": "Bespoke snack and drink pairing for the marathon vibe"
  },
  "films": [
    {
      "title": "Exact Movie Title",
      "year": 2015,
      "slotTitle": "Act I: Name of Phase (e.g. The Groundwork)",
      "whyThisSlot": "Why this film belongs in this exact chronological position in the marathon",
      "toneShift": "Short description of the sensory/tonal transition into or out of this film"
    }
  ]
}

Ensure the "films" array contains EXACTLY ${filmCount} items. Output ONLY valid JSON without markdown.`;

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text ? response.text.trim() : '';
      if (text) {
        const parsed = JSON.parse(text);
        if (parsed.films && Array.isArray(parsed.films) && parsed.films.length >= 2) {
          // Resolve TMDB details for each film suggested by AI
          const resolvedFilms = [];
          let totalMinutes = 0;

          for (let i = 0; i < Math.min(parsed.films.length, filmCount); i++) {
            const aiFilm = parsed.films[i];
            
            // Check if this is the anchor film already resolved
            let movieDetails = null;
            if (anchorMovieData && aiFilm.title.toLowerCase().includes(anchorMovieData.title.toLowerCase())) {
              movieDetails = anchorMovieData;
            } else {
              const tmdbResult = await searchTmdbMovie(aiFilm.title);
              if (tmdbResult && tmdbResult.id) {
                movieDetails = await getTmdbMovieDetails(tmdbResult.id);
              }
            }

            // Fallback if TMDB search was empty
            if (!movieDetails) {
              movieDetails = {
                id: `m-${i + 1}`,
                title: aiFilm.title,
                year: aiFilm.year || 2020,
                overview: 'A seminal cinematic masterpiece selected for its deep thematic resonance.',
                runtime: '120 min',
                runtimeMinutes: 120,
                rating: 4.5,
                posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
                genres: ['Cinema'],
                director: 'Celebrated Director'
              };
            }

            totalMinutes += movieDetails.runtimeMinutes || 115;

            resolvedFilms.push({
              ...movieDetails,
              slotNumber: i + 1,
              slotTitle: aiFilm.slotTitle || `Act ${i + 1}`,
              whyThisSlot: aiFilm.whyThisSlot || 'Essential piece of the marathon tapestry.',
              toneShift: aiFilm.toneShift || 'Smooth tonal progression.'
            });
          }

          const hours = Math.floor(totalMinutes / 60);
          const mins = totalMinutes % 60;
          const formattedRuntime = `${hours}h ${mins > 0 ? `${mins}m` : ''}`.trim();

          return {
            success: true,
            marathonTitle: parsed.marathonTitle || 'The Curated Cinematic Marathon',
            curatorPrologue: parsed.curatorPrologue || 'A bespoke sequencing of cinematic storytelling curated for deep immersion.',
            mode,
            filmCount: resolvedFilms.length,
            totalRuntime: formattedRuntime,
            totalRuntimeMinutes: totalMinutes,
            intermission: parsed.intermission || {
              theme: 'The Human Condition',
              prompt: 'How did the narrative trajectory shift between these stories?',
              snackVibe: 'Artisanal popcorn & craft soda'
            },
            films: resolvedFilms
          };
        }
      }
    } catch (err) {
      console.warn('[Marathon Architect] Gemini synthesis fallback triggered:', err.message);
    }
  }

  // 3. Robust Heuristic Engine Fallback
  return await generateHeuristicMarathon({ anchorMovieData, theme, mode, filmCount });
}

/**
 * Deterministic fallback builder when AI API is unavailable
 */
async function generateHeuristicMarathon({ anchorMovieData, theme = '', mode, filmCount }) {
  // Check seed presets
  let seedKey = 'scifi';
  const lowerTheme = (theme || (anchorMovieData?.genres?.[0] || '')).toLowerCase();
  if (lowerTheme.includes('noir') || lowerTheme.includes('crime') || lowerTheme.includes('thrill')) {
    seedKey = 'noir';
  } else if (lowerTheme.includes('mind') || lowerTheme.includes('dream') || lowerTheme.includes('psych')) {
    seedKey = 'mindbend';
  }

  const seed = SEED_MARATHONS[seedKey] || SEED_MARATHONS.scifi;

  let candidates = [];
  if (anchorMovieData) {
    const recs = await getTmdbRecommendations(anchorMovieData.id);
    candidates.push(anchorMovieData);
    for (const rec of recs.slice(0, 4)) {
      const details = await getTmdbMovieDetails(rec.id);
      if (details) candidates.push(details);
    }
  }

  // If we don't have enough candidates, fetch from seed or use seed mock metadata
  if (candidates.length < filmCount) {
    for (let i = 0; i < seed.films.length && candidates.length < filmCount; i++) {
      const seedFilm = seed.films[i];
      let details = null;
      try {
        const searchRes = await searchTmdbMovie(seedFilm.title);
        if (searchRes) {
          details = await getTmdbMovieDetails(searchRes.id);
        }
      } catch {
        details = null;
      }

      if (details && !candidates.some(c => c.id === details.id)) {
        candidates.push(details);
      } else if (!candidates.some(c => c.title === seedFilm.title)) {
        // Fallback movie details
        candidates.push({
          id: `seed-${i + 1}`,
          title: seedFilm.title,
          year: 2014 + i * 2,
          overview: seedFilm.whyThisSlot || 'A celebrated cinematic work selected for its thematic synergy.',
          runtime: '124 min',
          runtimeMinutes: 124,
          rating: 4.4,
          posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
          genres: ['Cinema', 'Drama'],
          director: 'Acclaimed Director'
        });
      }
    }
  }

  const selectedFilms = candidates.slice(0, filmCount).map((film, i) => {
    const seedMeta = seed.films[i] || {
      slotTitle: `Act ${i + 1}: The Progression`,
      whyThisSlot: `Complementary pacing and thematic evolution for Part ${i + 1}.`,
      toneShift: 'Builds upon the sensory foundation of the preceding film.'
    };

    return {
      ...film,
      slotNumber: i + 1,
      slotTitle: seedMeta.slotTitle,
      whyThisSlot: seedMeta.whyThisSlot,
      toneShift: seedMeta.toneShift
    };
  });

  let totalMinutes = selectedFilms.reduce((sum, f) => sum + (f.runtimeMinutes || 110), 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const formattedRuntime = `${hours}h ${mins > 0 ? `${mins}m` : ''}`.trim();

  return {
    success: true,
    marathonTitle: anchorMovieData ? `${anchorMovieData.title} & Companions: The Cinematic Pairing` : seed.title,
    curatorPrologue: seed.prologue,
    mode,
    filmCount: selectedFilms.length,
    totalRuntime: formattedRuntime,
    totalRuntimeMinutes: totalMinutes,
    intermission: seed.intermission,
    films: selectedFilms
  };
}
