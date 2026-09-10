import { useState, useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Flame, Star, Play, Calendar, Film } from "lucide-react"
import { MovieCard } from "../components/movies/MovieCard"
import { LazyImage } from "../components/ui/LazyImage"
import { MOCK_MOVIES } from "../lib/mock-data"

interface Movie {
  id: string
  title: string
  year: number
  runtime: string
  genres: string[]
  overview: string
  posterUrl: string
  backdropUrl?: string
  rating: number
  voteCount: number
}

// Movie Card Skeleton
function MovieCardSkeleton() {
  return (
    <div className="flex flex-col gap-2.5 animate-pulse">
      <div className="aspect-[2/3] rounded-2xl bg-white/[0.04] border border-white/[0.05] relative overflow-hidden" />
      <div className="space-y-1.5 px-1">
        <div className="h-3.5 bg-white/[0.06] rounded w-3/4" />
        <div className="h-3 bg-white/[0.04] rounded w-1/2" />
      </div>
    </div>
  )
}

// Hero Shimmer Skeleton
function HeroSkeleton() {
  return (
    <div className="relative h-[50vh] md:h-[60vh] w-full bg-[#09090c] border border-white/[0.06] rounded-3xl animate-pulse overflow-hidden flex items-end p-6 md:p-12 mb-10">
      <div className="max-w-2xl space-y-4">
        <div className="h-3.5 bg-white/[0.08] rounded w-1/4" />
        <div className="h-10 bg-white/[0.08] rounded w-3/4" />
        <div className="h-3.5 bg-white/[0.06] rounded w-1/2" />
        <div className="h-12 bg-white/[0.05] rounded w-full" />
        <div className="h-10 bg-white/[0.08] rounded w-1/3" />
      </div>
    </div>
  )
}

export function TrendingPage() {
  const [timeWindow, setTimeWindow] = useState<"day" | "week">("day")
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    const fetchTrending = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`http://localhost:5000/api/movies/trending?timeWindow=${timeWindow}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch trending movies (Status: ${response.status})`)
        }
        const data = await response.json()
        const rawResults = data.results || []

        const GENRE_ID_TO_NAME: Record<number, string> = {
          28: "Action",
          12: "Adventure",
          16: "Animation",
          35: "Comedy",
          80: "Crime",
          99: "Documentary",
          18: "Drama",
          10751: "Family",
          14: "Fantasy",
          36: "History",
          27: "Horror",
          10402: "Music",
          9648: "Mystery",
          10749: "Romance",
          878: "Sci-Fi",
          10770: "TV Movie",
          53: "Thriller",
          10752: "War",
          37: "Western"
        }

        const mapped: Movie[] = rawResults.map((m: any) => {
          const genres = Array.isArray(m.genre_ids)
            ? m.genre_ids.map((id: number) => GENRE_ID_TO_NAME[id] || "").filter(Boolean)
            : []
          if (genres.length === 0) genres.push("Drama")

          const releaseYear = m.release_date ? parseInt(m.release_date.split("-")[0], 10) : 0

          return {
            id: String(m.id),
            title: m.title || "Untitled",
            year: isNaN(releaseYear) ? 0 : releaseYear,
            runtime: "N/A",
            genres,
            overview: m.overview || "",
            posterUrl: m.poster_path 
              ? `https://image.tmdb.org/t/p/w500${m.poster_path}` 
              : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500",
            backdropUrl: m.backdrop_path
              ? `https://image.tmdb.org/t/p/original${m.backdrop_path}`
              : undefined,
            rating: m.vote_average ? Number((m.vote_average / 2).toFixed(1)) : 0,
            voteCount: m.vote_count || 0
          }
        })

        if (active) {
          setMovies(mapped.length > 0 ? mapped : MOCK_MOVIES.map(m => ({ ...m, voteCount: 100 })))
        }
      } catch (err: any) {
        console.error(err)
        if (active) {
          // Graceful fallback to mock movies
          setMovies(MOCK_MOVIES.map(m => ({ ...m, voteCount: 100 })))
        }
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    fetchTrending()

    return () => {
      active = false
    }
  }, [timeWindow])

  const heroMovie = useMemo(() => (movies.length > 0 ? movies[0] : null), [movies])
  const gridMovies = useMemo(() => (movies.length > 1 ? movies.slice(1) : []), [movies])

  return (
    <div className="container mx-auto px-6 md:px-10 pt-24 md:pt-28 pb-16 max-w-6xl relative z-10 text-left min-h-screen">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[5%] left-[20%] w-[600px] h-[300px] bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.05),transparent_70%)] pointer-events-none z-0 blur-[60px]" />
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 border-b border-white/[0.06] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] uppercase text-[#C5A059] mb-1">
            <span>✦ BOX OFFICE RADAR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-normal text-[#F0EDE6] tracking-tight">
            Trending Cinema
          </h1>
          <p className="text-xs text-zinc-400 font-light mt-0.5">
            Global audience demand and real-time box office velocity.
          </p>
        </div>

        {/* Tab Toggle Switch */}
        <div className="inline-flex bg-[#09090c]/90 border border-white/[0.08] p-1 rounded-xl shadow-inner self-start sm:self-center">
          <button
            onClick={() => setTimeWindow("day")}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              timeWindow === "day"
                ? "bg-[#C5A059] text-[#08080a] font-semibold shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeWindow("week")}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              timeWindow === "week"
                ? "bg-[#C5A059] text-[#08080a] font-semibold shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            This Week
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <div key="loading" className="space-y-10">
            <HeroSkeleton />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => <MovieCardSkeleton key={i} />)}
            </div>
          </div>
        ) : error && movies.length === 0 ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-[#09090c]/80 border border-white/[0.08] rounded-3xl p-8 max-w-md mx-auto"
          >
            <Film className="h-8 w-8 text-zinc-500 mx-auto mb-3" />
            <h3 className="text-base font-serif text-[#F0EDE6] mb-1">Directory Temporarily Offline</h3>
            <p className="text-xs text-zinc-400 mb-6 font-light">{error}</p>
            <button
              onClick={() => setTimeWindow(timeWindow === "day" ? "week" : "day")}
              className="px-5 py-2.5 bg-[#C5A059] text-[#08080a] rounded-xl text-xs uppercase font-semibold tracking-wider transition-colors cursor-pointer"
            >
              Retry
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-10"
          >
            {/* Hero #1 Banner Section */}
            {heroMovie && (
              <div className="group/hero relative h-[48vh] md:h-[56vh] w-full rounded-3xl overflow-hidden border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex items-end p-6 md:p-10">
                <div className="absolute inset-0 z-0">
                  {heroMovie.backdropUrl ? (
                    <LazyImage
                      src={heroMovie.backdropUrl}
                      alt={heroMovie.title}
                      className="w-full h-full object-cover transition-transform duration-[8s] ease-out group-hover/hero:scale-105"
                    />
                  ) : (
                    <LazyImage
                      src={heroMovie.posterUrl}
                      alt={heroMovie.title}
                      className="w-full h-full object-cover transition-transform duration-[8s] ease-out group-hover/hero:scale-105"
                    />
                  )}
                  {/* Luxury Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060607] via-[#060607]/60 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#060607]/90 via-[#060607]/40 to-transparent" />
                </div>

                <div className="relative z-10 max-w-2xl space-y-3">
                  <div className="inline-flex items-center gap-1.5 bg-[#C5A059] text-[#08080a] text-[9px] font-bold font-mono px-3 py-0.5 rounded-full uppercase tracking-wider">
                    <Flame className="h-3 w-3 fill-current" />
                    Featured Premiere
                  </div>
                  
                  <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-normal text-[#F0EDE6] leading-tight tracking-tight">
                    {heroMovie.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-sans text-zinc-300">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-zinc-400" /> {heroMovie.year}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="flex items-center gap-1 text-[#C5A059]"><Star className="h-3 w-3 fill-[#C5A059]" /> {heroMovie.rating.toFixed(1)}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400 font-light truncate">{heroMovie.genres.join(", ")}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-400 font-sans font-light leading-relaxed line-clamp-2 md:line-clamp-3">
                    {heroMovie.overview}
                  </p>

                  <div className="pt-2">
                    <Link
                      to={`/movie/${heroMovie.id}`}
                      className="inline-flex items-center gap-2 bg-[#C5A059] hover:bg-[#D8B878] text-[#08080a] px-6 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_2px_15px_rgba(197,160,89,0.3)]"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>View Feature</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Remaining Grid list */}
            {gridMovies.length > 0 && (
              <div className="space-y-4">
                <div className="border-b border-white/[0.06] pb-2 flex items-center justify-between">
                  <h3 className="text-xs font-mono tracking-[0.2em] text-zinc-400 uppercase font-medium">
                    Curated Directory ({gridMovies.length + 1} selections)
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                  {gridMovies.map((movie, idx) => (
                    <MovieCard key={movie.id} movie={movie} idx={idx} />
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
