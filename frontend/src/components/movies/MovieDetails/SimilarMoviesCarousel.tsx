import { motion } from "framer-motion"
import { Film } from "lucide-react"
import { MovieCard } from "../MovieCard"
import type { Movie } from "../../../lib/mock-data"

interface SimilarMoviesCarouselProps {
  similarMovies: Movie[]
}

export function SimilarMoviesCarousel({ similarMovies }: SimilarMoviesCarouselProps) {
  if (similarMovies.length === 0) return null

  return (
    <motion.section 
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="space-y-8 py-10 text-left w-full border-t border-white/5"
      aria-labelledby="similar-movies-heading"
    >
      <div className="flex items-center gap-3 pb-2">
        <div className="p-2 bg-white/5 border border-white/10 rounded-lg">
          <Film className="h-4 w-4 text-gray-400" />
        </div>
        <h2 id="similar-movies-heading" className="text-xs uppercase tracking-widest text-gray-400 font-bold font-mono">
          🎬 Similar Taste Vectors
        </h2>
      </div>

      <div className="relative overflow-hidden w-full group/carousel">
        {/* Soft edge blur overlays */}
        <div className="absolute top-0 left-0 bottom-0 w-12 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300" />
        
        <div className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-6 px-1 snap-x">
          {similarMovies.map((movie, idx) => (
            <div key={movie.id} className="w-44 shrink-0 snap-start">
              <MovieCard movie={movie} idx={idx} />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
