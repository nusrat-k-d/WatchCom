import { Button } from "../../ui/button"

interface TrailerButtonProps {
  trailerUrl: string | null
}

export function TrailerButton({ trailerUrl }: TrailerButtonProps) {
  if (!trailerUrl) return null

  return (
    <Button 
      onClick={() => window.open(trailerUrl, "_blank", "noopener,noreferrer")}
      className="w-full sm:w-auto bg-gradient-to-r from-[var(--color-gold)] to-[#b5952f] hover:from-[#e3bd3f] hover:to-[#c4a233] text-black font-bold px-8 py-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2.5 cursor-pointer border border-[#C9A227]/40 outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2"
      aria-label="Watch the official trailer on YouTube (opens in a new tab)"
    >
      {/* YouTube Custom SVG Icon */}
      <svg 
        viewBox="0 0 24 24" 
        className="h-5 w-5 fill-black stroke-none shrink-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.525 3.545 12 3.545 12 3.545s-7.525 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.026 0 12 0 12s0 3.974.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.863.508 9.388.508 9.388.508s7.525 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.974 24 12 24 12s0-3.974-.502-5.837z" />
        <polygon points="9.545 15.568 15.818 12 9.545 8.432" fill="white" />
      </svg>
      <span className="tracking-wide">Watch Trailer</span>
    </Button>
  )
}
