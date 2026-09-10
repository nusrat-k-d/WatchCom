import React, { useRef } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Star, Eye, EyeOff } from "lucide-react"
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
    
    // Smooth 3D tilt
    const rotateX = -mouseY / (height / 14)
    const rotateY = mouseX / (width / 14)
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`
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
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: idx * 0.03, ease: "easeOut" }}
      className="group relative flex flex-col gap-2.5"
    >
      <Link 
        to={`/movie/${movie.id}`} 
        state={movie.matchScore || movie.reason ? { 
          aiInsight: { 
            matchScore: movie.matchScore, 
            confidence: movie.confidence, 
            reason: movie.reason, 
            tags: movie.tags 
          } 
        } : undefined}
        className="block select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C5A059] rounded-2xl"
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
          className="aspect-[2/3] rounded-2xl overflow-hidden relative border border-white/[0.08] bg-[#0c0c10] group-hover:border-[#C5A059]/40 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.9),0_0_25px_rgba(197,160,89,0.12)] transition-all duration-300"
        >
          {/* Subtle Glare overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <LazyImage 
            src={movie.posterUrl} 
            alt={movie.title} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" 
          />
          
          {/* Action Hover Glass Overlay */}
          <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
            <div className="p-3 rounded-full bg-white/10 border border-white/20 text-white scale-90 group-hover:scale-100 transition-transform duration-300 shadow-xl">
              <Eye className="h-5 w-5" />
            </div>
          </div>

          {/* Single, Clean AI Match Score Badge (Top Right) */}
          {movie.matchScore !== undefined && movie.matchScore > 0 && (
            <div className="absolute top-2.5 right-2.5 bg-[#09090c]/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-[#C5A059] border border-[#C5A059]/30 shadow-md">
              {movie.matchScore}% Match
            </div>
          )}

          {/* User Rating Badge (Top Left) */}
          {userRating && (
            <div className="absolute top-2.5 left-2.5 bg-[#C5A059] text-black px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md flex items-center gap-1">
              <Star className="h-2.5 w-2.5 fill-black" />
              <span>{userRating}</span>
            </div>
          )}
        </div>
      </Link>
      
      {/* Movie Details Info (Clean, Uncluttered, Premium) */}
      <div className="flex flex-col gap-1 px-1 text-left w-full">
        <div className="flex justify-between items-start w-full gap-2">
          <div className="min-w-0 flex-1">
            <Link 
              to={`/movie/${movie.id}`}
              state={movie.matchScore || movie.reason ? { 
                aiInsight: { 
                  matchScore: movie.matchScore, 
                  confidence: movie.confidence, 
                  reason: movie.reason, 
                  tags: movie.tags 
                } 
              } : undefined}
              className="focus-visible:underline outline-none"
            >
              <h3 className="font-serif font-medium text-sm text-[#F0EDE6] group-hover:text-[#C5A059] transition-colors duration-200 truncate">
                {movie.title}
              </h3>
            </Link>
            
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-sans mt-0.5">
              <span>{movie.year}</span>
              <span className="text-zinc-600">•</span>
              <div className="flex items-center gap-1">
                <Star className="h-2.5 w-2.5 fill-[#C5A059] text-[#C5A059]" />
                <span className="text-zinc-200 font-medium">{movie.rating ? movie.rating.toFixed(1) : "N/A"}</span>
              </div>
              {movie.genres && movie.genres[0] && (
                <>
                  <span className="text-zinc-600">•</span>
                  <span className="truncate text-zinc-400 max-w-[90px]">{movie.genres[0]}</span>
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
              className="p-1 hover:bg-white/10 rounded-full transition-colors text-zinc-500 hover:text-white shrink-0 cursor-pointer outline-none"
              title="Not Interested"
              aria-label={`Dismiss ${movie.title} from recommendations`}
            >
              <EyeOff className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
})
