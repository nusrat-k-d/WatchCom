import { useState, useEffect, useMemo } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Sparkles, ArrowLeft, Clock, Brain, RefreshCw, AlertCircle, Filter, ArrowUpRight } from "lucide-react"
import type { Movie } from "../lib/mock-data"
import { Button } from "../components/ui/button"
import { MovieCard } from "../components/movies/MovieCard"
import { useDebounce } from "../lib/useDebounce"

// Movie Card Shimmer Skeleton
function MovieCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="aspect-[2/3] rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden" />
      <div className="space-y-2 px-1">
        <div className="h-4 bg-white/5 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
      </div>
    </div>
  )
}

// Intent Panel Shimmer Skeleton
function IntentPanelSkeleton() {
  return (
    <div className="bg-[#0b0b0c] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl animate-pulse space-y-6">
      <div className="flex items-center gap-3.5 pb-4 border-b border-white/5">
        <div className="h-10 w-10 bg-white/5 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-white/5 rounded w-48" />
          <div className="h-3 bg-white/5 rounded w-64" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="space-y-2">
            <div className="h-3 bg-white/5 rounded w-12" />
            <div className="h-4 bg-white/5 rounded w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Memory cache for search results
const searchResultsCache = new Map<string, {
  results: Movie[]
  intent: ExtractedIntent | null
}>()

const AUTOCOMPLETE_SUGGESTIONS = [
  "Interstellar",
  "Arrival",
  "Contact",
  "The Martian",
  "Inception",
  "The Dark Knight",
  "Coherence",
  "Primer",
  "Moon",
  "Gravity",
  "Blade Runner 2049",
  "Ex Machina"
]

interface RawCandidate {
  id: number
  title?: string
  original_title?: string
  overview?: string
  poster_path?: string
  release_date?: string
  vote_average?: number
  genre_ids?: number[]
  runtime?: number
  popularity?: number
  watchComScore?: number
}

interface RecommendationResponse {
  intent?: {
    mood?: string
    avoid?: string[]
    runtime?: number
    genres?: string[]
    complexity?: string
  }
  candidates?: RawCandidate[]
  recommendations?: RawCandidate[]
}

interface ExtractedIntent {
  mood: string
  avoid: string
  runtime: string
  genre: string
  complexity: string
  confidence: number
}

export function AiResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchInput, setSearchInput] = useState(query)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingStep, setLoadingStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [results, setResults] = useState<Movie[]>([])
  const [intent, setIntent] = useState<ExtractedIntent | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [retryTrigger, setRetryTrigger] = useState(0)

  const debouncedSearchInput = useDebounce(searchInput, 300)

  const suggestions = useMemo(() => {
    if (!debouncedSearchInput.trim()) return []
    return AUTOCOMPLETE_SUGGESTIONS.filter(item => 
      item.toLowerCase().includes(debouncedSearchInput.toLowerCase()) && 
      item.toLowerCase() !== debouncedSearchInput.toLowerCase()
    )
  }, [debouncedSearchInput])

  const loadingStages = [
    "Understanding your request...",
    "Detecting intent...",
    "Searching movie knowledge...",
    "Ranking best matches...",
    "Preparing explanations..."
  ]



  // Save scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!isLoading && results.length > 0) {
        sessionStorage.setItem("watchcom_last_scroll_y", String(window.scrollY))
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isLoading, results])

  // AI Pipeline Request Lifecycle
  useEffect(() => {
    if (!query) {
      setResults([])
      setIsLoading(false)
      return
    }

    // Check memory cache first
    if (searchResultsCache.has(query)) {
      const cached = searchResultsCache.get(query)!
      setResults(cached.results)
      setIntent(cached.intent)
      setIsLoading(false)
      return
    }

    // Check sessionStorage
    const cachedQuery = sessionStorage.getItem("watchcom_last_search_query")
    const cachedResults = sessionStorage.getItem("watchcom_last_search_results")
    const cachedIntent = sessionStorage.getItem("watchcom_last_search_intent")

    if (cachedQuery === query && cachedResults && cachedIntent) {
      try {
        const parsedResults = JSON.parse(cachedResults)
        const parsedIntent = JSON.parse(cachedIntent)
        setResults(parsedResults)
        setIntent(parsedIntent)

        // Store in memory cache too
        searchResultsCache.set(query, {
          results: parsedResults,
          intent: parsedIntent
        })

        setIsLoading(false)
        
        // Restore scroll position after DOM rendering
        const scrollY = sessionStorage.getItem("watchcom_last_scroll_y")
        if (scrollY) {
          setTimeout(() => {
            window.scrollTo(0, parseInt(scrollY, 10))
          }, 150)
        }
        return
      } catch (e) {
        console.error("Error restoring search cache:", e)
      }
    }

    setIsLoading(true)
    setLoadingStep(0)
    setCompletedSteps([])
    setError(null)

    let apiData: RecommendationResponse | null = null
    let apiError: string | null = null
    let isApiDone = false

    // Start API request
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/ai/recommend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ query })
        })

        if (!response.ok) {
          throw new Error(`Server returned status ${response.status}`)
        }

        const data = await response.json()
        apiData = data
      } catch (err: unknown) {
        console.error("API Error:", err)
        apiError = err instanceof Error ? err.message : "Failed to fetch recommendations from the server."
      } finally {
        isApiDone = true
      }
    }

    fetchData()

    const runCompletion = () => {
      const checkCompletion = () => {
        if (isApiDone) {
          if (apiError) {
            setError(apiError)
            setResults([])
            setIsLoading(false)
          } else if (apiData) {
            const rawCandidates = apiData.candidates || apiData.recommendations || []
            
            // Map intent
            const backendIntent = apiData.intent
            let mappedIntent = null
            if (backendIntent) {
              mappedIntent = {
                mood: backendIntent.mood || "Any",
                avoid: backendIntent.avoid && backendIntent.avoid.length > 0 ? backendIntent.avoid.join(", ") : "None specified",
                runtime: backendIntent.runtime ? `Under ${backendIntent.runtime} mins` : "Any",
                genre: backendIntent.genres && backendIntent.genres.length > 0 ? backendIntent.genres.join(", ") : "Any",
                complexity: backendIntent.complexity || "Medium",
                confidence: 92
              }
              setIntent(mappedIntent)
            }
            
            // Map candidates to frontend Movie type
            const GENRE_ID_TO_NAME: Record<number, string> = {
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
            }

            const mapped: Movie[] = rawCandidates.map((m: RawCandidate) => {
              const genres = Array.isArray(m.genre_ids)
                ? m.genre_ids.map((id: number) => GENRE_ID_TO_NAME[id] || '').filter(Boolean)
                : []
              if (genres.length === 0) genres.push('Drama')

              const releaseYear = m.release_date ? parseInt(m.release_date.split('-')[0], 10) : 0

              return {
                id: String(m.id),
                title: m.title || 'Untitled',
                year: isNaN(releaseYear) ? 0 : releaseYear,
                runtime: m.runtime ? `${m.runtime} min` : 'N/A',
                genres,
                overview: m.overview || '',
                posterUrl: m.poster_path 
                  ? `https://image.tmdb.org/t/p/w500${m.poster_path}` 
                  : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
                rating: m.vote_average ? Number((m.vote_average / 2).toFixed(1)) : 0,
                matchScore: m.watchComScore || 0
              }
            })

            setResults(mapped)
            setIsLoading(false)

            // Cache in memory
            searchResultsCache.set(query, {
              results: mapped,
              intent: mappedIntent
            })

            // Cache results in sessionStorage
            try {
              sessionStorage.setItem("watchcom_last_search_query", query)
              sessionStorage.setItem("watchcom_last_search_results", JSON.stringify(mapped))
              if (mappedIntent) {
                sessionStorage.setItem("watchcom_last_search_intent", JSON.stringify(mappedIntent))
              }
              sessionStorage.setItem("watchcom_last_scroll_y", "0")
            } catch (e) {
              console.error("Error setting search cache:", e)
            }
          } else {
            setError("No data received from the recommendation server.")
            setResults([])
            setIsLoading(false)
          }
        } else {
          // Wait 50ms and check again
          setTimeout(checkCompletion, 50)
        }
      }
      checkCompletion()
    }

    // Loading stages sequence
    const interval = setInterval(() => {
      if (isApiDone) {
        // API has finished! Fast-track the remaining loading steps.
        clearInterval(interval)
        const fastTrack = setInterval(() => {
          setLoadingStep((current) => {
            if (current < loadingStages.length - 1) {
              setCompletedSteps((prev) => [...prev, current])
              return current + 1
            } else {
              clearInterval(fastTrack)
              runCompletion()
              return current
            }
          })
        }, 80) // Rapidly complete transitions (80ms per step)
      } else {
        setLoadingStep((current) => {
          if (current < loadingStages.length - 1) {
            setCompletedSteps((prev) => [...prev, current])
            return current + 1
          } else {
            clearInterval(interval)
            runCompletion()
            return current
          }
        })
      }
    }, 600)

    return () => {
      clearInterval(interval)
    }
  }, [query, retryTrigger])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedInput = searchInput.trim()
    if (trimmedInput) {
      if (trimmedInput === query) {
        // Force retry of same query by clearing cache and triggering refetch
        searchResultsCache.delete(trimmedInput)
        setRetryTrigger(prev => prev + 1)
      } else {
        setSearchParams({ q: trimmedInput })
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] pb-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06),transparent_60%)] pointer-events-none z-0" />
      <div className="absolute top-[30vh] right-[10%] w-[350px] h-[350px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03),transparent_70%)] pointer-events-none z-0 blur-[60px]" />
      
      <div className="container mx-auto px-4 md:px-8 pt-10 relative z-10">
        
        {/* Back navigation */}
        <Link 
          to="/discover" 
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-gold)] transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to AI Assistant
        </Link>

        {/* Search header area */}
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[rgba(212,175,55,0.15)] to-transparent border border-[var(--color-gold)]/20 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest text-[var(--color-gold)] uppercase mb-6"
          >
            <Brain className="h-3.5 w-3.5 text-[var(--color-gold)]" /> AI Intent Matcher
          </motion.div>

          <form onSubmit={handleSearchSubmit} className="relative w-full mb-4">
            <div 
              className={`relative flex items-center bg-[#0b0b0c]/80 backdrop-blur-xl border rounded-2xl overflow-visible p-2 shadow-2xl transition-all duration-500 ${
                isFocused 
                  ? "border-[#C9A227]/50 shadow-[0_0_40px_rgba(201,162,39,0.15)] bg-black/90" 
                  : "border-white/10"
              }`}
            >
              <div className="flex items-center flex-1 pl-4">
                <Search className={`h-5 w-5 transition-colors ${isFocused ? "text-[#C9A227]" : "text-gray-500"}`} />
                <input 
                  type="text"
                  placeholder="Describe what you want to watch..." 
                  className="w-full bg-transparent text-white pl-4 pr-4 py-4 outline-none placeholder:text-gray-600 text-sm sm:text-base font-sans"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                  aria-label="Describe what you want to watch"
                />
              </div>
              <button 
                type="submit" 
                className="bg-[#C9A227] hover:bg-[#b5952f] text-black px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Refine
              </button>

              {/* Autocomplete Overlay */}
              <AnimatePresence>
                {isFocused && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-[#0B0B0B] border border-white/10 rounded-xl overflow-hidden z-30 shadow-2xl"
                  >
                    <div className="p-2 text-left text-[9px] text-gray-500 tracking-wider uppercase font-semibold border-b border-white/5 bg-black/40">
                      Suggested Movies
                    </div>
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                          setSearchInput(`Tell me more about ${suggestion} and movies like it`)
                          setSearchParams({ q: `Tell me more about ${suggestion} and movies like it` })
                        }}
                        className="w-full text-left px-5 py-3 hover:bg-white/5 transition-colors text-sm text-gray-300 hover:text-white flex items-center justify-between"
                      >
                        <span>{suggestion}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-gray-500" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>

        {/* Results / Loading Container */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto space-y-8 text-left"
            >
              {/* Original Search Query Display */}
              <div className="text-center py-4 border-b border-white/5 mb-2">
                <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-widest font-bold mb-1">Processing Request</p>
                <p className="text-lg sm:text-xl font-serif text-white max-w-2xl mx-auto font-medium italic animate-pulse">
                  "{query}"
                </p>
              </div>

              {/* Sequential Progress Stages */}
              <div className="bg-[#0b0b0c] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-[var(--color-gold)] animate-pulse" />
                  <span className="text-sm font-semibold text-white">AI Director Mapping</span>
                </div>
                
                <div className="flex flex-wrap gap-2.5">
                  {loadingStages.map((stage, idx) => {
                    const isCompleted = completedSteps.includes(idx)
                    const isActive = loadingStep === idx

                    return (
                      <span 
                        key={stage}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-300 ${
                          isActive 
                            ? "bg-[rgba(212,175,55,0.08)] border-[var(--color-gold)]/40 text-white font-medium" 
                            : isCompleted 
                              ? "bg-transparent border-transparent text-[var(--color-gold)]" 
                              : "bg-transparent border-transparent text-gray-700"
                        }`}
                      >
                        {isCompleted && "✓ "}
                        {stage}
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* AI Understood Intent Panel Skeleton */}
              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-widest text-gray-500">Mapping Intent Vectors</div>
                <IntentPanelSkeleton />
              </div>

              {/* Movie Matches Grid Skeletons */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-[var(--color-gold)] animate-pulse" />
                    Searching Direct Matches
                  </h3>
                  <span className="text-xs text-[var(--color-text-secondary)]">Retrieving TMDB cinematic records...</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <MovieCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 max-w-md mx-auto"
            >
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-serif font-bold text-white mb-1.5">Error fetching recommendations</h3>
              <p className="text-xs text-red-400 mb-5">
                {error}
              </p>
              <Button 
                onClick={() => {
                  searchResultsCache.delete(query)
                  setRetryTrigger(prev => prev + 1)
                }}
                className="bg-[var(--color-gold)] hover:bg-[#b5952f] text-black"
              >
                Retry Search
              </Button>
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              
              {/* Original Search Query Display */}
              <div className="text-center py-4 border-b border-white/5 mb-2">
                <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-widest font-bold mb-1">Original Request</p>
                <p className="text-lg sm:text-xl font-serif text-white max-w-2xl mx-auto font-medium italic">
                  "{query}"
                </p>
              </div>

              {/* AI Understood Intent Panel */}
              {intent && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-[#0b0b0c] border border-[var(--color-gold)]/15 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
                >
                  {/* Backdrop golden accent decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.04),transparent_70%)] pointer-events-none" />
                  
                  <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-white/5">
                    <div className="p-2 bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 rounded-lg">
                      <Brain className="h-5 w-5 text-[var(--color-gold)]" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-white text-lg sm:text-xl">WatchCom AI Intent Extraction</h4>
                      <p className="text-xs text-[var(--color-text-secondary)] font-light">Extracted thematic attributes mapped from your request.</p>
                    </div>
                    <div className="ml-auto bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 tracking-wider font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-pulse" />
                      {intent.confidence}% Confidence
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-left">
                    <div className="space-y-1.5">
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Mood / Vibe</div>
                      <div className="text-sm font-semibold text-white truncate" title={intent.mood}>{intent.mood}</div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 text-red-400" /> Avoid
                      </div>
                      <div className="text-sm font-semibold text-white truncate" title={intent.avoid}>{intent.avoid}</div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-500" /> Runtime
                      </div>
                      <div className="text-sm font-semibold text-white truncate" title={intent.runtime}>{intent.runtime}</div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Filter className="h-3 w-3 text-gray-500" /> Genre Mapping
                      </div>
                      <div className="text-sm font-semibold text-white truncate" title={intent.genre}>{intent.genre}</div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Complexity</div>
                      <div className="text-sm font-semibold text-[var(--color-gold)] truncate" title={intent.complexity}>{intent.complexity}</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Movie Matches Grid */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-[var(--color-gold)]" />
                    AI Direct Matches
                  </h3>
                  <span className="text-xs text-[var(--color-text-secondary)]">Semantic search completed</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {results.map((movie, idx) => (
                    <MovieCard key={movie.id} movie={movie} idx={idx} />
                  ))}
                </div>
              </div>

              {/* Reset Search Button */}
              <div className="pt-6 text-center">
                <Button 
                  onClick={() => {
                    setSearchInput("")
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }}
                  variant="outline" 
                  className="border-white/10 hover:bg-white/5 text-white"
                >
                  <RefreshCw className="mr-2 h-4.5 w-4.5" /> Start New Search
                </Button>
              </div>

            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 max-w-md mx-auto"
            >
              <Brain className="h-10 w-10 text-[var(--color-gold)] mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-serif font-bold text-white mb-1.5">No recommendations found</h3>
              <p className="text-xs text-[var(--color-text-secondary)] mb-5">
                We couldn't find any recommendations matching your criteria. Try adjusting your query or describing a different movie style.
              </p>
              <Button 
                onClick={() => {
                  setSearchParams({})
                  setSearchInput("")
                }}
                className="bg-[var(--color-gold)] hover:bg-[#b5952f] text-black"
              >
                Clear Search
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
