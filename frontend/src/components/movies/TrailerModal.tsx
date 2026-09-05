import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, RefreshCw, AlertCircle, ExternalLink, Film } from "lucide-react"

interface TrailerModalProps {
  movieId: string | number | null
  movieTitle: string
  isOpen: boolean
  onClose: () => void
}

interface VideoResult {
  id: string
  key: string
  name: string
  site: string
  type: string
  official?: boolean
}

export function TrailerModal({ movieId, movieTitle, isOpen, onClose }: TrailerModalProps) {
  const [videoKey, setVideoKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !movieId) {
      setVideoKey(null)
      setError(null)
      return
    }

    const fetchTrailer = async () => {
      setLoading(true)
      setError(null)
      setVideoKey(null)

      try {
        const res = await fetch(`http://localhost:5000/api/movies/${movieId}/videos`)
        if (!res.ok) throw new Error("Could not load trailer")

        const data = await res.json()
        const videos: VideoResult[] = data.results || []

        // Find official trailer on YouTube, or fallback to any YouTube teaser/clip
        const trailer = videos.find(v => v.site === "YouTube" && v.type === "Trailer" && v.official)
          || videos.find(v => v.site === "YouTube" && v.type === "Trailer")
          || videos.find(v => v.site === "YouTube" && v.type === "Teaser")
          || videos.find(v => v.site === "YouTube")

        if (trailer && trailer.key) {
          setVideoKey(trailer.key)
        } else {
          setError("No official trailer found on TMDB for this film.")
        }
      } catch (err: unknown) {
        console.error(err)
        setError("Unable to retrieve trailer stream.")
      } finally {
        setLoading(false)
      }
    }

    fetchTrailer()
  }, [isOpen, movieId])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl rounded-3xl bg-[#09090a] border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2.5 truncate pr-4">
            <Film className="w-4 h-4 text-[#C9A227] shrink-0" />
            <h3 className="text-sm sm:text-base font-bold text-white truncate font-serif">
              {movieTitle} — <span className="text-[#C9A227] font-sans font-medium text-xs">Official Trailer</span>
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-gray-400">
              <RefreshCw className="w-8 h-8 animate-spin text-[#C9A227]" />
              <span className="text-xs uppercase tracking-wider font-mono">Loading cinematic stream...</span>
            </div>
          ) : videoKey ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
              title={`${movieTitle} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <div className="flex flex-col items-center gap-4 text-center p-8 max-w-md">
              <AlertCircle className="w-10 h-10 text-amber-500/80 mb-1" />
              <p className="text-sm text-gray-300 font-medium">
                {error || "Trailer currently unavailable."}
              </p>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${movieTitle} trailer`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 text-xs font-semibold transition-all cursor-pointer"
              >
                <span>Search on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
