import { useParams, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Clock, Calendar, Info, CheckCircle2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { MOCK_MOVIES } from "../lib/mock-data"
import { useState } from "react"

export function MovieDetailsPage() {
  const { id } = useParams()
  const movie = MOCK_MOVIES.find(m => m.id === id) || MOCK_MOVIES[0]
  const similarMovies = MOCK_MOVIES.filter(m => m.id !== movie.id && m.genres.some(g => movie.genres.includes(g))).slice(0, 5)
  
  const [userRating, setUserRating] = useState<number | null>(null)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [showMatchExplain, setShowMatchExplain] = useState(false)

  return (
    <div className="flex flex-col pb-24">
      {/* Hero */}
      <section className="relative h-[80vh] flex items-end pb-12">
        <div className="absolute inset-0 z-0">
          <img 
            src={movie.backdropUrl || movie.posterUrl} 
            alt={`${movie.title} backdrop`} 
            className="w-full h-full object-cover object-top opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-[var(--color-background)]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-background)] via-[var(--color-background)]/50 to-transparent" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-end text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-36 md:w-48 shrink-0 rounded-xl overflow-hidden shadow-2xl border border-white/10"
          >
            <img src={movie.posterUrl} alt={movie.title} className="w-full h-auto" />
          </motion.div>
          
          <div className="max-w-3xl pb-4 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-4"
            >
              <div className="flex items-center gap-1 bg-black/60 px-3 py-1.5 rounded-full border border-white/10 text-sm font-bold text-[var(--color-gold)]">
                <Star className="h-4 w-4 fill-[var(--color-gold)]" />
                {movie.rating.toFixed(1)}
              </div>
              {movie.matchScore && (
                <div 
                  onClick={() => setShowMatchExplain(!showMatchExplain)}
                  className="bg-[var(--color-gold)]/20 text-[var(--color-gold)] px-3 py-1.5 rounded-full border border-[var(--color-gold)]/30 text-sm font-bold cursor-pointer hover:bg-[var(--color-gold)]/30 transition-colors flex items-center gap-2"
                >
                  {movie.matchScore}% Match <Info className="h-4 w-4" />
                </div>
              )}
            </motion.div>

            <AnimatePresence>
              {showMatchExplain && movie.matchScore && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-6"
                >
                  <div className="bg-black/60 backdrop-blur-md border border-[var(--color-gold)]/20 p-5 rounded-xl flex flex-col gap-4 text-left">
                    <div className="text-xs text-[var(--color-gold)] uppercase font-bold tracking-widest mb-1">Why This Match?</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] mt-1.5 shrink-0" />
                        <div className="text-sm text-gray-300">You consistently rate <strong>{movie.genres[0]}</strong> highly, making this a strong genre match.</div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] mt-1.5 shrink-0" />
                        <div className="text-sm text-gray-300">Users with identical taste clusters to yours loved this film.</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight"
            >
              {movie.title}
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-2 text-[var(--color-text-secondary)] mb-6"
            >
              <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {movie.year}</div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> {movie.runtime}</div>
              <div className="flex items-center gap-2">
                {movie.genres.map(g => (
                  <span key={g} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs text-white">{g}</span>
                ))}
              </div>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base md:text-lg text-[var(--color-text-secondary)] mb-8 max-w-2xl"
            >
              {movie.overview}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col md:flex-row items-center gap-6"
            >
              <div className="bg-[#0f0f0f]/80 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center gap-4">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Your Rating</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setUserRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="text-white hover:text-[var(--color-gold)] transition-colors focus:outline-none"
                    >
                      <Star 
                        className={`h-6 w-6 ${(hoverRating || userRating || 0) >= star ? "fill-[var(--color-gold)] text-[var(--color-gold)] scale-110" : ""} transition-all`} 
                      />
                    </button>
                  ))}
                </div>
                {userRating && <CheckCircle2 className="h-5 w-5 text-green-500 ml-2" />}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" size="default" className="border-[var(--color-gold)]/20 hover:bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
                  <Star className="mr-2 h-4 w-4" /> Add Rating
                </Button>
                <Button variant="ghost" size="default" className="hover:bg-white/5 text-white border border-white/10">
                  Improve Profile
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recommended Based on This */}
      <section className="container mx-auto px-4 mt-12 mb-12">
        <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-4">
          <Star className="h-5 w-5 text-[var(--color-gold)]" />
          <h2 className="text-2xl font-serif font-bold tracking-tight">Similar Taste Vectors</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {similarMovies.map((movie, idx) => (
            <motion.div 
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group flex flex-col gap-3"
            >
              <Link to={`/movie/${movie.id}`} className="block h-full">
                <div className="aspect-[2/3] rounded-xl overflow-hidden relative border border-white/5 bg-black/40 shadow-lg">
                  <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  {movie.matchScore && (
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-xs font-bold text-[var(--color-gold)] border border-white/10 shadow-xl">
                      {movie.matchScore}% Match
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="font-bold text-base truncate group-hover:text-[var(--color-gold)] transition-colors">{movie.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{movie.year} • {movie.genres[0]}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
