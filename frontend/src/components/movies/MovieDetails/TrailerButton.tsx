import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Play, Film } from "lucide-react"
import { Button } from "../../ui/button"

interface TrailerButtonProps {
  trailerUrl: string | null
}

export function TrailerButton({ trailerUrl }: TrailerButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

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

      {/* Inline Embedded Player Modal (No external redirect) */}
      <AnimatePresence>
        {isOpen && videoKey && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl rounded-3xl bg-[#0a0a0b] border border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-[#C9A227]" />
                  <span className="text-sm font-bold text-white font-serif">
                    Official Cinematic Trailer
                  </span>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Responsive 16:9 Iframe */}
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
                  title="Official Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
