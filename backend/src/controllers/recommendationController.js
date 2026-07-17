import { extractIntent } from "../services/ai/intentExtractor.js";
import { refineIntent } from "../services/ai/refinementLayer.js";
import { getCandidateMovies } from "../services/ai/candidateRetriever.js";
import { rankMovies } from "../services/ai/rankingEngine.js";
import { enrichRecommendations } from "../services/ai/explanationLayer.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const recommendMovies = asyncHandler(async (req, res) => {
    const { query, refinements } = req.body;

    // 1. Extract base intent
    const baseIntent = extractIntent(query);

    // 2. Refine the intent using applied refinements
    const refinedIntent = refineIntent(baseIntent, refinements || []);

    // 3. Candidate Retrieval using refined intent
    const candidates = await getCandidateMovies(refinedIntent);

    // 4. Re-rank candidates
    const rankedCandidates = await rankMovies(candidates, refinedIntent);

    // 5. Build AI justifications
    const enrichedRecommendations = enrichRecommendations(rankedCandidates, refinedIntent);

    res.status(200).json({
        intent: refinedIntent,
        recommendations: enrichedRecommendations
    });
});