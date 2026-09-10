import { useState } from "react"
import { Play } from "lucide-react"
import { TrailerModal } from "../TrailerModal"

interface TrailerButtonProps {
  trailerUrl?: string | null
  movieId: string | number
  movieTitle: string
}

export function TrailerButton({ movieId, movieTitle }: TrailerButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto bg-[#C5A059] hover:bg-[#D8B878] text-[#08080a] font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_2px_15px_rgba(197,160,89,0.3)] flex items-center justify-center gap-2.5 cursor-pointer text-xs uppercase tracking-wider outline-none focus-visible:ring-1 focus-visible:ring-[#C5A059]"
        aria-label="Watch the official trailer"
      >
        <Play className="h-4 w-4 fill-current shrink-0" />
        <span>Watch Trailer</span>
      </button>

      <TrailerModal
        movieId={movieId}
        movieTitle={movieTitle}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
