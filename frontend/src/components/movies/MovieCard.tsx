import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Star, Eye, EyeOff } from "lucide-react"
import { useTaste } from "../../context/UserTasteContext"

type MovieCardProps = {
  movie: {
    id: string
    title: string
    year: number
    posterUrl: string
    rating: number
    genres: string[]
    matchScore?: number
  }
  idx?: number
  showActions?: boolean
}

export function MovieCard({ movie, idx = 0, showActions = false }: MovieCardProps) {
  const { isDismissed, getRatingForMovie, dismissMovie } = useTaste()

  if (isDismissed(movie.id)) {
    return null
  }

  const userRating = getRatingForMovie(movie.id)

  return (
    <motion.div 
      key={movie.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.05 }}
      className="group relative flex flex-col gap-3"
    >
      <Link to={`/movie/${movie.id}`} className="block">
        <div className="aspect-[2/3] rounded-xl overflow-hidden relative border border-white/5 bg-black/40 shadow-lg">
          <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Eye className="h-12 w-12 text-white/50" />
          </div>

          {movie.matchScore && (
            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-xs font-bold text-[var(--color-gold)] border border-white/10 shadow-xl">
              {movie.matchScore}% Match
            </div>
          )}

          {userRating && (
            <div className="absolute top-3 left-3 bg-[var(--color-gold)]/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-xs font-bold text-black shadow-xl flex items-center gap-1">
              <Star className="h-3 w-3 fill-black" />
              {userRating}
            </div>
          )}
        </div>
      </Link>
      
      <div className="flex justify-between items-start mt-1">
        <div>
          <Link to={`/movie/${movie.id}`}>
            <h3 className="font-bold text-base truncate group-hover:text-[var(--color-gold)] transition-colors">{movie.title}</h3>
          </Link>
          <p className="text-xs text-gray-400 mt-1">{movie.year} • {movie.genres[0]}</p>
        </div>
        
        {showActions && (
          <button 
            onClick={(e) => {
              e.preventDefault()
              dismissMovie(movie.id, "not_interested")
            }}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-gray-500 hover:text-white"
            title="Not Interested"
          >
            <EyeOff className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  )
}
