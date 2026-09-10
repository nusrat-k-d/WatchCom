import { Link } from "react-router-dom"
import { Compass, Film } from "lucide-react"
import { Button } from "../components/ui/button"

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 md:pt-36 pb-20 relative z-10">
      {/* Soft Gold Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.04),transparent_70%)] pointer-events-none blur-[60px]" />
      
      <div className="max-w-md w-full bg-[#09090c]/80 backdrop-blur-2xl border border-white/[0.08] p-10 md:p-12 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.9)] flex flex-col items-center">
        <div className="h-16 w-16 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center mb-6 text-[#C5A059]">
          <Film className="h-8 w-8" />
        </div>
        
        <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#C5A059] mb-2 font-medium">
          ✦ 404 UNCALIBRATED COORDINATES
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#F0EDE6] mb-3 tracking-tight">
          Signal Disconnected
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 mb-8 max-w-sm font-light leading-relaxed">
          The cinematic sequence you are seeking does not exist in our catalog. Let's redirect your telemetry to calibrated space.
        </p>

        <Link to="/discover" className="w-full focus-visible:outline-none">
          <Button className="w-full bg-[#C5A059] hover:bg-[#D8B878] text-[#08080a] font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-[0_2px_15px_rgba(197,160,89,0.3)] cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2">
            <Compass className="h-4 w-4" /> Return to Discover
          </Button>
        </Link>
      </div>
    </div>
  )
}
