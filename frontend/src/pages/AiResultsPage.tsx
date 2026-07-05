import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Sparkles, ArrowLeft, Clock, Brain, RefreshCw } from "lucide-react"
import { MOCK_MOVIES } from "../lib/mock-data"
import type { Movie } from "../lib/mock-data"
import { Button } from "../components/ui/button"

export function AiResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchInput, setSearchInput] = useState(query)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingStep, setLoadingStep] = useState(0)
  const [results, setResults] = useState<Movie[]>([])

  const loadingTexts = [
    "Analyzing semantic intent...",
    "Querying taste profile & vectors...",
    "Scanning cinematic database...",
    "Evaluating thematic coherence...",
    "Generating AI recommendations..."
  ]

  // Mock AI matching engine
  useEffect(() => {
    if (!query) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setLoadingStep(0)

    // Cycle through loading steps to look premium
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < loadingTexts.length - 1) {
          return prev + 1
        }
        clearInterval(stepInterval)
        return prev
      })
    }, 400)

    const timer = setTimeout(() => {
      const lowerQuery = query.toLowerCase()
      let matchedMovies: Movie[] = []

      // Simple rule-based mock semantic matcher
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
        // Return sci-fi focus
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
        // Return thriller/mystery focus
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
        // Return lighter/musical/high match
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
        // Return drama/emotional
        matchedMovies = MOCK_MOVIES.filter(m => 
          m.genres.includes("Drama") || 
          m.title === "Interstellar" || 
          m.title === "Whiplash"
        )
      } else if (lowerQuery.includes("underrated") || lowerQuery.includes("gem") || lowerQuery.includes("hidden")) {
        matchedMovies = MOCK_MOVIES.filter(m => m.discoveryScore && m.discoveryScore > 90)
      } else {
        // Default curated list
        matchedMovies = [MOCK_MOVIES[0], MOCK_MOVIES[1], MOCK_MOVIES[7], MOCK_MOVIES[8]]
      }

      // Fallback if none found
      if (matchedMovies.length === 0) {
        matchedMovies = MOCK_MOVIES.slice(0, 4)
      }

      setResults(matchedMovies)
      setIsLoading(false)
    }, 2000)

    return () => {
      clearInterval(stepInterval)
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
        <div className="max-w-3xl mx-auto mb-16 text-center">
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
                className="absolute right-3 bg-[var(--color-gold)] hover:bg-[#b5952f] text-black px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-[var(--color-gold)]/20"
              >
                Refine
              </button>
            </div>
          </form>
          <p className="text-xs text-[var(--color-text-secondary)] font-light italic">
            Currently analyzing: <span className="text-gray-300 font-normal">"{query}"</span>
          </p>
        </div>

        {/* Results / Loading Container */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 border-2 border-[var(--color-gold)]/10 rounded-full" />
                <motion.div 
                  className="absolute inset-0 border-2 border-t-[var(--color-gold)] border-r-[var(--color-gold)] rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                />
                <Brain className="absolute inset-0 m-auto h-8 w-8 text-[var(--color-gold)] animate-pulse" />
              </div>
              <motion.p 
                key={loadingStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-lg font-medium text-[var(--color-gold)] tracking-wide font-serif h-8 text-center"
              >
                {loadingTexts[loadingStep]}
              </motion.p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-2 font-light text-center">
                Consulting WatchCom taste matrix models...
              </p>
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto space-y-10"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <h3 className="text-xl font-serif font-bold tracking-wide flex items-center gap-2 text-white">
                  <Sparkles className="h-5 w-5 text-[var(--color-gold)]" />
                  We found {results.length} perfect matches
                </h3>
                <span className="text-xs text-[var(--color-text-secondary)]">Sorted by Semantic Alignment</span>
              </div>

              {results.map((movie, idx) => (
                <motion.div 
                  key={movie.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className="group relative bg-[#0d0d0d]/80 border border-white/5 rounded-2xl p-6 hover:border-[var(--color-gold)]/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.04)] transition-all duration-500 overflow-hidden"
                >
                  {/* Subtle luxury glow inside card */}
                  <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.02),transparent_70%)] pointer-events-none" />

                  <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                    {/* Poster */}
                    <Link to={`/movie/${movie.id}`} className="w-full md:w-48 shrink-0 rounded-xl overflow-hidden shadow-2xl border border-white/5 block aspect-[2/3]">
                      <img 
                        src={movie.posterUrl} 
                        alt={movie.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    </Link>

                    {/* Movie info */}
                    <div className="flex-1 py-1 w-full">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/30 text-[var(--color-gold)] px-3 py-1 rounded-full font-bold text-xs">
                          {movie.matchScore ? movie.matchScore : 90}% Semantic Match
                        </span>
                        <span className="text-xs text-[var(--color-text-secondary)] bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                          {movie.year}
                        </span>
                        <span className="text-xs text-[var(--color-text-secondary)] bg-white/5 border border-white/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {movie.runtime}
                        </span>
                      </div>

                      <Link to={`/movie/${movie.id}`}>
                        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2 hover:text-[var(--color-gold)] transition-colors">
                          {movie.title}
                        </h2>
                      </Link>

                      <p className="text-xs text-gray-500 mb-4 font-sans">
                        Directed by <strong className="text-gray-300 font-semibold">{movie.director}</strong> • Starring <span className="text-gray-300">{movie.actors?.slice(0, 3).join(", ")}</span>
                      </p>

                      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
                        {movie.overview}
                      </p>

                      {/* AI Reasoning Container */}
                      <div className="bg-gradient-to-br from-[#12110e] to-[#0c0c0c] border border-[var(--color-gold)]/15 rounded-xl p-4 flex gap-3.5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03),transparent_70%)] pointer-events-none" />
                        <Brain className="h-5 w-5 text-[var(--color-gold)] shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs text-[var(--color-gold)] uppercase font-bold tracking-widest mb-1.5 flex items-center gap-1.5">
                            AI Recommendation Logic
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed font-light">
                            {getDynamicReasoning(movie.title)}
                          </p>
                        </div>
                      </div>

                      {/* Card actions */}
                      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between flex-wrap gap-4">
                        <Link 
                          to={`/movie/${movie.id}`} 
                          className="text-xs text-[var(--color-gold)] hover:text-white font-bold tracking-wide uppercase transition-colors"
                        >
                          View Cinematic Profile
                        </Link>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="h-8 text-xs border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white">
                            Already Seen
                          </Button>
                          <Button size="sm" className="h-8 text-xs bg-[var(--color-gold)] hover:bg-[#b5952f] text-black">
                            Save Recommendation
                          </Button>
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Retry suggestion */}
              <div className="pt-8 text-center">
                <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                  Not quite what you were looking for? Try describing different aspects of your mood.
                </p>
                <Button 
                  onClick={() => {
                    setSearchInput("")
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }}
                  variant="outline" 
                  className="border-white/15 hover:bg-white/5 text-white"
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> Reset Search
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 max-w-md mx-auto"
            >
              <Brain className="h-12 w-12 text-[var(--color-gold)] mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-serif font-bold text-white mb-2">No direct semantic matches</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                Our models couldn't confidently map "{query}" to our current dataset. Try using broader terms or describing a movie you like.
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
