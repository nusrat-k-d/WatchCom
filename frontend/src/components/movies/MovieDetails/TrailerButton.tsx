import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, Play, Film } from "lucide-react"
import { Button } from "../../ui/button"

interface TrailerButtonProps {
  trailerUrl: string | null
  movieTitle?: string
}

export function TrailerButton({ trailerUrl, movieTitle }: TrailerButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!trailerUrl) return null

  // Extract YouTube video key from URL
  const match = trailerUrl.match(/(?:v=|\/embed\/|youtu\.be\/)([\w-]{11})/)
  const videoKey = match ? match[1] : null

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto bg-gradient-to-r from-[var(--color-gold)] to-[#b5952f] hover:from-[#e3bd3f] hover:to-[#c4a233] text-black font-bold px-8 py-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2.5 cursor-pointer border border-[#C9A227]/40 outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2"
        aria-label="Watch the official trailer"
      >
        <Play className="h-5 w-5 fill-black text-black shrink-0" />
        <span className="tracking-wide">Watch Trailer</span>
      </Button>

      {/* Portalled Inline Embedded Player Modal with Full YouTube Controls */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isOpen && videoKey && (
            <div 
              className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl rounded-3xl bg-[#0a0a0b] border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden"
              >
                {/* Header Bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
                  <div className="flex items-center gap-2 truncate pr-4">
                    <Film className="w-4 h-4 text-[#C9A227] shrink-0" />
                    <span className="text-sm font-bold text-white font-serif truncate">
                      {movieTitle ? `${movieTitle} — Official Trailer` : "Official Cinematic Trailer"}
                    </span>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                    aria-label="Close trailer player"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Responsive 16:9 Iframe with Native YouTube Controls */}
                <div className="relative w-full aspect-video bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&controls=1&rel=0&modestbranding=0&playsinline=1&enablejsapi=1`}
                    title={movieTitle ? `${movieTitle} Trailer` : "Official Trailer"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
