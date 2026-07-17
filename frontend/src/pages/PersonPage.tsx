import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, RotateCcw, Compass } from "lucide-react"
import { Button } from "../components/ui/button"

import { PersonHero } from "../components/PersonHero"
import { PersonBiography } from "../components/PersonBiography"
import { PersonFilmographyGrid } from "../components/PersonFilmographyGrid"

interface PersonDetails {
  id: number
  name: string
  profile_path: string | null
  known_for_department: string
  birthday: string | null
  deathday: string | null
  place_of_birth: string | null
  popularity: number
  biography: string | null
  homepage?: string | null
}

interface Movie {
  id: string
  title: string
  year: number
  runtime: string
  genres: string[]
  overview: string
  posterUrl: string
  rating: number
  popularity: number
}

// In-session cache for unified person profiles
const personProfileCache = new Map<string, {
  details: PersonDetails
  movies: Movie[]
  resolvedType: "actor" | "director"
}>()

// Hero Skeleton Shimmer
function PersonHeroSkeleton() {
  return (
    <div className="relative w-full border-b border-white/5 bg-[#0e0e10] pt-8 pb-12 animate-pulse text-left">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="h-6 w-16 bg-white/5 rounded-lg mb-8" />
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          <div className="w-48 h-72 md:w-64 md:h-96 rounded-2xl bg-white/5 border border-white/5" />
          <div className="flex-1 space-y-6 pt-2 w-full">
            <div className="space-y-3">
              <div className="h-4 bg-white/5 rounded w-20" />
              <div className="h-10 bg-white/5 rounded w-1/2" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white/5 rounded-lg border border-white/5" />
                  <div className="space-y-1 flex-1">
                    <div className="h-3 bg-white/5 rounded w-12" />
                    <div className="h-4 bg-white/5 rounded w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Biography Skeleton Shimmer
function BiographySkeleton() {
  return (
    <div className="space-y-4 py-8 animate-pulse text-left max-w-3xl border-b border-white/5">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-white/5 rounded-lg border border-white/5" />
        <div className="h-4 bg-white/5 rounded w-24" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-white/5 rounded w-full" />
        <div className="h-4 bg-white/5 rounded w-11/12" />
        <div className="h-4 bg-white/5 rounded w-3/4" />
      </div>
    </div>
  )
}

// Movie Card Skeleton Shimmer
function MovieCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse text-left">
      <div className="aspect-[2/3] rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden" />
      <div className="space-y-2 px-1">
        <div className="h-4 bg-white/5 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
      </div>
    </div>
  )
}

interface PersonPageProps {
  type?: "actor" | "director" | "person"
}

export function PersonPage({ type = "person" }: PersonPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [personDetails, setPersonDetails] = useState<PersonDetails | null>(null)
  const [movies, setMovies] = useState<Movie[]>([])
  const [resolvedType, setResolvedType] = useState<"actor" | "director">("actor")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryTrigger, setRetryTrigger] = useState(0)

  useEffect(() => {
    if (!id) return

    const fetchPersonProfile = async () => {
      // Check cache first
      if (personProfileCache.has(id)) {
        const cached = personProfileCache.get(id)!
        setPersonDetails(cached.details)
        setMovies(cached.movies)
        setResolvedType(cached.resolvedType)
        setIsLoading(false)
        setError(null)
        window.scrollTo(0, 0)
        return
      }

      setIsLoading(true)
      setError(null)

      // Determine initial/expected type based on prop or location path
      let initialType: "actor" | "director" | "unknown" = "unknown"
      if (type === "actor" || location.pathname.startsWith("/actor")) {
        initialType = "actor"
      } else if (type === "director" || location.pathname.startsWith("/director")) {
        initialType = "director"
      }

      try {
        // If we know the type beforehand, fetch in parallel for better performance!
        if (initialType !== "unknown") {
          const apiPath = initialType === "director" ? "directors" : "actors"
          
          const [detailsRes, moviesRes] = await Promise.all([
            fetch(`http://localhost:5000/api/${apiPath}/${id}`),
            fetch(`http://localhost:5000/api/${apiPath}/${id}/movies`)
          ])

          if (!detailsRes.ok) {
            throw new Error(`Failed to fetch details (Status: ${detailsRes.status})`)
          }
          if (!moviesRes.ok) {
            throw new Error(`Failed to fetch movies (Status: ${moviesRes.status})`)
          }

          const detailsData = await detailsRes.json()
          const moviesData = await moviesRes.json()
          const resolvedMovies = moviesData.cast || []

          setPersonDetails(detailsData)
          setMovies(resolvedMovies)
          setResolvedType(initialType)

          // Cache profile
          personProfileCache.set(id, {
            details: detailsData,
            movies: resolvedMovies,
            resolvedType: initialType
          })
        } else {
          // Sequential fallback for generic /person/:id path:
          // 1. Fetch details to inspect known_for_department
          const detailsRes = await fetch(`http://localhost:5000/api/actors/${id}`)
          if (!detailsRes.ok) {
            throw new Error(`Failed to fetch person details (Status: ${detailsRes.status})`)
          }
          const detailsData = await detailsRes.json()
          
          const finalType = detailsData.known_for_department === "Directing" ? "director" : "actor"
          const apiPath = finalType === "director" ? "directors" : "actors"

          // 2. Fetch movies
          const moviesRes = await fetch(`http://localhost:5000/api/${apiPath}/${id}/movies`)
          if (!moviesRes.ok) {
            throw new Error(`Failed to fetch movies (Status: ${moviesRes.status})`)
          }
          const moviesData = await moviesRes.json()
          const resolvedMovies = moviesData.cast || []

          setPersonDetails(detailsData)
          setMovies(resolvedMovies)
          setResolvedType(finalType)

          // Cache profile
          personProfileCache.set(id, {
            details: detailsData,
            movies: resolvedMovies,
            resolvedType: finalType
          })
        }
      } catch (err: unknown) {
        console.error(err)
        const errMsg = err instanceof Error ? err.message : "Failed to load profile. Please try again."
        setError(errMsg)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPersonProfile()
    window.scrollTo(0, 0)
  }, [id, type, location.pathname, retryTrigger])

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] overflow-x-hidden selection:bg-[#C9A227]/30 selection:text-white relative">
      {/* Film Grain Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.012]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <div key="loading">
            <PersonHeroSkeleton />
            <div className="container mx-auto px-4 md:px-8 mt-12 max-w-5xl space-y-10">
              <BiographySkeleton />
              <div className="space-y-6 pt-4 text-left">
                <div className="h-4 bg-white/5 rounded w-24 mb-6" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <MovieCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : error || !personDetails ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#050505] flex items-center justify-center px-6 text-center text-white relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03),transparent_70%)] pointer-events-none blur-[60px]" />
            
            <div className="max-w-md w-full bg-[#0b0b0c]/90 backdrop-blur-2xl border border-white/5 p-10 md:p-12 rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.9)] flex flex-col items-center z-10">
              <div className="h-16 w-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-500 mb-8 animate-pulse">
                <AlertCircle className="h-8 w-8" />
              </div>
              
              <h3 className="text-2xl font-serif font-bold text-white mb-3">Cinematic Profile Offline</h3>
              
              <p className="text-sm text-gray-400 mb-8 leading-relaxed font-sans font-light">
                {error || "We encountered an issue downloading the person profile from the database."}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button 
                  onClick={() => setRetryTrigger(prev => prev + 1)}
                  className="flex-1 bg-[var(--color-gold)] hover:bg-[#b5952f] text-black font-bold py-4.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <RotateCcw className="h-4 w-4" /> Retry Connection
                </Button>
                
                <Button 
                  onClick={() => navigate("/discover")}
                  variant="outline"
                  className="flex-1 border-white/10 hover:bg-white/5 hover:border-white/20 text-white font-bold py-4.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Compass className="h-4 w-4 text-gray-500" /> Explore Home
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* 1. Hero Header */}
            <PersonHero person={personDetails} />

            {/* 2. Content Container */}
            <div className="container mx-auto px-4 md:px-8 mt-12 max-w-5xl space-y-10 relative z-20">
              {/* Biography Section */}
              <PersonBiography biography={personDetails.biography} />

              {/* Filmography Section */}
              <PersonFilmographyGrid movies={movies} type={resolvedType} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
