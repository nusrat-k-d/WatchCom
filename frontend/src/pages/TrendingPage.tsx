import { useState, useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Flame, Star, Play, Calendar, Film } from "lucide-react"
import { MovieCard } from "../components/movies/MovieCard"
import { LazyImage } from "../components/ui/LazyImage"

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
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="aspect-[2/3] rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden" />
      <div className="space-y-2 px-1">
        <div className="h-4 bg-white/5 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
      </div>
    </div>
  )
}

// Hero Shimmer Skeleton
function HeroSkeleton() {
  return (
    <div className="relative h-[55vh] md:h-[65vh] w-full bg-[#0b0b0c] border border-white/5 rounded-3xl animate-pulse overflow-hidden flex items-end p-8 md:p-12 mb-12">
      <div className="max-w-2xl space-y-4">
        <div className="h-4 bg-white/5 rounded w-1/4" />
        <div className="h-12 bg-white/5 rounded w-3/4" />
        <div className="h-4 bg-white/5 rounded w-1/2" />
        <div className="h-16 bg-white/5 rounded w-full" />
        <div className="h-12 bg-white/5 rounded w-1/3" />
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
          throw new Error(`Failed to fetch trending movies: status ${response.status}`)
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
          setMovies(mapped)
        }
      } catch (err: any) {
        console.error(err)
        if (active) {
          setError(err.message || "Failed to load trending movies.")
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
    <div className="container mx-auto px-4 md:px-8 py-12 max-w-6xl relative z-10 text-left min-h-[calc(100vh-4rem)]">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[10%] left-[20%] w-[500px] h-[300px] bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.04),transparent_70%)] pointer-events-none z-0 blur-[50px]" />
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="bg-[#C9A227]/10 border border-[#C9A227]/30 rounded-xl p-2.5">
            <Flame className="h-5 w-5 text-[#C9A227] animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-black tracking-widest uppercase text-white">🔥 Trending Movies</h1>
            <p className="text-xs text-gray-500 font-light mt-0.5">Real-time box office trends compiled by TMDb analytics.</p>
          </div>
        </div>

        {/* Tab Toggle Switch */}
        <div className="inline-flex bg-[#0b0b0c] border border-white/5 p-1 rounded-xl shadow-inner max-w-xs self-start sm:self-center">
          <button
            onClick={() => setTimeWindow("day")}
            className={`px-5 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 ${
              timeWindow === "day"
                ? "bg-[#C9A227] text-black shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeWindow("week")}
            className={`px-5 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 ${
              timeWindow === "week"
                ? "bg-[#C9A227] text-black shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            This Week
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <div key="loading" className="space-y-12">
            <HeroSkeleton />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => <MovieCardSkeleton key={i} />)}
            </div>
          </div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-[#0b0b0c] border border-white/5 rounded-3xl p-8"
          >
            <Film className="h-10 w-10 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-serif font-bold text-white mb-2">Failed to load trending directory</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">{error}</p>
            <button
              onClick={() => setTimeWindow(timeWindow === "day" ? "week" : "day")}
              className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs uppercase tracking-widest font-mono font-bold text-white transition-colors"
            >
              Retry Connection
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            {/* Hero #1 Banner Section */}
            {heroMovie && (
              <div className="group/hero relative h-[55vh] md:h-[65vh] w-full rounded-3xl overflow-hidden border border-white/5 shadow-2xl flex items-end p-6 md:p-12">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
                </div>

                <div className="relative z-10 max-w-3xl space-y-4">
                  <div className="inline-flex items-center gap-1.5 bg-[#C9A227] text-black text-[10px] font-bold font-mono px-3 py-1 rounded-full uppercase tracking-wider">
                    <Flame className="h-3.5 w-3.5 fill-black" />
                    No. 1 Trending Movie
                  </div>
                  
                  <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight uppercase tracking-tight">
                    {heroMovie.title}
                  </h2>

                  <div className="flex items-center gap-4 text-xs font-mono font-bold text-gray-300">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {heroMovie.year}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[#C9A227]"><Star className="h-3.5 w-3.5 fill-[#C9A227]" /> {heroMovie.rating.toFixed(1)} / 5</span>
                    <span>•</span>
                    <span className="text-gray-400 font-sans font-light truncate">{heroMovie.genres.join(", ")}</span>
                  </div>

                  <p className="text-sm md:text-base text-gray-400 font-sans font-light leading-relaxed line-clamp-3 md:line-clamp-4">
                    {heroMovie.overview}
                  </p>

                  <div className="pt-2">
                    <Link
                      to={`/movie/${heroMovie.id}`}
                      className="inline-flex items-center gap-2 bg-white text-black hover:bg-[#C9A227] px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.03]"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Remaining Grid list */}
            {gridMovies.length > 0 && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="text-sm font-mono font-bold text-gray-400 uppercase tracking-widest">
                    ⚡ Trending Directory ({gridMovies.length + 1} films)
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
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
