import React, { useMemo, lazy, Suspense } from "react"
import { motion } from "framer-motion"
import { ChevronRight, Plus } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { MOCK_MOVIES } from "../lib/mock-data"
import { MovieCard } from "../components/movies/MovieCard"
import { LazyImage } from "../components/ui/LazyImage"

// Lazy loaded large dashboard components
const ProfileCompletion = lazy(() => import("../components/profile/ProfileCompletion").then(m => ({ default: m.ProfileCompletion })))
const EngineStatus = lazy(() => import("../components/engine/EngineStatus").then(m => ({ default: m.EngineStatus })))

// Skeleton fallback for dashboard modules
function CardSkeleton() {
  return (
    <div className="h-64 w-full bg-[#0f0f0f] border border-white/5 rounded-2xl animate-pulse" />
  )
}

export function DashboardPage() {
  const heroMovie = MOCK_MOVIES[0]
  
  // Memoize movie slices to prevent new references on every render
  const recommendedMovies = useMemo(() => MOCK_MOVIES.slice(1, 6), [])
  const trendingMovies = useMemo(() => MOCK_MOVIES.slice(5, 10), [])
  const hiddenGems = useMemo(() => [...MOCK_MOVIES].reverse(), [])

  return (
    <div className="flex flex-col pb-24">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-end pb-12">
        <div className="absolute inset-0 z-0">
          <LazyImage 
            src={heroMovie.posterUrl} 
            alt={heroMovie.title} 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-[var(--color-background)]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-background)] via-[var(--color-background)]/40 to-transparent" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-sm font-bold uppercase tracking-widest text-[var(--color-gold)] mb-2"
            >
              AI Curated Cinema
            </motion.h1>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-4 leading-tight"
            >
              {heroMovie.title}
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)] mb-6"
            >
              <span>{heroMovie.year}</span>
              <span>•</span>
              <span>{heroMovie.runtime}</span>
              <span>•</span>
              <span>{heroMovie.genres.join(", ")}</span>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-[var(--color-text-secondary)] mb-8 line-clamp-3"
            >
              {heroMovie.overview}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-4"
            >
              <Button size="lg" className="px-8 font-semibold bg-[var(--color-gold)] hover:bg-[#b5952f] text-black">
                <Plus className="mr-2 h-5 w-5" /> Rate Movie
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Intelligence Dashboard */}
      <section className="container mx-auto px-4 -mt-12 relative z-20 mb-12">
        <Suspense fallback={
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        }>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProfileCompletion />
            <EngineStatus />
          </div>
        </Suspense>
      </section>

      {/* Movie Rows */}
      <section className="container mx-auto px-4 space-y-12">
        <MovieRow title="Recommended For You" movies={recommendedMovies} />
        <MovieRow title="Because You Liked Interstellar" movies={trendingMovies} />
        <MovieRow title="Hidden Gems" movies={hiddenGems} />
      </section>
    </div>
  )
}

// Memoized MovieRow to avoid parent re-render side-effects
const MovieRow = React.memo(function MovieRow({ title, movies }: { title: string, movies: typeof MOCK_MOVIES }) {
  return (
    <div className="flex flex-col gap-6 mb-8">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h2 className="text-2xl font-serif font-bold tracking-tight text-white">{title}</h2>
        <Link to="/discover" className="text-sm font-medium text-[var(--color-gold)] hover:text-white transition-colors flex items-center">
          Explore Selection <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {movies.map((movie, idx) => (
          <MovieCard key={movie.id} movie={movie} idx={idx} />
        ))}
      </div>
    </div>
  )
})
