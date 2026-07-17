/**
 * Refinement Layer Service for WatchCom
 * Updates the extracted search intent with applied refinements.
 */

export const refineIntent = (baseIntent, refinements) => {
    if (!refinements || !Array.isArray(refinements) || refinements.length === 0) {
        return baseIntent;
    }

    // Clone base intent and initialize refinement fields
    const refined = {
        ...baseIntent,
        genres: [...(baseIntent.genres || [])],
        avoid: [...(baseIntent.avoid || [])],
        releaseYearMin: baseIntent.releaseYearMin || null,
        releaseYearMax: baseIntent.releaseYearMax || null,
        minVotes: baseIntent.minVotes || null,
        minRating: baseIntent.minRating || null,
        customKeywords: [...(baseIntent.customKeywords || [])]
    };

    for (const ref of refinements) {
        const lower = ref.toLowerCase().trim();

        // 1. Preset chips matching
        if (lower === 'more action') {
            if (!refined.genres.includes('Action')) refined.genres.push('Action');
        } else if (lower === 'more emotional') {
            refined.mood = 'emotional';
            refined.avoid = refined.avoid.filter(item => item !== 'emotional' && item !== 'depressing');
        } else if (lower === 'less emotional') {
            refined.mood = null;
            if (!refined.avoid.includes('emotional')) refined.avoid.push('emotional');
            if (!refined.avoid.includes('depressing')) refined.avoid.push('depressing');
        } else if (lower === 'mind-bending') {
            refined.mood = 'mind-blowing';
            if (!refined.genres.includes('Sci-Fi')) refined.genres.push('Sci-Fi');
            if (!refined.genres.includes('Mystery')) refined.genres.push('Mystery');
            refined.complexity = 'complex';
        } else if (lower === 'feel good') {
            refined.mood = 'comforting';
            refined.complexity = 'light';
            if (!refined.genres.includes('Comedy')) refined.genres.push('Comedy');
            if (!refined.genres.includes('Family')) refined.genres.push('Family');
        } else if (lower === 'darker') {
            refined.mood = 'dark';
        } else if (lower === 'funny') {
            refined.mood = 'funny';
            if (!refined.genres.includes('Comedy')) refined.genres.push('Comedy');
        } else if (lower === 'romantic') {
            refined.mood = 'romantic';
            if (!refined.genres.includes('Romance')) refined.genres.push('Romance');
        } else if (lower === 'family friendly') {
            if (!refined.genres.includes('Family')) refined.genres.push('Family');
            if (!refined.avoid.includes('violence')) refined.avoid.push('violence');
            if (!refined.avoid.includes('scary')) refined.avoid.push('scary');
            if (!refined.avoid.includes('horror')) refined.avoid.push('horror');
        } else if (lower === 'hidden gems' || lower === 'underrated') {
            refined.minVotes = null;
            refined.minRating = 7.0;
        } else if (lower === 'new releases') {
            refined.releaseYearMin = 2020;
        } else if (lower === 'classic') {
            refined.releaseYearMax = 2000;
        } else if (lower === 'award winning') {
            refined.minRating = 7.8;
        } else if (lower === 'faster pace') {
            refined.complexity = 'light';
        } else if (lower === 'slow burn') {
            refined.complexity = 'deep';
        } else if (lower === 'shorter runtime') {
            refined.runtime = 95;
        } else if (lower === 'under 2 hours') {
            refined.runtime = 120;
        } else if (lower === 'long epic') {
            refined.runtime = 300; // allow long epics
        } else if (['sci-fi', 'mystery', 'crime', 'adventure', 'fantasy', 'animation', 'horror', 'thriller', 'comedy', 'drama', 'romance'].includes(lower)) {
            const genreName = lower === 'sci-fi' ? 'Sci-Fi' : lower.charAt(0).toUpperCase() + lower.slice(1);
            if (!refined.genres.includes(genreName)) refined.genres.push(genreName);
        }
        
        // 2. Custom text refinement parsing
        else {
            if (lower.startsWith('without ') || lower.startsWith('no ') || lower.startsWith('less ')) {
                const term = lower.replace(/^(without|no|less)\s+/, '').trim();
                if (term === 'horror') {
                    refined.genres = refined.genres.filter(g => g !== 'Horror');
                    if (!refined.avoid.includes('horror')) refined.avoid.push('horror');
                } else if (term === 'emotional' || term === 'drama') {
                    refined.mood = null;
                    if (!refined.avoid.includes('emotional')) refined.avoid.push('emotional');
                    if (!refined.avoid.includes('drama')) refined.avoid.push('drama');
                } else if (term === 'confusing' || term === 'complex') {
                    refined.complexity = 'easy';
                } else {
                    if (!refined.avoid.includes(term)) refined.avoid.push(term);
                }
            } else if (lower.startsWith('more ')) {
                const term = lower.replace(/^more\s+/, '').trim();
                if (term === 'action') {
                    if (!refined.genres.includes('Action')) refined.genres.push('Action');
                } else if (term === 'emotional') {
                    refined.mood = 'emotional';
                    refined.avoid = refined.avoid.filter(item => item !== 'emotional' && item !== 'depressing');
                } else if (term === 'suspense' || term === 'thrilling') {
                    refined.mood = 'suspenseful';
                } else if (term === 'funny') {
                    refined.mood = 'funny';
                    if (!refined.genres.includes('Comedy')) refined.genres.push('Comedy');
                } else {
                    refined.mood = term;
                }
            } else if (lower.includes('after ') || lower.includes('since ')) {
                const yearMatch = lower.match(/\b(after|since)\s+(\d{4})\b/);
                if (yearMatch) {
                    refined.releaseYearMin = parseInt(yearMatch[2], 10);
                }
            } else if (lower.includes('before ')) {
                const yearMatch = lower.match(/\bbefore\s+(\d{4})\b/);
                if (yearMatch) {
                    refined.releaseYearMax = parseInt(yearMatch[2], 10);
                }
            } else if (lower.includes('under 2 hours') || lower.includes('less than 2 hours')) {
                refined.runtime = 120;
            } else if (lower.includes('under 90 mins') || lower.includes('less than 90 mins') || lower.includes('under 90 minutes')) {
                refined.runtime = 90;
            } else {
                if (!refined.customKeywords.includes(lower)) {
                    refined.customKeywords.push(lower);
                }
            }
        }
    }

    return refined;
};
