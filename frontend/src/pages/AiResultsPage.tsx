import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Sparkles, ArrowLeft, Clock, Brain, RefreshCw, CheckCircle2, AlertCircle, Filter, Eye } from "lucide-react"
import { MOCK_MOVIES } from "../lib/mock-data"
import type { Movie } from "../lib/mock-data"
import { Button } from "../components/ui/button"

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

  const loadingStages = [
    "Understanding your request...",
    "Detecting intent...",
    "Searching movie knowledge...",
    "Ranking best matches...",
    "Preparing explanations..."
  ]

  // Dynamic intent parser based on query input
  const parseIntent = (inputQuery: string): ExtractedIntent => {
    const q = inputQuery.toLowerCase()
    
    // Default intent
    let mood = "Cerebral / Absorbing"
    let avoid = "None specified"
    let runtime = "Any"
    let genre = "Drama / Science Fiction"
    let complexity = "Medium"
    let confidence = 88

    // Rule-based heuristic extraction
    if (q.includes("mind blowing") || q.includes("mind-blowing") || q.includes("mind bending") || q.includes("mind-bending")) {
      mood = "Mind Blowing"
      complexity = "Extremely High"
      genre = "Sci-Fi / Mystery"
      confidence = 96
    } else if (q.includes("feel good") || q.includes("feel-good") || q.includes("happy") || q.includes("comfort")) {
      mood = "Uplifting / Warm"
      complexity = "Light / Accessible"
      genre = "Comedy / Drama / Music"
      confidence = 94
    } else if (q.includes("cry") || q.includes("sad") || q.includes("emotional")) {
      mood = "Melancholic / Cathartic"
      complexity = "High"
      genre = "Drama / Romance"
      confidence = 92
    } else if (q.includes("thriller") || q.includes("psychological") || q.includes("twist")) {
      mood = "Suspenseful / Tense"
      complexity = "High"
      genre = "Thriller / Mystery / Crime"
      confidence = 95
    }

    if (q.includes("depressing") || q.includes("sad")) {
      avoid = "Depressing / Heavy themes"
    } else if (q.includes("horror") || q.includes("scary")) {
      avoid = "Jump scares / Horror"
    } else if (q.includes("action") && q.includes("no")) {
      avoid = "Heavy action / Explosions"
    }

    if (q.includes("short") || q.includes("quick") || q.includes("under 2 hours")) {
      runtime = "Under 120 minutes"
    } else if (q.includes("long") || q.includes("epic")) {
      runtime = "Over 150 minutes"
    }

    if (q.includes("sci-fi") || q.includes("scifi") || q.includes("space") || q.includes("interstellar")) {
      genre = "Science Fiction"
    } else if (q.includes("music") || q.includes("whiplash") || q.includes("jazz")) {
      genre = "Drama / Music"
    } else if (q.includes("nolan") || q.includes("director")) {
      genre = "Auteur Cinema"
      complexity = "High"
    }

    return { mood, avoid, runtime, genre, complexity, confidence }
  }

  // AI Pipeline Request Lifecycle Simulation
  useEffect(() => {
    if (!query) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setLoadingStep(0)
    setCompletedSteps([])

    // Parse the query intent immediately
    const extractedIntent = parseIntent(query)
    setIntent(extractedIntent)

    // Simulate animated loading stages sequence
    // Total 5 stages. We change stage every 600ms, marking the previous step completed.
    const interval = setInterval(() => {
      setLoadingStep((current) => {
        if (current < loadingStages.length - 1) {
          setCompletedSteps((prev) => [...prev, current])
          return current + 1
        } else {
          setCompletedSteps((prev) => [...prev, current])
          clearInterval(interval)
          return current
        }
      })
    }, 650)

    const timer = setTimeout(() => {
      const lowerQuery = query.toLowerCase()
      let matchedMovies: Movie[] = []

      // Heuristic Mock Matcher
      if (
        lowerQuery.includes("sci-fi") ||
        lowerQuery.includes("scifi") ||
        lowerQuery.includes("interstellar") ||
        lowerQuery.includes("space") ||
        lowerQuery.includes("future") ||
        lowerQuery.includes("dimension") ||
        lowerQuery.includes("universe") ||
        lowerQuery.includes("bending") ||
        lowerQuery.includes("blowing")
      ) {
        matchedMovies = MOCK_MOVIES.filter(m => 
          m.genres.includes("Sci-Fi") || 
          m.title === "Interstellar" || 
          m.title === "Inception" ||
          m.title === "Primer" ||
          m.title === "Coherence" ||
          m.title === "Moon"
        )
      } else if (
        lowerQuery.includes("thriller") ||
        lowerQuery.includes("psychological") ||
        lowerQuery.includes("suspense") ||
        lowerQuery.includes("mystery") ||
        lowerQuery.includes("twist") ||
        lowerQuery.includes("dark")
      ) {
        matchedMovies = MOCK_MOVIES.filter(m => 
          m.genres.includes("Thriller") || 
          m.genres.includes("Mystery") ||
          m.title === "Fight Club" ||
          m.title === "Inception" ||
          m.title === "The Dark Knight"
        )
      } else if (
        lowerQuery.includes("feel good") ||
        lowerQuery.includes("happy") ||
        lowerQuery.includes("comfort") ||
        lowerQuery.includes("comedy") ||
        lowerQuery.includes("uplifting")
      ) {
        matchedMovies = MOCK_MOVIES.filter(m => 
          m.genres.includes("Music") || 
          m.genres.includes("Comedy") ||
          m.title === "Whiplash" ||
          m.title === "Pulp Fiction"
        )
      } else if (
        lowerQuery.includes("cry") ||
        lowerQuery.includes("sad") ||
        lowerQuery.includes("emotional") ||
        lowerQuery.includes("drama") ||
        lowerQuery.includes("heart")
      ) {
        matchedMovies = MOCK_MOVIES.filter(m => 
          m.genres.includes("Drama") || 
          m.title === "Interstellar" || 
          m.title === "Whiplash"
        )
      } else if (lowerQuery.includes("underrated") || lowerQuery.includes("gem") || lowerQuery.includes("hidden")) {
        matchedMovies = MOCK_MOVIES.filter(m => m.discoveryScore && m.discoveryScore > 90)
      } else {
        matchedMovies = [MOCK_MOVIES[0], MOCK_MOVIES[1], MOCK_MOVIES[7], MOCK_MOVIES[8]]
      }

      if (matchedMovies.length === 0) {
        matchedMovies = MOCK_MOVIES.slice(0, 4)
      }

      setResults(matchedMovies)
      setIsLoading(false)
    }, 3800) // End after ~3.8 seconds to display progress correctly

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [query])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() })
    }
  }

  const getDynamicReasoning = (movieTitle: string) => {
    const queryText = query.length > 40 ? `"${query.substring(0, 37)}..."` : `"${query}"`
    switch (movieTitle) {
      case "Interstellar":
        return `Matches your search for ${queryText}. Christopher Nolan's cosmic odyssey combines physics-defying science with a powerful father-daughter bond, perfectly fulfilling your craving for emotional and intellectual scale.`
      case "Inception":
        return `Matches your search for ${queryText}. An unparalleled heist thriller centered in the architecture of dreams. It caters directly to your intent for high-intensity, cerebral storytelling with intricate plots.`
      case "The Dark Knight":
        return `Matches your search for ${queryText}. The gold standard of dark, gritty crime dramas. Nolan's masterpiece explores the psychological conflict of chaos and justice, perfectly aligning with your preference for premium character studies.`
      case "Fight Club":
        return `Matches your search for ${queryText}. A cult classic that dissects modern identity and existential dread. Featuring a legendary narrative twist, it matches your request for dark, rebellious psychological journeys.`
      case "The Matrix":
        return `Matches your search for ${queryText}. A landmark cyberpunk sci-fi that questions the fabric of reality. Combining philosophy with ground-breaking action, it aligns with your search for mind-expanding masterpieces.`
      case "Whiplash":
        return `Matches your search for ${queryText}. An intense, rhythm-driven drama that examines the price of artistic perfection. Its blistering pacing and raw emotional friction provide a thrilling, unforgettable watch.`
      case "Pulp Fiction":
        return `Matches your search for ${queryText}. Quentin Tarantino's highly stylized crime comedy defined a generation of cinema. Its nonlinear format and razor-sharp dialogue offer a rich, engaging entertainment option.`
      case "Primer":
        return `Matches your search for ${queryText}. A legendary micro-budget time-travel puzzle. As a true hidden gem, its uncompromisingly logical structure makes it the ultimate intellectual watch for complex sci-fi lovers.`
      case "Coherence":
        return `Matches your search for ${queryText}. A tense, dialogue-driven thriller exploring alternate realities during a comet passing. A stellar recommendation for suspense that relies on psychological mystery rather than action.`
      case "Moon":
        return `Matches your search for ${queryText}. A beautiful, isolated character study of an astronaut nearing the end of his lunar shift. It aligns with your search for atmospheric, quiet sci-fi with a human soul.`
      default:
        return `Matches your search for ${queryText}. Curated by our AI engine because its underlying emotional themes, genre mixture, and storytelling tempo mathematically align with your input intent.`
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

              {/* Movie Matches List */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-[var(--color-gold)]" />
                    AI Direct Matches
                  </h3>
                  <span className="text-xs text-[var(--color-text-secondary)]">Semantic search completed</span>
                </div>

                {results.map((movie, idx) => (
                  <motion.div 
                    key={movie.id}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="group relative bg-[#0d0d0d]/70 border border-white/5 rounded-2xl p-5 hover:border-[var(--color-gold)]/20 hover:shadow-[0_0_30px_rgba(212,175,55,0.03)] transition-all duration-300 overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      {/* Poster */}
                      <Link to={`/movie/${movie.id}`} className="w-32 md:w-40 shrink-0 rounded-xl overflow-hidden shadow-xl border border-white/5 block aspect-[2/3]">
                        <img 
                          src={movie.posterUrl} 
                          alt={movie.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                      </Link>

                      {/* Info */}
                      <div className="flex-1 py-0.5 w-full">
                        <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                          <span className="bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 text-[var(--color-gold)] px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                            {movie.matchScore ? movie.matchScore : 90}% Semantic Match
                          </span>
                          <span className="text-[10px] text-[var(--color-text-secondary)] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                            {movie.year}
                          </span>
                          <span className="text-[10px] text-[var(--color-text-secondary)] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" /> {movie.runtime}
                          </span>
                        </div>

                        <Link to={`/movie/${movie.id}`}>
                          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mb-1.5 hover:text-[var(--color-gold)] transition-colors">
                            {movie.title}
                          </h2>
                        </Link>

                        <p className="text-[11px] text-gray-500 mb-3 font-sans">
                          Director: <strong className="text-gray-400 font-semibold">{movie.director}</strong> • Starring: <span className="text-gray-400">{movie.actors?.slice(0, 3).join(", ")}</span>
                        </p>

                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
                          {movie.overview}
                        </p>

                        {/* AI Rationale Block */}
                        <div className="bg-gradient-to-br from-[#12110e] to-[#0a0a0a] border border-[var(--color-gold)]/10 rounded-xl p-3.5 flex gap-3 relative overflow-hidden">
                          <Brain className="h-4 w-4 text-[var(--color-gold)] shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[10px] text-[var(--color-gold)] uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                              Match Reasoning
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed font-light">
                              {getDynamicReasoning(movie.title)}
                            </p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between flex-wrap gap-3">
                          <Link 
                            to={`/movie/${movie.id}`} 
                            className="text-[10px] text-[var(--color-gold)] hover:text-white font-bold tracking-wide uppercase transition-colors flex items-center gap-1.5"
                          >
                            <Eye className="h-3.5 w-3.5" /> View Cinematic Profile
                          </Link>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" className="h-7 text-[10px] border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white">
                              Already Seen
                            </Button>
                            <Button size="sm" className="h-7 text-[10px] bg-[var(--color-gold)] hover:bg-[#b5952f] text-black">
                              Save Match
                            </Button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </motion.div>
                ))}
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
              <h3 className="text-lg font-serif font-bold text-white mb-1.5">No semantic matches found</h3>
              <p className="text-xs text-[var(--color-text-secondary)] mb-5">
                We couldn't analyze the query confidently. Try describing a simpler idea or a favorite movie name.
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
