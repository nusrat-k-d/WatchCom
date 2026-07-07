import { extractIntent } from "../services/ai/intentExtractor.js";
import { getCandidateMovies } from "../services/ai/candidateRetriever.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const recommendMovies = asyncHandler(async (req, res) => {
    const { query } = req.body;

    const intent = extractIntent(query);
    const candidates = await getCandidateMovies(intent);

    res.json({
        intent,
        candidates
    });
});