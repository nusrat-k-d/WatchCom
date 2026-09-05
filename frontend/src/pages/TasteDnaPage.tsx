import { Link } from "react-router-dom"
import { Dna, Sparkles } from "lucide-react"
import { TasteDnaRadar } from "../components/profile/TasteDnaRadar"
import { useTaste } from "../context/UserTasteContext"
import { Button } from "../components/ui/button"

export function TasteDnaPage() {
  const { metrics, ratings, favorites } = useTaste()

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/20 text-[#C9A227] text-xs font-medium uppercase tracking-wider mb-3">
              <Dna className="w-3.5 h-3.5" />
              <span>Cinematic Fingerprint</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-serif text-white">
              Taste <span className="text-[#C9A227]">DNA</span> Analytics
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-400 max-w-xl">
              Real-time vector representation of your narrative, thematic, and emotional cinematic taste.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/discover">
              <Button className="bg-[#C9A227] hover:bg-[#B38F1E] text-black font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-[#C9A227]/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get Recommendations</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Profile Strength</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#C9A227] font-mono">
              {metrics.profileStrength}%
            </div>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Rated Movies</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {ratings.length}
            </div>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Saved In Vault</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-pink-400 font-mono">
              {favorites.length}
            </div>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Engine Confidence</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
              {metrics.confidence}%
            </div>
          </div>
        </div>

        {/* Interactive Radar Visualizer */}
        <TasteDnaRadar />
      </div>
    </div>
  )
}
