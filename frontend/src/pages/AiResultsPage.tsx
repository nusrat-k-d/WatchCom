import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Sparkles, ArrowLeft, Clock, Brain, RefreshCw, CheckCircle2, AlertCircle, Filter } from "lucide-react"
import type { Movie } from "../lib/mock-data"
import { Button } from "../components/ui/button"
import { MovieCard } from "../components/movies/MovieCard"

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

    // Check if we have cached results for this query in sessionStorage
    const cachedQuery = sessionStorage.getItem("watchcom_last_search_query")
    const cachedResults = sessionStorage.getItem("watchcom_last_search_results")
    const cachedIntent = sessionStorage.getItem("watchcom_last_search_intent")

    if (cachedQuery === query && cachedResults && cachedIntent) {
      try {
        setResults(JSON.parse(cachedResults))
        setIntent(JSON.parse(cachedIntent))
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

    let apiData: any = null
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
      } catch (err: any) {
        console.error("API Error:", err)
        apiError = err.message || "Failed to fetch recommendations from the server."
      } finally {
        isApiDone = true
      }
    }

    fetchData()

    // Loading stages sequence
    const interval = setInterval(() => {
      setLoadingStep((current) => {
        if (current < loadingStages.length - 1) {
          setCompletedSteps((prev) => [...prev, current])
          return current + 1
        } else {
          // We reached the last step. Stop the interval.
          clearInterval(interval)
          
          // Now wait until API is done (it might already be done)
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

                const mapped: Movie[] = rawCandidates.map((m: any) => {
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
              // Wait 100ms and check again
              setTimeout(checkCompletion, 100)
            }
          }

          checkCompletion()
          return current
        }
      })
    }, 650)

    return () => {
      clearInterval(interval)
    }
  }, [query])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() })
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
            <div className="relative flex items-center bg-[#0d0d0d] border border-white/10 rounded-full overflow-hidden shadow-2xl focus-within:border-[var(--color-gold)]/50 focus-within:shadow-[0_0_25px_rgba(212,175,55,0.15)] transition-all">
              <Search className="absolute left-6 h-5 w-5 text-gray-500" />
              <input 
                type="text"
                placeholder="Describe what you want to watch..." 
                className="w-full bg-transparent text-white pl-14 pr-32 py-5 outline-none text-base placeholder:text-gray-600 font-sans"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute right-3 bg-[var(--color-gold)] hover:bg-[#b5952f] text-black px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-[var(--color-gold)]/20 cursor-pointer"
              >
                Refine
              </button>
            </div>
          </form>
        </div>

        {/* Results / Loading Container */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col items-center justify-center py-12 max-w-lg mx-auto bg-[#0b0b0c] border border-white/5 p-8 md:p-12 rounded-2xl shadow-2xl relative"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.02),transparent_70%)] pointer-events-none rounded-2xl" />

              {/* Glowing Pulse Ring */}
              <div className="relative w-16 h-16 mb-10 flex items-center justify-center">
                <div className="absolute inset-0 border border-[var(--color-gold)]/20 rounded-full animate-ping" style={{ animationDuration: '2.5s' }} />
                <div className="absolute inset-0 border-2 border-[var(--color-gold)]/10 rounded-full" />
                <motion.div 
                  className="absolute inset-0 border-2 border-t-[var(--color-gold)] border-r-[var(--color-gold)] rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <Brain className="h-6 w-6 text-[var(--color-gold)] animate-pulse" />
              </div>

              {/* Sequential Progress Stages */}
              <div className="w-full space-y-4">
                {loadingStages.map((stage, idx) => {
                  const isCompleted = completedSteps.includes(idx)
                  const isActive = loadingStep === idx

                  return (
                    <motion.div 
                      key={stage}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`flex items-center gap-4 py-2 px-3 rounded-lg border transition-all duration-300 ${
                        isActive 
                          ? "bg-[rgba(212,175,55,0.05)] border-[var(--color-gold)]/30 text-white" 
                          : isCompleted 
                            ? "bg-transparent border-transparent text-gray-400" 
                            : "bg-transparent border-transparent text-gray-700"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-4.5 w-4.5 text-[var(--color-gold)] shrink-0" />
                      ) : isActive ? (
                        <motion.div 
                          className="h-2 w-2 rounded-full bg-[var(--color-gold)] shrink-0" 
                          animate={{ scale: [1, 1.4, 1] }} 
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-gray-800 shrink-0" />
                      )}
                      
                      <span className={`text-sm font-medium tracking-wide ${isActive ? "font-semibold" : "font-light"}`}>
                        {stage}
                      </span>
                    </motion.div>
                  )
                })}
              </div>

              <p className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest mt-10 font-bold">
                WatchCom AI Engine v1.0
              </p>
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
                  setSearchParams({ q: query })
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
                    <div className="ml-auto bg-green-500/10 border border-green-500/20 text-green-400 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
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
