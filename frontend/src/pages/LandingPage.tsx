import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search } from "lucide-react"
import { MOCK_MOVIES } from "../lib/mock-data"
import { useAuth } from "../context/AuthContext"
import { useTaste } from "../context/UserTasteContext"

export function LandingPage() {
  const { isAuthenticated } = useAuth()
  const { metrics } = useTaste()
  const activeMovieIndex = 0
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string>("All")

  const activeMovie = MOCK_MOVIES[activeMovieIndex]
  
  const displayGenres = ["All", "Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Thriller", "Romance", "Animation", "Documentary", "Fantasy", "Crime", "Adventure"]

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeMovieIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0"
          >
            <img 
              src={activeMovie.backdropUrl || activeMovie.posterUrl} 
              alt="Hero background" 
              className="w-full h-full object-cover object-top opacity-40"
            />
            {/* Gradient to match the reference image (darker on bottom and left) */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
          </motion.div>
        </AnimatePresence>
        
        <div className="container relative z-10 mx-auto px-4 md:px-8 mt-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-[var(--color-gold)] font-bold tracking-widest text-sm mb-4 uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--color-gold)] animate-pulse" /> AI-Powered Movie Discovery
              </h2>
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif font-bold tracking-tight mb-6 text-white leading-tight">
                Your Taste. <br />Understood.
              </h1>
              <p className="text-lg md:text-2xl text-gray-400 mb-10 max-w-xl font-light">
                Stop scrolling. Start watching smarter with mathematical taste matching.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative max-w-2xl mb-12"
            >
              <div className="relative flex items-center w-full bg-white/5 border border-white/10 rounded-lg overflow-hidden backdrop-blur-sm focus-within:ring-1 focus-within:ring-white/30 transition-all">
                <Search className="absolute left-4 h-5 w-5 text-gray-500" />
                <input 
                  type="text"
                  placeholder="Search films..." 
                  className="w-full bg-transparent text-white pl-12 pr-4 py-4 outline-none placeholder:text-gray-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Genre Pills */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              {displayGenres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                    selectedGenre === genre 
                      ? "bg-[var(--color-gold)] text-black shadow-lg shadow-[var(--color-gold)]/20" 
                      : "bg-[#1c1c1e] text-gray-300 hover:bg-[#2c2c2e] hover:text-white"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Taste Snapshot Panel */}
        {isAuthenticated && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 w-80 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
          >
            <div className="mb-6 border-b border-white/10 pb-4">
              <h3 className="text-[var(--color-gold)] font-bold tracking-widest text-xs uppercase mb-1">Taste Snapshot</h3>
              <p className="text-white text-lg font-serif">Your Profile</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Favorite Genre</div>
                <div className="text-xl font-bold text-white">Sci-Fi</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Movies Rated</div>
                <div className="text-xl font-bold text-white">{metrics.totalRated}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Recommendation Confidence</div>
                <div className="text-xl font-bold text-green-400">{metrics.confidence > 70 ? "High" : "Learning"} ({metrics.confidence}%)</div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-500 uppercase tracking-wider mb-2">
                  <span>Profile Completion</span>
                  <span className="text-[var(--color-gold)]">{metrics.profileStrength}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--color-gold)]" style={{ width: `${metrics.profileStrength}%` }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  )
}
