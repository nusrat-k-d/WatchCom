import { useState, useEffect, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getAICinematicData } from "../lib/ai-profile"
import type { Movie } from "../lib/mock-data"
import { MovieDetailsView } from "../components/movies/MovieDetails"

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

  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null)
  const [cast, setCast] = useState<CastMember[]>([])
  const [director, setDirector] = useState<string>("Unknown")
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([])
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryTrigger, setRetryTrigger] = useState(0)

  // Check cached intent score from search results
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

  // Derived AI profile data
  const aiData = useMemo(() => {
    if (!movieDetails) return null
    const genresList = movieDetails.genres ? movieDetails.genres.map((g: Genre) => g.name) : []
    return getAICinematicData(id || "", movieDetails.title, genresList, movieDetails.overview)
  }, [movieDetails, id])

  return (
    <MovieDetailsView 
      isLoading={isLoading}
      error={error}
      movieDetails={movieDetails}
      aiData={aiData}
      cast={cast}
      director={director}
      similarMovies={similarMovies}
      trailerUrl={trailerUrl}
      matchScore={matchScore}
      onRetry={() => setRetryTrigger(prev => prev + 1)}
      onNavigateHome={() => navigate("/discover")}
    />
  )
}
