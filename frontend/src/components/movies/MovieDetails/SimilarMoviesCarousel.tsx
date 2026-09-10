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
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-6 py-8 text-left w-full border-t border-white/[0.06]"
      aria-labelledby="similar-movies-heading"
    >
      <div className="flex items-center gap-2.5 pb-1">
        <div className="p-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[#C5A059]">
          <Film className="h-4 w-4" />
        </div>
        <h2 id="similar-movies-heading" className="text-[11px] uppercase tracking-[0.25em] text-zinc-400 font-medium font-mono">
          ✦ Similar Cinematic Vectors
        </h2>
      </div>

      <div className="relative overflow-hidden w-full group/carousel">
        <div className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4 px-1 snap-x">
          {similarMovies.map((movie, idx) => (
            <div key={movie.id} className="w-40 shrink-0 snap-start">
              <MovieCard movie={movie} idx={idx} />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
