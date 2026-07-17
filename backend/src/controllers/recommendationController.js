import { extractIntent } from "../services/ai/intentExtractor.js";
import { getCandidateMovies } from "../services/ai/candidateRetriever.js";
import { rankMovies } from "../services/ai/rankingEngine.js";
import { enrichRecommendations } from "../services/ai/explanationLayer.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const recommendMovies = asyncHandler(async (req, res) => {
    const { query } = req.body;

    const intent = extractIntent(query);
    const candidates = await getCandidateMovies(intent);
    const rankedCandidates = await rankMovies(candidates, intent);
    const enrichedRecommendations = enrichRecommendations(rankedCandidates, intent);

    res.status(200).json({
        intent,
        recommendations: enrichedRecommendations
    });
});