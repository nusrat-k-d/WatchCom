import { extractIntent } from "../services/ai/intentExtractor.js";
import { refineIntent } from "../services/ai/refinementLayer.js";
import { getCandidateMovies } from "../services/ai/candidateRetriever.js";
import { rankMovies } from "../services/ai/rankingEngine.js";
import { enrichRecommendations } from "../services/ai/explanationLayer.js";
import { matchCouplesTastes } from "../services/ai/couplesMatcher.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const recommendMovies = asyncHandler(async (req, res) => {
    const { query, refinements } = req.body;

    // 1. Extract base intent
    const baseIntent = await extractIntent(query);

    // 2. Refine the intent using applied refinements
    const refinedIntent = refineIntent(baseIntent, refinements || []);

    // 3. Candidate Retrieval using refined intent
    const candidates = await getCandidateMovies(refinedIntent);

    // 4. Re-rank candidates
    const rankedCandidates = await rankMovies(candidates, refinedIntent);

    // 5. Build AI justifications
    const enrichedRecommendations = await enrichRecommendations(rankedCandidates, refinedIntent);

    res.status(200).json({
        intent: refinedIntent,
        recommendations: enrichedRecommendations
    });
});

export const couplesMatch = asyncHandler(async (req, res) => {
    const { person1Query, person2Query, person1Name, person2Name } = req.body;

    if (!person1Query || !person2Query) {
        const error = new Error("Both person1Query and person2Query are required for couples match");
        error.status = 400;
        throw error;
    }

    const result = await matchCouplesTastes({
        person1Query,
        person2Query,
        person1Name,
        person2Name
    });

    res.status(200).json(result);
});