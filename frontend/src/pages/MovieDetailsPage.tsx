import React, { useState, useEffect, useRef, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { 
  Star, Clock, Calendar, Info, CheckCircle2, AlertCircle, Play, 
  ArrowLeft, Brain, Sparkles, Award, Film, BookOpen, Heart, RotateCcw
} from "lucide-react"
import { Button } from "../components/ui/button"
import { MovieCard } from "../components/movies/MovieCard"
import { useTaste } from "../context/UserTasteContext"
import { getAICinematicData } from "../lib/ai-profile"
import type { Movie } from "../lib/mock-data"
import { LazyImage } from "../components/ui/LazyImage"

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

interface CastMember {
  id: number
  name: string
  character: string
  profile_path?: string
}

// Circular Progress Component for Cinematic Metrics
const CircularProgress = React.memo(function CircularProgress({ value, label }: { value: number; label: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [currentVal, setCurrentVal] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 1.2
    const totalFrames = duration * 60
    const increment = value / totalFrames
    let frame = 0
    const timer = setInterval(() => {
      frame++
      start += increment
      if (frame >= totalFrames) {
        setCurrentVal(value)
        clearInterval(timer)
      } else {
        setCurrentVal(start)
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [isInView, value])

  const radius = 32
  const strokeWidth = 3
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (currentVal / 10) * circumference

  return (
    <div ref={ref} className="flex flex-col items-center text-center p-5 bg-[#0b0b0c] border border-white/5 rounded-2xl transition-colors duration-300 hover:border-white/10 hover:bg-black">
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Track Circle */}
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            stroke="#C9A227"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transition={{ ease: "easeOut" }}
          />
        </svg>
        <span className="absolute text-base font-mono font-bold text-white tracking-tight">
          {currentVal.toFixed(1)}
        </span>
      </div>
      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-4">
        {label}
      </span>
    </div>
  )
})

// Shimmer Skeleton Loader for Movie Details
function MovieDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col pb-24 relative overflow-hidden">
      {/* Background film grain texture */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
      
      {/* Hero Header Skeleton */}
      <div className="relative h-[75vh] w-full bg-[#0a0a0a] flex items-end pb-16 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/75 to-transparent z-0" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-end">
          <div className="w-40 md:w-56 shrink-0 aspect-[2/3] bg-white/5 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>
          <div className="flex-1 w-full space-y-4 pb-4">
            <div className="h-6 w-32 bg-white/5 rounded-full" />
            <div className="h-14 w-3/4 bg-white/5 rounded-xl" />
            <div className="h-6 w-1/2 bg-white/5 rounded-lg" />
            <div className="flex gap-4">
              <div className="h-5 w-16 bg-white/5 rounded" />
              <div className="h-5 w-20 bg-white/5 rounded" />
              <div className="h-5 w-32 bg-white/5 rounded" />
            </div>
            <div className="h-20 w-full bg-white/5 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12 animate-pulse">
        <div className="lg:col-span-2 space-y-8">
          <div className="h-48 w-full bg-white/5 rounded-3xl" />
          <div className="h-48 w-full bg-white/5 rounded-3xl" />
          <div className="h-40 w-full bg-white/5 rounded-3xl" />
        </div>
        <div className="space-y-8">
          <div className="h-80 w-full bg-white/5 rounded-3xl" />
          <div className="h-40 w-full bg-white/5 rounded-3xl" />
        </div>
      </div>
    </div>
  )
}

// Global in-memory cache for visited movie details
const movieDetailsCache = new Map<string, {
  details: MovieDetails
  cast: CastMember[]
  director: string
  similar: Movie[]
  trailerUrl: string | null
}>()

export function MovieDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getRatingForMovie, rateMovie } = useTaste()

  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null)
  const [cast, setCast] = useState<CastMember[]>([])
  const [director, setDirector] = useState<string>("Unknown")
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([])
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [showMatchExplain, setShowMatchExplain] = useState(false)
  const [retryTrigger, setRetryTrigger] = useState(0)

  // Backdrop Paralax Scroll coordinates
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Check cached intent score
  const matchScore = useMemo(() => {
    const cachedResults = sessionStorage.getItem("watchcom_last_search_results")
    if (!cachedResults || !id) return null
    try {
      const results = JSON.parse(cachedResults)
      const cachedMovie = results.find((m: { id: string; matchScore?: number }) => m.id === id)
      return cachedMovie ? cachedMovie.matchScore || null : null
    } catch {
      return null
    }
  }, [id])

  useEffect(() => {
    if (!id) return

    const fetchAllDetails = async () => {
      // Check cache first
      if (movieDetailsCache.has(id)) {
        const cached = movieDetailsCache.get(id)!
        setMovieDetails(cached.details)
        setCast(cached.cast)
        setDirector(cached.director)
        setSimilarMovies(cached.similar)
        setTrailerUrl(cached.trailerUrl)
        setIsLoading(false)
        setError(null)
        window.scrollTo(0, 0)
        return
      }

      setIsLoading(true)
      setError(null)
      try {
        const [detailsRes, castRes, similarRes, videosRes] = await Promise.all([
          fetch(`http://localhost:5000/api/movies/${id}`),
          fetch(`http://localhost:5000/api/movies/${id}/cast`),
          fetch(`http://localhost:5000/api/movies/${id}/similar`),
          fetch(`http://localhost:5000/api/movies/${id}/videos`)
        ])

        if (!detailsRes.ok) {
          throw new Error(`Failed to fetch movie details (Status: ${detailsRes.status})`)
        }
        const detailsData = await detailsRes.json()
        setMovieDetails(detailsData)

        let resolvedCast: CastMember[] = []
        let resolvedDirector = "Unknown"
        if (castRes.ok) {
          const castData = await castRes.json()
          resolvedCast = castData.cast || []
          setCast(resolvedCast)
          const dir = castData.crew?.find((c: { job: string; name: string }) => c.job === "Director")?.name
          if (dir) {
            resolvedDirector = dir
            setDirector(dir)
          }
        }

        let resolvedSimilar: Movie[] = []
        if (similarRes.ok) {
          const similarData = await similarRes.json()
          const resultsList = similarData.results || []
          resolvedSimilar = resultsList.slice(0, 10).map((m: { id: number; title?: string; release_date?: string; overview?: string; poster_path?: string; vote_average?: number }) => {
            const releaseYear = m.release_date ? parseInt(m.release_date.split('-')[0], 10) : 0
            return {
              id: String(m.id),
              title: m.title || 'Untitled',
              year: isNaN(releaseYear) ? 0 : releaseYear,
              runtime: 'N/A',
              genres: [],
              overview: m.overview || '',
              posterUrl: m.poster_path 
                ? `https://image.tmdb.org/t/p/w500${m.poster_path}` 
                : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
              rating: m.vote_average ? Number((m.vote_average / 2).toFixed(1)) : 0
            }
          })
          setSimilarMovies(resolvedSimilar)
        }

        let resolvedTrailer: string | null = null
        if (videosRes.ok) {
          const videosData = await videosRes.json()
          const videos = videosData.results || []
          const trailer = videos.find(
            (v: { site: string; type: string; key: string }) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
          ) || videos.find((v: { site: string; key: string }) => v.site === "YouTube")
          
          if (trailer) {
            resolvedTrailer = `https://www.youtube.com/watch?v=${trailer.key}`
            setTrailerUrl(resolvedTrailer)
          } else {
            setTrailerUrl(null)
          }
        }

        // Save to cache
        movieDetailsCache.set(id, {
          details: detailsData,
          cast: resolvedCast,
          director: resolvedDirector,
          similar: resolvedSimilar,
          trailerUrl: resolvedTrailer
        })
      } catch (err: unknown) {
        console.error(err)
        const errMsg = err instanceof Error ? err.message : "Failed to load movie. Please check your connection and try again."
        setError(errMsg)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllDetails()
    window.scrollTo(0, 0)
  }, [id, retryTrigger])

  // Get current rated score from context
  const userRating = id ? getRatingForMovie(id) : null

  // Derived AI profile data
  const aiData = useMemo(() => {
    if (!movieDetails) return null
    const genresList = movieDetails.genres ? movieDetails.genres.map((g: Genre) => g.name) : []
    return getAICinematicData(id || "", movieDetails.title, genresList, movieDetails.overview)
  }, [movieDetails, id])

  if (isLoading) {
    return <MovieDetailsSkeleton />
  }

  if (error || !movieDetails || !aiData) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 text-center text-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#0b0b0c] border border-white/10 p-10 rounded-3xl shadow-2xl flex flex-col items-center"
        >
          <AlertCircle className="h-16 w-16 text-red-500 mb-6" />
          <h3 className="text-2xl font-serif font-bold text-white mb-3">Cinematic Profile Lost</h3>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            {error || "We couldn't retrieve the cinematic records for this movie ID."}
          </p>
          <div className="flex gap-4 w-full">
            <Button 
              onClick={() => setRetryTrigger(prev => prev + 1)}
              className="flex-1 bg-[#C9A227] hover:bg-[#b5952f] text-black font-bold py-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-4 w-4" /> Retry
            </Button>
            <Button 
              onClick={() => navigate("/discover")}
              variant="outline"
              className="flex-1 border-white/10 hover:bg-white/5 text-white font-bold py-4 rounded-xl cursor-pointer"
            >
              Discover
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  const backdropUrl = movieDetails.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}` 
    : (movieDetails.poster_path ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500')

  const posterUrl = movieDetails.poster_path 
    ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${movieDetails.poster_path}` 
    : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500'

  const releaseYear = movieDetails.release_date ? parseInt(movieDetails.release_date.split('-')[0], 10) : 0
  const formattedReleaseDate = movieDetails.release_date 
    ? new Date(movieDetails.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A'
  const genresList = movieDetails.genres ? movieDetails.genres.map((g: Genre) => g.name) : []

  // Assigning simple icons to reasons to watch
  const reasonIcons = [Award, Film, Sparkles, Heart, BookOpen]

  return (
    <div className="flex flex-col pb-24 bg-[#050505] text-[#F5F5F5] overflow-x-hidden selection:bg-[#C9A227]/30 selection:text-white relative">
      
      {/* Film Grain Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.012]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* ============================================================================ */}
      {/* 1. CINEMATIC HERO SECTION */}
      {/* ============================================================================ */}
      <section className="relative min-h-[75vh] md:h-[80vh] flex items-end pt-24 pb-12 overflow-hidden border-b border-white/5">
        
        {/* Parallax Backdrop */}
        <div 
          className="absolute inset-0 z-0 transition-transform duration-100 ease-out"
          style={{ transform: `translateY(${scrollY * 0.4}px)` }}
        >
          <LazyImage 
            src={backdropUrl} 
            alt={`${movieDetails.title} backdrop`} 
            className="w-full h-full object-cover object-top opacity-35 scale-[1.05]"
          />
          {/* Layered cinematic gradient masking */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/30 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-end text-center md:text-left">
            
            {/* Floating Movie Poster with 3D Mouse Tilt */}
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.02, 
                rotateY: 5,
                rotateX: -5,
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(201, 162, 39, 0.15)" 
              }}
              style={{ transformStyle: "preserve-3d", perspective: 1000 }}
              className="w-40 md:w-56 shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#0b0b0c] relative group cursor-pointer"
            >
              <LazyImage src={posterUrl} alt={movieDetails.title} className="w-full h-auto object-cover" />
            </motion.div>
            
            {/* Details overlay metadata */}
            <div className="max-w-3xl pb-4 w-full">
              
              {/* Back navigation */}
              <button 
                onClick={() => navigate(-1)} 
                className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-gray-500 hover:text-[#C9A227] transition-colors mb-6 group cursor-pointer"
              >
                <ArrowLeft className="h-4.5 w-4.5 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>

              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-4"
              >
                <div className="flex items-center gap-1 bg-black/60 px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-bold text-[#C9A227] tracking-wider">
                  <Star className="h-3.5 w-3.5 fill-[#C9A227] text-[#C9A227]" />
                  {(movieDetails.vote_average ? movieDetails.vote_average / 2 : 0).toFixed(1)} / 5
                </div>
                {matchScore !== null && (
                  <button 
                    onClick={() => setShowMatchExplain(!showMatchExplain)}
                    className="bg-[#C9A227]/10 text-[#C9A227] px-3.5 py-1.5 rounded-full border border-[#C9A227]/30 text-xs font-bold cursor-pointer hover:bg-[#C9A227]/25 transition-colors flex items-center gap-2 tracking-wider"
                  >
                    {matchScore}% Match <Info className="h-3.5 w-3.5" />
                  </button>
                )}
              </motion.div>

              <AnimatePresence>
                {showMatchExplain && matchScore !== null && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-6"
                  >
                    <div className="bg-[#0b0b0c]/90 backdrop-blur-xl border border-[#C9A227]/25 p-6 rounded-2xl flex flex-col gap-3 text-left shadow-2xl max-w-xl">
                      <h4 className="text-xs text-[#C9A227] uppercase font-bold tracking-widest flex items-center gap-1.5">
                        <Brain className="h-3.5 w-3.5" /> WatchCom Intent Alignment
                      </h4>
                      <p className="text-xs text-gray-300 font-light leading-relaxed">
                        This match score is computed by parsing your recent cinematic searches. Your preference alignment shows a strong interest in the pacing, narrative depth, and thematic variables of {genresList[0] || 'this style'}.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3 leading-tight text-white"
              >
                {movieDetails.title}
              </motion.h1>

              {movieDetails.tagline && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="text-base sm:text-xl italic text-[#C9A227]/80 mb-5 font-light"
                >
                  "{movieDetails.tagline}"
                </motion.p>
              )}
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap justify-center md:justify-start items-center gap-x-5 gap-y-2 text-sm text-gray-400 mb-6 font-light"
              >
                <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-gray-500" /> {releaseYear}</div>
                <span>•</span>
                <div className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-gray-500" /> {movieDetails.runtime ? `${movieDetails.runtime} min` : 'N/A'}</div>
                <span>•</span>
                <div className="flex flex-wrap gap-2">
                  {genresList.map((g: string) => (
                    <span key={g} className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs text-white font-medium">{g}</span>
                  ))}
                </div>
              </motion.div>
              
              {/* Rating Actions */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-5 mt-8 border-t border-white/5 pt-6"
              >
                <div className="bg-[#0b0b0c] border border-white/5 px-4.5 py-3 rounded-2xl flex items-center gap-4.5 w-full sm:w-auto justify-between shadow-xl">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Your Score</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => rateMovie(id || "", star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="text-white hover:text-[#C9A227] transition-colors focus:outline-none cursor-pointer"
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star 
                          className={`h-5.5 w-5.5 ${(hoverRating || userRating || 0) >= star ? "fill-[#C9A227] text-[#C9A227] scale-110" : "text-gray-700"} transition-all duration-200`} 
                        />
                      </button>
                    ))}
                  </div>
                  {userRating && <CheckCircle2 className="h-4.5 w-4.5 text-[#C9A227] shrink-0" />}
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  {trailerUrl && (
                    <Button 
                      onClick={() => window.open(trailerUrl, "_blank")}
                      className="flex-1 sm:flex-none bg-[#C9A227] hover:bg-[#b5952f] text-black font-bold px-6 py-3.5 rounded-xl transition-all hover:scale-102 active:scale-98 shadow-xl flex items-center justify-center gap-2 cursor-pointer border border-[#C9A227]"
                    >
                      <Play className="h-4.5 w-4.5 fill-black" /> Watch Trailer
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* 2. DUAL COLUMN DETAILS & METRICS BLOCK */}
      {/* ============================================================================ */}
      <section className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Left Column: AI Editorial Insights */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Overview / Story Synopsis */}
            <div className="space-y-4 text-left">
              <h2 className="text-xs uppercase tracking-widest text-[#C9A227] font-bold font-mono">Overview</h2>
              <p className="text-gray-300 text-lg font-serif font-light leading-relaxed">
                {movieDetails.overview}
              </p>
            </div>

            {/* AI Summary Card */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#0b0b0c] to-[#050505] border border-white/5 p-8 rounded-3xl text-left shadow-2xl relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.03),transparent_70%)] pointer-events-none" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-[#C9A227] mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> AI Summary
              </h3>
              <p className="text-gray-300 font-light leading-relaxed text-base sm:text-lg">
                {aiData.aiSummary}
              </p>
            </motion.div>

            {/* Why Recommended Card */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#0b0b0c] to-[#050505] border border-white/5 p-8 rounded-3xl text-left shadow-2xl relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.03),transparent_70%)] pointer-events-none" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-[#C9A227] mb-4 flex items-center gap-2">
                <Brain className="h-4 w-4" /> Why WatchCom Recommended This
              </h3>
              <p className="text-gray-300 font-light leading-relaxed text-base sm:text-lg">
                {aiData.whyWatch}
              </p>
            </motion.div>

            {/* AI Review Card */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#0b0b0c] to-[#050505] border border-white/5 p-8 rounded-3xl text-left shadow-2xl relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.03),transparent_70%)] pointer-events-none" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-[#C9A227] mb-4 flex items-center gap-2">
                <Film className="h-4 w-4" /> AI Review
              </h3>
              <p className="text-gray-300 font-light leading-relaxed text-base sm:text-lg">
                {aiData.aiReview}
              </p>
            </motion.div>

            {/* Memorable Quote */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative p-8 md:p-12 bg-gradient-to-r from-[#0b0b0c] to-[#050505] border border-white/5 rounded-3xl overflow-hidden text-left shadow-2xl"
            >
              <div className="absolute -top-6 -left-4 font-serif text-[180px] leading-none text-[#C9A227]/5 select-none font-bold">“</div>
              <blockquote className="font-serif text-lg md:text-xl text-gray-300 relative z-10 leading-relaxed italic">
                "{aiData.memorableQuote.text}"
              </blockquote>
              <cite className="block text-[#C9A227] text-xs font-bold font-mono uppercase tracking-widest mt-6 not-italic">
                — {aiData.memorableQuote.by}
              </cite>
            </motion.div>

            {/* Cast & Crew horizontal scroll */}
            {cast.length > 0 && (
              <div className="space-y-6 text-left">
                <h3 className="text-xs uppercase tracking-widest text-[#C9A227] font-bold font-mono">Top Cast & Crew</h3>
                <div className="flex gap-6 overflow-x-auto no-scrollbar pb-3 snap-x">
                  {/* Director circle */}
                  <div className="flex flex-col items-center text-center shrink-0 w-24 snap-start">
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-[#C9A227]/30 bg-black/60 flex items-center justify-center mb-2.5">
                      <Award className="h-6 w-6 text-[#C9A227]" />
                    </div>
                    <span className="text-xs font-semibold text-white truncate w-full">{director}</span>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-0.5 font-mono">Director</span>
                  </div>

                  {/* Actor list */}
                  {cast.slice(0, 10).map((actor) => (
                    <div key={actor.id} className="flex flex-col items-center text-center shrink-0 w-24 snap-start group">
                      <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 mb-2.5 group-hover:border-[#C9A227]/40 transition-colors shadow-lg">
                        <LazyImage 
                          src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
                          alt={actor.name} 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                      <span className="text-xs font-semibold text-white truncate w-full group-hover:text-[#C9A227] transition-colors">{actor.name}</span>
                      <span className="text-[10px] text-gray-500 truncate w-full font-light mt-0.5">{actor.character}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Discussion Questions */}
            <div className="space-y-6 text-left">
              <h3 className="text-xs uppercase tracking-widest text-[#C9A227] font-bold font-mono">AI Discussion Questions</h3>
              <div className="space-y-3">
                {aiData.discussionQuestions.map((q, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 font-serif font-light text-gray-300 text-sm md:text-base">
                    <span className="text-[#C9A227] font-bold font-mono">0{i+1}</span>
                    <p className="leading-relaxed">{q}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Metrics, Tags, Stats */}
          <div className="space-y-12">
            
            {/* Cinematic Metrics circular indicator grid */}
            <div className="space-y-6 text-left">
              <h3 className="text-xs uppercase tracking-widest text-[#C9A227] font-bold font-mono">Cinematic DNA</h3>
              <div className="grid grid-cols-2 gap-4">
                <CircularProgress value={aiData.metrics.story} label="Story" />
                <CircularProgress value={aiData.metrics.characters} label="Characters" />
                <CircularProgress value={aiData.metrics.emotionalIntensity} label="Emotional Intensity" />
                <CircularProgress value={aiData.metrics.storyComplexity} label="Complexity" />
                <CircularProgress value={aiData.metrics.cinematography} label="Cinematography" />
                <CircularProgress value={aiData.metrics.visualEffects} label="Visual Effects" />
                <CircularProgress value={aiData.metrics.soundtrack} label="Soundtrack" />
                <CircularProgress value={aiData.metrics.pacing} label="Pacing" />
                <CircularProgress value={aiData.metrics.rewatchability} label="Rewatchability" />
                <CircularProgress value={aiData.metrics.endingImpact} label="Ending Impact" />
              </div>
            </div>

            {/* Mood Tags */}
            <div className="space-y-4 text-left">
              <h3 className="text-xs uppercase tracking-widest text-[#C9A227] font-bold font-mono">Mood Tags</h3>
              <div className="flex flex-wrap gap-2.5">
                {aiData.moodTags.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-4 py-2 rounded-full bg-[#0b0b0c] border border-white/5 hover:border-[#C9A227]/30 hover:text-[#C9A227] hover:bg-black text-xs font-semibold text-gray-300 cursor-pointer shadow-md select-none transition-all duration-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Movie Statistics */}
            <div className="space-y-4 text-left">
              <h3 className="text-xs uppercase tracking-widest text-[#C9A227] font-bold font-mono">Statistics</h3>
              <div className="bg-[#0b0b0c] border border-white/5 rounded-2xl p-6 space-y-4 text-sm font-sans shadow-xl">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500 font-light">Release Date</span>
                  <span className="text-white font-semibold">{formattedReleaseDate}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500 font-light">Language</span>
                  <span className="text-white font-semibold uppercase">{movieDetails.original_language || "en"}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500 font-light">Popularity</span>
                  <span className="text-white font-semibold">{movieDetails.popularity ? Math.round(movieDetails.popularity) : "N/A"}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500 font-light">Vote Average</span>
                  <span className="text-white font-semibold">{(movieDetails.vote_average || 0).toFixed(1)} / 10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-light">Vote Count</span>
                  <span className="text-white font-semibold">{movieDetails.vote_count ? movieDetails.vote_count.toLocaleString() : "N/A"}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* 3. REASONS TO WATCH */}
      {/* ============================================================================ */}
      <section className="container mx-auto px-4 md:px-8 py-16 border-t border-white/5">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-serif font-bold text-white mb-3">Five reasons to watch</h2>
          <p className="text-sm text-gray-500 font-light">Our semantic engine parsed these notable properties from the film's profile.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {aiData.reasonsToWatch.map((reason, idx) => {
            const IconComponent = reasonIcons[idx % reasonIcons.length]
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, borderColor: "rgba(201,162,39,0.25)" }}
                className="bg-[#0b0b0c] border border-white/5 p-6 rounded-3xl shadow-2xl flex flex-col justify-between text-left hover:bg-black transition-all duration-300"
              >
                <div className="h-10 w-10 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center text-[#C9A227] mb-6">
                  <IconComponent className="h-5 w-5" />
                </div>
                <p className="text-gray-400 text-sm font-light leading-relaxed flex-1">
                  {reason}
                </p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ============================================================================ */}
      {/* 4. SIMILAR MOVIES CAROUSEL */}
      {/* ============================================================================ */}
      {similarMovies.length > 0 && (
        <section className="container mx-auto px-4 md:px-8 py-16 border-t border-white/5 relative">
          <div className="flex items-center gap-2 mb-10 border-b border-white/5 pb-4 text-left">
            <Award className="h-5 w-5 text-[#C9A227]" />
            <h2 className="text-2xl font-serif font-bold tracking-tight">Similar Taste Vectors</h2>
          </div>
          
          <div className="relative overflow-hidden w-full group">
            {/* Fade overlays on edges */}
            <div className="absolute top-0 left-0 bottom-0 w-16 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 px-2 snap-x">
              {similarMovies.map((movie, idx) => (
                <div key={movie.id} className="w-48 shrink-0 snap-start">
                  <MovieCard movie={movie} idx={idx} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
