import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Calendar, Clock, Globe, BarChart3, Users, ChevronLeft, Info, Brain } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTaste } from "../../../context/UserTasteContext"
import { LazyImage } from "../../ui/LazyImage"
import { TrailerButton } from "./TrailerButton"
import type { AICinematicData } from "../../../lib/ai-profile"

interface Genre {
  id: number
  name: string
}

interface MovieDetails {
  id: number
  title: string
  tagline?: string
  overview: string
  backdrop_path?: string
  poster_path?: string
  release_date?: string
  runtime?: number
  vote_average?: number
  vote_count?: number
  original_language?: string
  popularity?: number
  genres?: Genre[]
}

interface HeroSectionProps {
  movieDetails: MovieDetails
  aiData: AICinematicData
  matchScore: number | null
  trailerUrl: string | null
}

export function HeroSection({ movieDetails, aiData, matchScore, trailerUrl }: HeroSectionProps) {
  const navigate = useNavigate()
  const { getRatingForMovie, rateMovie } = useTaste()
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [showMatchExplain, setShowMatchExplain] = useState(false)
  const posterRef = useRef<HTMLDivElement>(null)

  const movieIdStr = String(movieDetails.id)
  const userRating = getRatingForMovie(movieIdStr)
  
  const releaseYear = movieDetails.release_date ? parseInt(movieDetails.release_date.split("-")[0], 10) : "N/A"

  const backdropUrl = movieDetails.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}` 
    : `https://image.tmdb.org/t/p/w500${movieDetails.poster_path || ""}`

  const posterUrl = movieDetails.poster_path 
    ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${movieDetails.poster_path}` 
    : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500"

  // 3D Tilt Effect on Poster
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = posterRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left - width / 2
    const mouseY = e.clientY - rect.top - height / 2
    
    const rotateX = -mouseY / (height / 20)
    const rotateY = mouseX / (width / 20)
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
  }

  const handleMouseLeave = () => {
    const card = posterRef.current
    if (!card) return
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
  }

  return (
    <section className="relative min-h-[90vh] md:h-[95vh] flex items-end pt-24 pb-16 overflow-hidden border-b border-white/5 bg-[#050505]">
      {/* 1. Cinematic Parallax Backdrop with Blur Mask */}
      <div className="absolute inset-0 z-0">
        <LazyImage 
          src={backdropUrl} 
          alt={`${movieDetails.title} Backdrop`} 
          className="w-full h-full object-cover object-top opacity-30 scale-[1.03]"
        />
        {/* Subtle Vignette & Dark Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/75 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] z-0" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-20 w-full">
        {/* Back navigation */}
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-gray-500 hover:text-[#C9A227] transition-colors mb-8 group cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A227]"
          aria-label="Go back to previous page"
        >
          <ChevronLeft className="h-4.5 w-4.5 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-end text-center lg:text-left">
          
          {/* 2. Floating Movie Poster with 3D Physics */}
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-48 sm:w-60 md:w-72 shrink-0 select-none group"
          >
            <div
              ref={posterRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ 
                transformStyle: "preserve-3d", 
                perspective: 1000,
                transition: "transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)",
                willChange: "transform"
              }}
              className="rounded-3xl overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.9)] border border-white/10 bg-[#0b0b0c] relative cursor-pointer"
            >
              <LazyImage src={posterUrl} alt={movieDetails.title} className="w-full h-auto object-cover aspect-[2/3] scale-101 group-hover:scale-102 transition-transform duration-700" />
            </div>
          </motion.div>

          {/* 3. Luxury Typography Title & Metadata */}
          <div className="flex-1 w-full flex flex-col items-center lg:items-start">
            
            {/* Badges (Ratings, Match score) */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap justify-center lg:justify-start items-center gap-3.5 mb-5"
            >
              <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs font-bold text-[#C9A227] tracking-wider">
                <Star className="h-4 w-4 fill-[#C9A227] text-[#C9A227]" />
                {(movieDetails.vote_average ? movieDetails.vote_average / 2 : 0).toFixed(1)} / 5
              </div>
              
              {matchScore !== null && (
                <button 
                  onClick={() => setShowMatchExplain(!showMatchExplain)}
                  className="bg-[#C9A227]/10 text-[#C9A227] hover:bg-[#C9A227]/20 px-4 py-2 rounded-full border border-[#C9A227]/20 text-xs font-bold cursor-pointer transition-colors flex items-center gap-2 tracking-wider focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A227]"
                  aria-label="View AI match explanation"
                >
                  {matchScore}% Match <Info className="h-3.5 w-3.5" />
                </button>
              )}
            </motion.div>

            {/* Match Explanation Overlay */}
            <AnimatePresence>
              {showMatchExplain && matchScore !== null && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: 10, height: 0 }}
                  className="overflow-hidden w-full max-w-lg mb-6"
                >
                  <div className="bg-[#0b0b0c]/95 backdrop-blur-2xl border border-[#C9A227]/25 p-5 rounded-2xl flex flex-col gap-2.5 text-left shadow-2xl">
                    <h4 className="text-xs text-[#C9A227] uppercase font-bold tracking-widest flex items-center gap-1.5 font-mono">
                      <Brain className="h-3.5 w-3.5" /> AI Intent Alignment
                    </h4>
                    <p className="text-xs text-gray-300 font-light leading-relaxed">
                      WatchCom calculated this match vector based on your interest patterns in {movieDetails.genres?.[0]?.name || "this genre"}. It aligns with your affinity for {aiData.moodTags.slice(0, 2).join(" & ")} storytelling.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Movie Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-4 text-white leading-none uppercase"
            >
              {movieDetails.title}
            </motion.h1>

            {/* Tagline */}
            {movieDetails.tagline && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-lg sm:text-2xl italic text-[#C9A227]/85 mb-6 font-light max-w-2xl font-serif"
              >
                "{movieDetails.tagline}"
              </motion.p>
            )}

            {/* Inline metadata details */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap justify-center lg:justify-start items-center gap-x-5 gap-y-2.5 text-sm text-gray-400 mb-8 font-light"
            >
              <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-gray-500" /> {releaseYear}</div>
              <span>•</span>
              <div className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-gray-500" /> {movieDetails.runtime ? `${movieDetails.runtime} min` : "N/A"}</div>
              <span>•</span>
              <div className="flex flex-wrap gap-2">
                {movieDetails.genres?.map((g) => (
                  <span key={g.id} className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs text-white font-medium">{g.name}</span>
                ))}
              </div>
            </motion.div>

            {/* Action Grid (Rating + Trailer) */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto"
            >
              {/* Rating Star Actions */}
              <div className="bg-[#0c0c0d]/90 backdrop-blur-xl border border-white/5 px-5 py-3 rounded-2xl flex items-center justify-between sm:justify-start gap-5 w-full sm:w-auto shadow-xl hover:border-white/10 transition-colors duration-300">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Your Score</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => rateMovie(movieIdStr, star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="text-white hover:text-[#C9A227] transition-colors focus:outline-none cursor-pointer focus-visible:ring-1 focus-visible:ring-[#C9A227]"
                      aria-label={`Rate this movie ${star} stars out of 5`}
                    >
                      <Star 
                        className={`h-6.5 w-6.5 ${(hoverRating || userRating || 0) >= star ? "fill-[#C9A227] text-[#C9A227] scale-110" : "text-gray-700"} transition-all duration-200`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Large Premium Gold Trailer Button */}
              <TrailerButton trailerUrl={trailerUrl} />
            </motion.div>

            {/* Editorial Stats Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-3 gap-6 max-w-md w-full border-t border-white/5 mt-10 pt-6 text-left"
            >
              <div className="space-y-1">
                <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest font-mono flex items-center gap-1">
                  <Globe className="h-3 w-3" /> Language
                </div>
                <div className="text-sm font-semibold text-white uppercase">{movieDetails.original_language || "en"}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest font-mono flex items-center gap-1">
                  <BarChart3 className="h-3 w-3" /> Popularity
                </div>
                <div className="text-sm font-semibold text-white">{movieDetails.popularity ? Math.round(movieDetails.popularity).toLocaleString() : "N/A"}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest font-mono flex items-center gap-1">
                  <Users className="h-3 w-3" /> Votes
                </div>
                <div className="text-sm font-semibold text-white">{movieDetails.vote_count ? movieDetails.vote_count.toLocaleString() : "N/A"}</div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}
