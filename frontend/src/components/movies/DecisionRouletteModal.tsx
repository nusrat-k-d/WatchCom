import { useState } from "react"
import { motion } from "framer-motion"
import { Dices, X, Sparkles, Clock, Zap, Smile, RefreshCw } from "lucide-react"
import { Button } from "../ui/button"
import { MovieCard } from "./MovieCard"

interface DecisionRouletteModalProps {
  isOpen: boolean
  onClose: () => void
}

interface RouletteOption {
  id: string
  label: string
  subtitle: string
  icon: string
}

const TIME_OPTIONS: RouletteOption[] = [
  { id: "quick", label: "Under 90 Mins", subtitle: "Quick & Punchy", icon: "⚡" },
  { id: "standard", label: "~2 Hours", subtitle: "Standard Feature", icon: "⏱️" },
  { id: "epic", label: "2.5+ Hours", subtitle: "Epic Journey", icon: "🍿" }
]

const ENERGY_OPTIONS: RouletteOption[] = [
  { id: "easy", label: "Turn Brain Off", subtitle: "Pure Entertainment", icon: "🛋️" },
  { id: "engaged", label: "Engaged & Gripping", subtitle: "Smart Mystery & Thrills", icon: "🧠" },
  { id: "deep", label: "Mind-Blowing", subtitle: "Complex & Philosophical", icon: "🤯" }
]

const VIBE_OPTIONS: RouletteOption[] = [
  { id: "laugh", label: "Laugh & Uplift", subtitle: "Comedy & Good Vibes", icon: "😂" },
  { id: "thrill", label: "High Tension", subtitle: "Suspense & Heart-Pounding", icon: "😱" },
  { id: "emotional", label: "Deep Emotion", subtitle: "Heartfelt & Poignant", icon: "😭" },
  { id: "wonder", label: "Sci-Fi & Wonder", subtitle: "Worldbuilding & Adventure", icon: "🚀" },
  { id: "dark", label: "Gritty Neo-Noir", subtitle: "Dark & Atmospheric", icon: "🖤" }
]

interface MovieResult {
  id: string
  title: string
  year: number
  posterUrl: string
  rating: number
  genres: string[]
  matchScore: number
  reason: string
  runtime?: string
}

export function DecisionRouletteModal({ isOpen, onClose }: DecisionRouletteModalProps) {
  const [selectedTime, setSelectedTime] = useState<string>("standard")
  const [selectedEnergy, setSelectedEnergy] = useState<string>("engaged")
  const [selectedVibe, setSelectedVibe] = useState<string>("wonder")

  const [spinning, setSpinning] = useState(false)
  const [results, setResults] = useState<MovieResult[] | null>(null)

  const handleSpin = async () => {
    setSpinning(true)
    setResults(null)

    // Build natural query from selections
    const timeText = selectedTime === "quick" ? "under 90 minutes" : selectedTime === "epic" ? "over 140 minutes epic" : "around 2 hours"
    const energyText = selectedEnergy === "easy" ? "lighthearted easy watch" : selectedEnergy === "deep" ? "mind-blowing complex plot" : "gripping smart story"
    const vibeText = selectedVibe === "laugh" ? "funny comedy" : selectedVibe === "thrill" ? "intense suspense thriller" : selectedVibe === "emotional" ? "emotional drama" : selectedVibe === "dark" ? "dark gritty noir" : "mind-bending sci-fi"

    const query = `A ${vibeText} movie with ${energyText} that is ${timeText}`

    try {
      const response = await fetch("http://localhost:5000/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      })

      if (!response.ok) throw new Error("Failed to spin roulette")

      const data = await response.json()
      const raw = data.recommendations || data.candidates || []

      // Simulate a stylish 1.2s spin deceleration
      setTimeout(() => {
        const top3: MovieResult[] = raw.slice(0, 3).map((m: any) => ({
          id: String(m.id),
          title: m.title,
          year: m.release_date ? parseInt(m.release_date.split("-")[0], 10) : 2024,
          posterUrl: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : "",
          rating: m.vote_average || 7.8,
          genres: m.tags || ["Feature Film"],
          matchScore: m.watchComScore || 95,
          reason: m.reason || `Perfect match for your ${energyText} mood.`
        }))

        setResults(top3)
        setSpinning(false)
      }, 1200)
    } catch (e) {
      console.error(e)
      setSpinning(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#090909] border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 scrollbar-none"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#C9A227] to-amber-500 flex items-center justify-center text-black font-extrabold shadow-lg shadow-[#C9A227]/20">
            <Dices className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white flex items-center gap-2">
              <span>Decision</span>
              <span className="text-[#C9A227]">Roulette</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Can't decide? Pick your 3 immediate vibes and let WatchCom choose your film tonight.
            </p>
          </div>
        </div>

        {/* Selections Section */}
        {!results && (
          <div className="space-y-6">
            {/* 1. Time Budget */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>1. Time Budget</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {TIME_OPTIONS.map((t) => {
                  const active = selectedTime === t.id
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTime(t.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        active
                          ? "bg-[#C9A227]/10 border-[#C9A227] text-white shadow-lg shadow-[#C9A227]/10"
                          : "bg-white/[0.02] border-white/5 text-gray-400 hover:text-white hover:border-white/15"
                      }`}
                    >
                      <div className="text-xl mb-1">{t.icon}</div>
                      <div className="text-xs font-bold text-white">{t.label}</div>
                      <div className="text-[10px] text-gray-400">{t.subtitle}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 2. Mental Energy */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>2. Mental Energy</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ENERGY_OPTIONS.map((e) => {
                  const active = selectedEnergy === e.id
                  return (
                    <button
                      key={e.id}
                      onClick={() => setSelectedEnergy(e.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        active
                          ? "bg-amber-500/10 border-amber-400 text-white shadow-lg shadow-amber-500/10"
                          : "bg-white/[0.02] border-white/5 text-gray-400 hover:text-white hover:border-white/15"
                      }`}
                    >
                      <div className="text-xl mb-1">{e.icon}</div>
                      <div className="text-xs font-bold text-white">{e.label}</div>
                      <div className="text-[10px] text-gray-400">{e.subtitle}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 3. Emotional Vibe */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-pink-400" />
                <span>3. Desired Emotional Goal</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {VIBE_OPTIONS.map((v) => {
                  const active = selectedVibe === v.id
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVibe(v.id)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        active
                          ? "bg-pink-500/10 border-pink-400 text-white shadow-lg shadow-pink-500/10"
                          : "bg-white/[0.02] border-white/5 text-gray-400 hover:text-white hover:border-white/15"
                      }`}
                    >
                      <div className="text-xl mb-1">{v.icon}</div>
                      <div className="text-xs font-bold text-white truncate">{v.label}</div>
                      <div className="text-[9px] text-gray-400 truncate">{v.subtitle}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Spin Button */}
            <div className="pt-2 flex justify-center">
              <Button
                onClick={handleSpin}
                disabled={spinning}
                className="w-full sm:w-auto px-10 py-6 bg-gradient-to-r from-[#C9A227] via-amber-400 to-[#C9A227] text-black font-extrabold text-base rounded-2xl shadow-xl shadow-[#C9A227]/25 flex items-center justify-center gap-3 transition-all hover:opacity-95 active:scale-98 cursor-pointer disabled:opacity-50"
              >
                {spinning ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Spinning The Cinematic Wheel...</span>
                  </>
                ) : (
                  <>
                    <Dices className="w-5 h-5" />
                    <span>Spin The Roulette</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Roulette Results */}
        {results && (
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold font-serif text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#C9A227]" />
                  <span>Your 3 Golden Picks Tonight</span>
                </h3>
                <p className="text-xs text-gray-400">
                  Calculated based on your instantaneous energy and time budget.
                </p>
              </div>

              <Button
                onClick={() => setResults(null)}
                variant="outline"
                className="border-white/10 text-xs text-gray-300 hover:text-white flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Spin Again</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {results.map((movie, idx) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="space-y-2"
                >
                  <MovieCard movie={movie} idx={idx} showActions={true} />
                  <p className="text-[11px] text-gray-400 bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                    💡 {movie.reason}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
