import { useParams, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Clock, Calendar, Info, CheckCircle2, AlertCircle, Play } from "lucide-react"
import { Button } from "../components/ui/button"
import { useState, useEffect } from "react"
import { MovieCard } from "../components/movies/MovieCard"
import type { Movie } from "../lib/mock-data"

export function MovieDetailsPage() {
  const { id } = useParams()
  const [movieDetails, setMovieDetails] = useState<any>(null)
  const [cast, setCast] = useState<any[]>([])
  const [director, setDirector] = useState<string>("Unknown")
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([])
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [showMatchExplain, setShowMatchExplain] = useState(false)

  // Try to find matchScore in last search results
  let matchScore: number | null = null
  const cachedResults = sessionStorage.getItem("watchcom_last_search_results")
  if (cachedResults && id) {
    try {
      const results = JSON.parse(cachedResults)
      const cachedMovie = results.find((m: any) => m.id === id)
      if (cachedMovie) {
        matchScore = cachedMovie.matchScore || null
      }
    } catch (e) {
      console.error("Error parsing cached search results for match score:", e)
    }
  }

  useEffect(() => {
    if (!id) return

    const fetchAllDetails = async () => {
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

        if (castRes.ok) {
          const castData = await castRes.json()
          setCast(castData.cast || [])
          const dir = castData.crew?.find((c: any) => c.job === "Director")?.name
          if (dir) setDirector(dir)
        }

        if (similarRes.ok) {
          const similarData = await similarRes.json()
          const resultsList = similarData.results || []
          const mappedSimilar: Movie[] = resultsList.slice(0, 4).map((m: any) => {
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
          setSimilarMovies(mappedSimilar)
        }

        if (videosRes.ok) {
          const videosData = await videosRes.json()
          const videos = videosData.results || []
          const trailer = videos.find(
            (v: any) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
          ) || videos.find((v: any) => v.site === "YouTube")
          
          if (trailer) {
            setTrailerUrl(`https://www.youtube.com/watch?v=${trailer.key}`)
          } else {
            setTrailerUrl(null)
          }
        }
      } catch (err: any) {
        console.error(err)
        setError(err.message || "Something went wrong while loading movie details.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllDetails()
    window.scrollTo(0, 0)
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#050505] text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-[var(--color-gold)] border-r-[var(--color-gold)] border-b-transparent border-l-transparent" />
        <p className="mt-4 text-sm text-[var(--color-text-secondary)]">Loading cinematic profile...</p>
      </div>
    )
  }

  if (error || !movieDetails) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-[#050505] text-white">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Failed to load movie details</h3>
        <p className="text-sm text-red-400 mb-6 max-w-md">{error || "Movie not found."}</p>
        <Link to="/discover">
          <Button className="bg-[var(--color-gold)] text-black">Back to Discover</Button>
        </Link>
      </div>
    )
  }

  const backdropUrl = movieDetails.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}` 
    : (movieDetails.poster_path ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500')

  const posterUrl = movieDetails.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` 
    : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500'

  const releaseYear = movieDetails.release_date ? parseInt(movieDetails.release_date.split('-')[0], 10) : 0
  const formattedReleaseDate = movieDetails.release_date 
    ? new Date(movieDetails.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A'

  const genresList = movieDetails.genres ? movieDetails.genres.map((g: any) => g.name) : []

  return (
    <div className="flex flex-col pb-24">
      {/* Hero */}
      <section className="relative h-[80vh] flex items-end pb-12">
        <div className="absolute inset-0 z-0">
          <img 
            src={backdropUrl} 
            alt={`${movieDetails.title} backdrop`} 
            className="w-full h-full object-cover object-top opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-[var(--color-background)]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-background)] via-[var(--color-background)]/50 to-transparent" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-end text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-36 md:w-48 shrink-0 rounded-xl overflow-hidden shadow-2xl border border-white/10"
          >
            <img src={posterUrl} alt={movieDetails.title} className="w-full h-auto" />
          </motion.div>
          
          <div className="max-w-3xl pb-4 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-4"
            >
              <div className="flex items-center gap-1 bg-black/60 px-3 py-1.5 rounded-full border border-white/10 text-sm font-bold text-[var(--color-gold)]">
                <Star className="h-4 w-4 fill-[var(--color-gold)]" />
                {(movieDetails.vote_average ? movieDetails.vote_average / 2 : 0).toFixed(1)}
              </div>
              {matchScore !== null && (
                <div 
                  onClick={() => setShowMatchExplain(!showMatchExplain)}
                  className="bg-[var(--color-gold)]/20 text-[var(--color-gold)] px-3 py-1.5 rounded-full border border-[var(--color-gold)]/30 text-sm font-bold cursor-pointer hover:bg-[var(--color-gold)]/30 transition-colors flex items-center gap-2"
                >
                  {matchScore}% Match <Info className="h-4 w-4" />
                </div>
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
                  <div className="bg-black/60 backdrop-blur-md border border-[var(--color-gold)]/20 p-5 rounded-xl flex flex-col gap-4 text-left">
                    <div className="text-xs text-[var(--color-gold)] uppercase font-bold tracking-widest mb-1">Why This Match?</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] mt-1.5 shrink-0" />
                        <div className="text-sm text-gray-300">You consistently rate <strong>{genresList[0] || 'Drama'}</strong> highly, making this a strong genre match.</div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] mt-1.5 shrink-0" />
                        <div className="text-sm text-gray-300">Users with identical taste clusters to yours loved this film.</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-2 leading-tight"
            >
              {movieDetails.title}
            </motion.h1>

            {movieDetails.tagline && (
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-base sm:text-lg italic text-[var(--color-gold)]/80 mb-4 font-light"
              >
                "{movieDetails.tagline}"
              </motion.p>
            )}
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-2 text-[var(--color-text-secondary)] mb-6"
            >
              <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {releaseYear}</div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> {movieDetails.runtime ? `${movieDetails.runtime} min` : 'N/A'}</div>
              <div className="flex items-center gap-2">
                {genresList.map((g: string) => (
                  <span key={g} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs text-white">{g}</span>
                ))}
              </div>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base md:text-lg text-[var(--color-text-secondary)] mb-6 max-w-2xl leading-relaxed"
            >
              {movieDetails.overview}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-sm font-sans text-gray-400 mb-8 space-y-2 max-w-2xl border-t border-white/5 pt-4 text-left"
            >
              <div>
                <strong className="text-gray-200">Director:</strong> {director}
              </div>
              <div>
                <strong className="text-gray-200">Top Cast:</strong> {cast.slice(0, 5).map(c => c.name).join(", ") || 'N/A'}
              </div>
              <div>
                <strong className="text-gray-200">Release Date:</strong> {formattedReleaseDate}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col md:flex-row items-center gap-6"
            >
              <div className="bg-[#0f0f0f]/80 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center gap-4">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Your Rating</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setUserRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="text-white hover:text-[var(--color-gold)] transition-colors focus:outline-none cursor-pointer"
                    >
                      <Star 
                        className={`h-6 w-6 ${(hoverRating || userRating || 0) >= star ? "fill-[var(--color-gold)] text-[var(--color-gold)] scale-110" : ""} transition-all`} 
                      />
                    </button>
                  ))}
                </div>
                {userRating && <CheckCircle2 className="h-5 w-5 text-green-500 ml-2" />}
              </div>

              <div className="flex flex-wrap gap-3 w-full sm:w-auto justify-center">
                {trailerUrl && (
                  <Button 
                    onClick={() => window.open(trailerUrl, "_blank")}
                    className="bg-gradient-to-r from-[var(--color-gold)] to-[#b5952f] text-black font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Play className="h-4 w-4 fill-black" /> Watch Trailer
                  </Button>
                )}
                <Button variant="outline" size="default" className="border-[var(--color-gold)]/20 hover:bg-[var(--color-gold)]/10 text-[var(--color-gold)] cursor-pointer">
                  <Star className="mr-2 h-4 w-4" /> Add Rating
                </Button>
                <Button variant="ghost" size="default" className="hover:bg-white/5 text-white border border-white/10 cursor-pointer">
                  Improve Profile
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recommended Based on This */}
      {similarMovies.length > 0 && (
        <section className="container mx-auto px-4 mt-12 mb-12">
          <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-4">
            <Star className="h-5 w-5 text-[var(--color-gold)]" />
            <h2 className="text-2xl font-serif font-bold tracking-tight">Similar Taste Vectors</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {similarMovies.map((movie, idx) => (
              <MovieCard key={movie.id} movie={movie} idx={idx} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
