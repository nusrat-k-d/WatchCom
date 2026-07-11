import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Star, Eye, EyeOff, Clock } from "lucide-react"
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
    runtime?: string
  }
  idx?: number
  showActions?: boolean
}

export function MovieCard({ movie, idx = 0, showActions = false }: MovieCardProps) {
  const { isDismissed, getRatingForMovie, dismissMovie } = useTaste()
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  if (isDismissed(movie.id)) {
    return null
  }

  const userRating = getRatingForMovie(movie.id)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left - width / 2
    const mouseY = e.clientY - rect.top - height / 2
    
    // Limits tilt to ~8 degrees max
    setRotateX(-mouseY / (height / 16))
    setRotateY(mouseX / (width / 16))
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: idx * 0.04, ease: "easeOut" }}
      className="group relative flex flex-col gap-3"
    >
      <Link to={`/movie/${movie.id}`} className="block select-none">
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ 
            rotateX, 
            rotateY, 
            transformStyle: "preserve-3d",
            perspective: 1000 
          }}
          animate={{ rotateX, rotateY }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          whileHover={{ 
            scale: 1.03, 
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(201, 162, 39, 0.15)"
          }}
          className="aspect-[2/3] rounded-2xl overflow-hidden relative border border-white/5 bg-[#0b0b0c] transition-colors duration-300 group-hover:border-[#C9A227]/30"
        >
          {/* Glare effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <img 
            src={movie.posterUrl} 
            alt={movie.title} 
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]" 
          />
          
          {/* Action Hover Glass Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
            <div className="p-3.5 rounded-full bg-white/10 border border-white/20 text-white/90 scale-90 group-hover:scale-100 transition-transform duration-300">
              <Eye className="h-6 w-6" />
            </div>
          </div>

          {/* AI Match % Badge */}
          {movie.matchScore !== undefined && movie.matchScore > 0 && (
            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#C9A227] border border-[#C9A227]/20 shadow-lg tracking-wider">
              {movie.matchScore}% Match
            </div>
          )}

          {/* User Score Badge */}
          {userRating && (
            <div className="absolute top-3 left-3 bg-[#C9A227] text-black px-2.5 py-1 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1">
              <Star className="h-3 w-3 fill-black" />
              {userRating}
            </div>
          )}
        </motion.div>
      </Link>
      
      {/* Movie Details Info */}
      <div className="flex justify-between items-start px-1">
        <div className="min-w-0 flex-1">
          <Link to={`/movie/${movie.id}`}>
            <h3 className="font-serif font-bold text-base truncate text-white hover:text-[#C9A227] transition-colors duration-300">
              {movie.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 font-light">
            <span>{movie.year}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-gray-600 text-gray-600" />
              <span>{movie.rating.toFixed(1)}</span>
            </div>
            {movie.runtime && movie.runtime !== "N/A" && (
              <>
                <span>•</span>
                <div className="flex items-center gap-0.5">
                  <Clock className="h-3 w-3 text-gray-600" />
                  <span>{movie.runtime.replace(" min", "m")}</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        {showActions && (
          <button 
            onClick={(e) => {
              e.preventDefault()
              dismissMovie(movie.id, "not_interested")
            }}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-gray-500 hover:text-white shrink-0 ml-2"
            title="Not Interested"
          >
            <EyeOff className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  )
}
