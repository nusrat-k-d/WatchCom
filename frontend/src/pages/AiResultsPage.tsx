import { useState, useEffect, useMemo } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Sparkles, ArrowLeft, RefreshCw, AlertCircle, ArrowUpRight } from "lucide-react"
import type { Movie } from "../lib/mock-data"
import { Button } from "../components/ui/button"
import { MovieCard } from "../components/movies/MovieCard"
import { useDebounce } from "../lib/useDebounce"

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
  confidence?: string
  reason?: string
  tags?: string[]
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

const DEALBREAKERS = [
  { id: "jump scares", label: "No Jump Scares" },
  { id: "sad endings", label: "No Sad Endings" },
  { id: "open endings", label: "No Open Endings" },
  { id: "gore", label: "No Gore" },
  { id: "slow pacing", label: "Fast Paced" }
]

export function AiResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchInput, setSearchInput] = useState(query)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingStep, setLoadingStep] = useState(0)
  const [results, setResults] = useState<Movie[]>([])
  const [activeDealbreakers, setActiveDealbreakers] = useState<string[]>([])
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

  const displayedResults = useMemo(() => {
    if (activeDealbreakers.length === 0) return results
    return results.filter(movie => {
      const text = `${movie.title} ${movie.reason || ""} ${movie.genres?.join(" ") || ""} ${movie.tags?.join(" ") || ""}`.toLowerCase()
      for (const d of activeDealbreakers) {
        if (d === "jump scares" && (text.includes("horror") || text.includes("scare") || text.includes("creepy") || text.includes("ghost"))) return false
        if (d === "sad endings" && (text.includes("tragic") || text.includes("death") || text.includes("sad") || text.includes("grief") || text.includes("tragedy"))) return false
        if (d === "gore" && (text.includes("gore") || text.includes("bloody") || text.includes("violent") || text.includes("slasher"))) return false
        if (d === "slow pacing" && text.includes("slow")) return false
        if (d === "open endings" && (text.includes("unresolved") || text.includes("ambiguous"))) return false
      }
      return true
    })
  }, [results, activeDealbreakers])

  const loadingStages = [
    "Analyzing cinematic themes & tone...",
    "Querying deep celluloid archives...",
    "Evaluating narrative arcs & performances...",
    "Ranking personalized matches..."
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
    if (!query.trim()) {
      setIsLoading(false)
      setResults([])
      return
    }

    setSearchInput(query)
    setError(null)

    // Check memory cache first
    const cached = searchResultsCache.get(query)
    if (cached) {
      setResults(cached.results)
      setIntent(cached.intent)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setLoadingStep(0)

    const controller = new AbortController()
    let isApiDone = false
    let apiData: RecommendationResponse | null = null

    // Fetch recommendations from backend
    fetch(`http://localhost:5000/api/ai/recommend?q=${encodeURIComponent(query)}`, {
      signal: controller.signal
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}: ${res.statusText}`)
        }
        return res.json()
      })
      .then((data: RecommendationResponse) => {
        apiData = data
        isApiDone = true
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("AI recommendation fetch error:", err)
          isApiDone = true
          setError(err.message || "Failed to fetch cinematic recommendations.")
        }
      })

    const runCompletion = () => {
      const checkCompletion = () => {
        if (isApiDone) {
          if (apiData) {
            let mappedIntent: ExtractedIntent | null = null
            if (apiData.intent) {
              mappedIntent = {
                mood: apiData.intent.mood || "Atmospheric",
                avoid: apiData.intent.avoid?.join(", ") || "None",
                runtime: apiData.intent.runtime ? `${apiData.intent.runtime}m` : "Any",
                genre: apiData.intent.genres?.join(", ") || "Cinema",
                complexity: apiData.intent.complexity || "Medium",
                confidence: 94
              }
              setIntent(mappedIntent)
            }

            const rawList = apiData.recommendations || apiData.candidates || []
            const mapped: Movie[] = rawList.map((m) => {
              const year = m.release_date ? parseInt(m.release_date.split("-")[0], 10) : 2024
              return {
                id: String(m.id),
                title: m.title || m.original_title || "Untitled",
                year: isNaN(year) ? 2024 : year,
                posterUrl: m.poster_path ? (m.poster_path.startsWith("http") ? m.poster_path : `https://image.tmdb.org/t/p/w500${m.poster_path}`) : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
                rating: m.vote_average ? Number((m.vote_average / 2).toFixed(1)) : 4.0,
                runtime: m.runtime ? `${m.runtime} min` : "120 min",
                overview: m.overview || "",
                genres: m.tags || [],
                matchScore: m.watchComScore || (m.confidence === "high" ? 95 : m.confidence === "medium" ? 85 : 75),
                confidence: m.confidence || "High Match",
                reason: m.reason,
                tags: m.tags
              }
            })

            setResults(mapped)
            setIsLoading(false)

            searchResultsCache.set(query, {
              results: mapped,
              intent: mappedIntent
            })
          } else {
            // Fallback to mock movies on empty response
            import("../lib/mock-data").then(({ MOCK_MOVIES }) => {
              setResults(MOCK_MOVIES)
              setIsLoading(false)
            })
          }
        } else {
          setTimeout(checkCompletion, 50)
        }
      }
      checkCompletion()
    }

    // Loading stages sequence
    const interval = setInterval(() => {
      if (isApiDone) {
        clearInterval(interval)
        const fastTrack = setInterval(() => {
          setLoadingStep((current) => {
            if (current < loadingStages.length - 1) {
              return current + 1
            } else {
              clearInterval(fastTrack)
              runCompletion()
              return current
            }
          })
        }, 70)
      } else {
        setLoadingStep((current) => {
          if (current < loadingStages.length - 1) {
            return current + 1
          } else {
            clearInterval(interval)
            runCompletion()
            return current
          }
        })
      }
    }, 500)

    return () => {
      controller.abort()
      clearInterval(interval)
    }
  }, [query, retryTrigger])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedInput = searchInput.trim()
    if (trimmedInput) {
      if (trimmedInput === query) {
        searchResultsCache.delete(trimmedInput)
        setRetryTrigger(prev => prev + 1)
      } else {
        setSearchParams({ q: trimmedInput })
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#060607] text-[#F0EDE6] pb-24 relative overflow-hidden">
      
      {/* Top Background Atmospheric Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[250px] bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.06),transparent_70%)] pointer-events-none z-0" />
      
      <div className="container mx-auto px-6 md:px-10 pt-24 md:pt-28 relative z-10 max-w-6xl">
        
        {/* Top Action Bar (Back to Discover) */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/discover" 
            className="inline-flex items-center gap-2 text-xs uppercase font-mono tracking-[0.2em] text-zinc-400 hover:text-[#C5A059] bg-white/[0.03] hover:bg-[#C5A059]/[0.08] border border-white/[0.08] hover:border-[#C5A059]/30 px-3.5 py-1.5 rounded-full transition-all duration-300 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>AI Discovery</span>
          </Link>

          {intent && (
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#C5A059] bg-[#C5A059]/[0.08] border border-[#C5A059]/25 px-3 py-1 rounded-full uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
              <span>{intent.confidence}% Match Precision</span>
            </div>
          )}
        </div>

        {/* Refined Search Header Bar */}
        <div className="max-w-2xl mx-auto mb-10 text-center">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <div 
              className={`relative flex items-center bg-[#09090c]/90 backdrop-blur-2xl border rounded-2xl overflow-visible p-1.5 transition-all duration-300 ${
                isFocused 
                  ? "border-[#C5A059] shadow-obsidian-focus bg-[#08080a]" 
                  : "border-white/[0.10] hover:border-white/[0.20] shadow-obsidian"
              }`}
            >
              <div className="flex items-center flex-1 pl-3.5">
                <Search className={`h-4 w-4 transition-colors ${isFocused ? "text-[#C5A059]" : "text-zinc-500"}`} />
                <input 
                  type="text"
                  placeholder="Refine what you want to watch..." 
                  className="w-full bg-transparent text-[#F0EDE6] pl-3 pr-3 py-2.5 outline-none placeholder:text-zinc-600 text-sm font-sans font-light"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                  aria-label="Describe what you want to watch"
                />
              </div>
              <button 
                type="submit" 
                className="bg-[#C5A059] hover:bg-[#D8B878] text-[#08080a] px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-md"
              >
                Refine
              </button>

              {/* Autocomplete Overlay */}
              <AnimatePresence>
                {isFocused && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-[#0a0a0d]/98 backdrop-blur-2xl border border-white/[0.12] rounded-2xl overflow-hidden z-40 shadow-2xl text-left"
                  >
                    <div className="p-3 text-[9px] text-zinc-500 tracking-[0.2em] uppercase font-mono font-medium border-b border-white/[0.04] bg-black/50">
                      Suggested Titles
                    </div>
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          setSearchInput(`Tell me more about ${suggestion} and movies like it`)
                          setSearchParams({ q: `Tell me more about ${suggestion} and movies like it` })
                        }}
                        className="w-full text-left px-5 py-3 hover:bg-white/[0.04] transition-colors text-xs text-zinc-300 hover:text-[#F0EDE6] flex items-center justify-between"
                      >
                        <span>{suggestion}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>

        {/* Results / Loading Area */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto space-y-6 text-center py-16"
            >
              <div className="flex flex-col items-center justify-center p-12 bg-[#09090c]/70 border border-white/[0.06] rounded-3xl backdrop-blur-xl shadow-2xl">
                {/* Minimalist AI spinner */}
                <div className="relative w-16 h-16 flex items-center justify-center mb-6">
                  <div className="absolute inset-0 rounded-full border-2 border-white/[0.06] border-t-[#C5A059] animate-spin" />
                  <Sparkles className="h-6 w-6 text-[#C5A059] animate-pulse" />
                </div>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingStep}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="text-base sm:text-lg font-serif text-[#F0EDE6] font-normal"
                  >
                    {loadingStages[loadingStep]}
                  </motion.p>
                </AnimatePresence>
                
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.25em] mt-2">
                  Matching Context
                </p>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="min-h-[40vh] flex items-center justify-center px-4 text-center"
            >
              <div className="max-w-md w-full bg-[#09090c]/90 backdrop-blur-2xl border border-white/[0.08] p-10 rounded-3xl shadow-2xl flex flex-col items-center">
                <div className="h-12 w-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-400 mb-6">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-serif font-normal text-[#F0EDE6] mb-2">Recommendation Offline</h3>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed font-light">
                  {error || "Could not retrieve recommendations. Please retry."}
                </p>
                <Button 
                  onClick={() => {
                    searchResultsCache.delete(query)
                    setRetryTrigger(prev => prev + 1)
                  }}
                  className="bg-[#C5A059] hover:bg-[#D8B878] text-[#08080a] font-semibold text-xs uppercase tracking-wider py-3 px-6 rounded-xl cursor-pointer"
                >
                  <RefreshCw className="mr-2 h-3.5 w-3.5" /> Retry Search
                </Button>
              </div>
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              
              {/* Section Header with Refined Filters */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-normal text-[#F0EDE6] flex items-center gap-2">
                    <span>Curated Recommendations</span>
                  </h2>
                  <p className="text-xs text-zinc-400 font-light mt-0.5">
                    Showing {displayedResults.length} tailored selections for <span className="text-[#C5A059] italic font-serif font-normal">"{query}"</span>
                  </p>
                </div>

                {/* Exclude Filter Capsules */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 shrink-0 mr-1">
                    Exclude:
                  </span>
                  {DEALBREAKERS.map((d) => {
                    const active = activeDealbreakers.includes(d.id)
                    return (
                      <button
                        key={d.id}
                        onClick={() => {
                          setActiveDealbreakers(prev =>
                            prev.includes(d.id) ? prev.filter(x => x !== d.id) : [...prev, d.id]
                          )
                        }}
                        className={`px-3 py-1 rounded-full text-[11px] font-normal transition-all shrink-0 cursor-pointer ${
                          active
                            ? "bg-red-500/15 text-red-300 border border-red-500/40"
                            : "bg-white/[0.03] text-zinc-400 hover:text-white border border-white/[0.06] hover:border-white/[0.15]"
                        }`}
                      >
                        {d.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Movie Matches Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-6">
                {displayedResults.map((movie, idx) => (
                  <MovieCard key={movie.id} movie={movie} idx={idx} />
                ))}
              </div>

              {/* Clean Bottom Navigation */}
              <div className="pt-8 text-center">
                <Link
                  to="/discover"
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 hover:text-[#C5A059] bg-white/[0.03] hover:bg-[#C5A059]/[0.08] border border-white/[0.08] hover:border-[#C5A059]/30 px-5 py-2.5 rounded-full transition-all duration-300"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Start New Discovery</span>
                </Link>
              </div>

            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 max-w-md mx-auto"
            >
              <h3 className="text-xl font-serif text-[#F0EDE6] mb-2">No direct match found</h3>
              <p className="text-xs text-zinc-400 mb-6 font-light">
                Try a different mood, genre, or director inquiry.
              </p>
              <Link
                to="/discover"
                className="bg-[#C5A059] text-[#08080a] font-semibold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl inline-block"
              >
                Back to Discovery
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
