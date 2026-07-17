import React, { useRef } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Star, Eye, EyeOff, Clock } from "lucide-react"
import { useTaste } from "../../context/UserTasteContext"
import { LazyImage } from "../ui/LazyImage"

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
    confidence?: string
    reason?: string
    tags?: string[]
  }
  idx?: number
  showActions?: boolean
}

export const MovieCard = React.memo(function MovieCard({ movie, idx = 0, showActions = false }: MovieCardProps) {
  const { isDismissed, getRatingForMovie, dismissMovie } = useTaste()
  const cardRef = useRef<HTMLDivElement>(null)

  if (isDismissed(movie.id)) {
    return null
  }

  const userRating = getRatingForMovie(movie.id)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left - width / 2
    const mouseY = e.clientY - rect.top - height / 2
    
    // Limits tilt to ~8 degrees max
    const rotateX = -mouseY / (height / 16)
    const rotateY = mouseX / (width / 16)
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: idx * 0.04, ease: "easeOut" }}
      className="group relative flex flex-col gap-3"
      style={{ willChange: "transform, opacity" }}
    >
      <Link 
        to={`/movie/${movie.id}`} 
        state={{ 
          aiInsight: { 
            matchScore: movie.matchScore, 
            confidence: movie.confidence, 
            reason: movie.reason, 
            tags: movie.tags 
          } 
        }}
        className="block select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2 rounded-2xl"
        aria-label={`View details for ${movie.title}`}
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ 
            transformStyle: "preserve-3d",
            perspective: 1000,
            transition: "transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)",
            willChange: "transform"
          }}
          className="aspect-[2/3] rounded-2xl overflow-hidden relative border border-white/5 bg-[#0b0b0c] group-hover:border-[#C9A227]/30 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.7),0_0_25px_rgba(201,162,39,0.15)]"
        >
          {/* Glare effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <LazyImage 
            src={movie.posterUrl} 
            alt={movie.title} 
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
        </div>
      </Link>
      
      {/* Movie Details Info */}
      <div className="flex flex-col gap-2 px-1 text-left w-full">
        <div className="flex justify-between items-start w-full">
          <div className="min-w-0 flex-1">
            <Link 
              to={`/movie/${movie.id}`}
              state={{ 
                aiInsight: { 
                  matchScore: movie.matchScore, 
                  confidence: movie.confidence, 
                  reason: movie.reason, 
                  tags: movie.tags 
                } 
              }}
              className="focus-visible:underline outline-none"
            >
              <h3 className="font-serif font-bold text-sm text-white group-hover:text-[#C9A227] transition-colors duration-300 truncate">
                {movie.title}
              </h3>
            </Link>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-gray-500 mt-1 font-light">
              <span>{movie.year}</span>
              <span>•</span>
              <div className="flex items-center gap-0.5" aria-label={`Average rating: ${movie.rating.toFixed(1)} out of 5`}>
                <Star className="h-2.5 w-2.5 fill-[#C9A227] text-[#C9A227]" />
                <span className="text-white font-semibold">{movie.rating.toFixed(1)}</span>
              </div>
              {movie.runtime && movie.runtime !== "N/A" && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-0.5" aria-label={`Runtime: ${movie.runtime}`}>
                    <Clock className="h-2.5 w-2.5 text-gray-600" />
                    <span>{movie.runtime.replace(" min", "m")}</span>
                  </div>
                </>
              )}
              {movie.matchScore !== undefined && movie.matchScore > 0 && (
                <span className="text-[#C9A227] font-bold font-mono ml-auto">
                  {movie.matchScore}% Match
                </span>
              )}
            </div>
            
            {/* Confidence badge (clean and simplified) */}
            {movie.confidence && (
              <div className="mt-2">
                <span className="inline-block text-[9px] font-mono font-bold tracking-wider uppercase text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                  {movie.confidence}
                </span>
              </div>
            )}
          </div>
          
          {showActions && (
            <button 
              onClick={(e) => {
                e.preventDefault()
                dismissMovie(movie.id, "not_interested")
              }}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-gray-500 hover:text-white shrink-0 ml-2 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A227]"
              title="Not Interested"
              aria-label={`Dismiss ${movie.title} from recommendations`}
            >
              <EyeOff className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
})
