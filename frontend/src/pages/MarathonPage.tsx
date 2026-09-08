import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import { 
  Sparkles, 
  Film, 
  Clock, 
  Star, 
  Bookmark, 
  Check, 
  ArrowRight, 
  Coffee, 
  MessageSquare, 
  RefreshCw, 
  Clapperboard, 
  Layers, 
  Flame, 
  ChevronRight 
} from "lucide-react"
import { LazyImage } from "../components/ui/LazyImage"
import { useTaste } from "../context/UserTasteContext"
import { TrailerButton } from "../components/movies/MovieDetails/TrailerButton"

interface MarathonFilm {
  id: string
  title: string
  year: number
  overview: string
  runtime: string
  runtimeMinutes: number
  rating: number
  posterUrl: string
  genres: string[]
  director: string
  slotNumber: number
  slotTitle: string
  whyThisSlot: string
  toneShift: string
}

interface IntermissionData {
  theme: string
  prompt: string
  snackVibe: string
}

interface MarathonResult {
  success: boolean
  marathonTitle: string
  curatorPrologue: string
  mode: "double" | "triple"
  filmCount: number
  totalRuntime: string
  totalRuntimeMinutes: number
  intermission: IntermissionData
  films: MarathonFilm[]
}

const PRESET_SEEDS = [
  { label: "🌌 Cosmic Dread", anchor: "Interstellar", theme: "Deep space isolation and cosmic existentialism" },
  { label: "🕵️ 90s Neo-Noir", anchor: "Se7en", theme: "Rain-soaked moral ambiguity and obsessive detective pursuit" },
  { label: "🌀 Mind Melter", anchor: "Inception", theme: "Structural reality fractures and psychological illusions" },
  { label: "🔪 Whodunnit Duel", anchor: "Knives Out", theme: "Sharp ensemble wit and intricate puzzlebox murder mystery" },
  { label: "🩸 A24 Folk Nightmare", anchor: "Midsommar", theme: "Daylight dread, pagan rituals, and emotional catharsis" },
  { label: "🌆 Cyberpunk Paranoia", anchor: "Blade Runner 2049", theme: "High-tech neon decay and synthetic soul searching" },
  { label: "☕ Melancholic Romance", anchor: "Past Lives", theme: "Quiet longing, parallel lives, and bittersweet destiny" }
]

export function MarathonPage() {
  const [anchorQuery, setAnchorQuery] = useState("")
  const [themeQuery, setThemeQuery] = useState("")
  const [mode, setMode] = useState<"double" | "triple">("double")
  const [isLoading, setIsLoading] = useState(false)
  const [marathon, setMarathon] = useState<MarathonResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [savedSuccess, setSavedSuccess] = useState(false)
  
  const { addFavorite } = useTaste()

  const handleGenerate = async (customAnchor?: string, customTheme?: string, customMode?: "double" | "triple") => {
    const activeAnchor = customAnchor !== undefined ? customAnchor : anchorQuery
    const activeTheme = customTheme !== undefined ? customTheme : themeQuery
    const activeMode = customMode || mode

    setIsLoading(true)
    setError(null)
    setSavedSuccess(false)

    try {
      const response = await fetch("http://localhost:5000/api/ai/marathon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anchorQuery: activeAnchor,
          theme: activeTheme,
          mode: activeMode
        })
      })

      if (!response.ok) {
        throw new Error("Failed to construct marathon. Please try again.")
      }

      const data: MarathonResult = await response.json()
      setMarathon(data)
    } catch (err: unknown) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Failed to generate cinematic marathon.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveAll = () => {
    if (!marathon || !marathon.films) return
    marathon.films.forEach((film) => {
      addFavorite({
        id: film.id,
        title: film.title,
        year: film.year,
        posterUrl: film.posterUrl,
        rating: film.rating,
        genres: film.genres,
        runtime: film.runtime,
        reason: film.whyThisSlot
      })
    })
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] pb-28 selection:bg-[#C9A227]/30 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.07),transparent_70%)] pointer-events-none blur-[90px]" />

      <div className="container mx-auto px-4 md:px-8 max-w-5xl relative z-10 pt-10 sm:pt-16">
        
        {/* Header Badge & Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/25 text-[#C9A227] text-xs font-mono font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(201,162,39,0.15)]"
          >
            <Clapperboard className="w-3.5 h-3.5 text-[#C9A227]" />
            Thematic Movie Sequencing
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight text-white leading-tight uppercase"
          >
            Double Feature & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E8D499] to-[#C9A227]">
              Marathon Architect
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-gray-400 font-sans font-light leading-relaxed max-w-2xl mx-auto"
          >
            Don't settle for one isolated film. Let AI construct a seamless multi-film marathon linked by thematic escalation, tonal progression, and optimal viewing momentum.
          </motion.p>
        </div>

        {/* Curation Control Deck */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-[#0b0b0c]/90 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.8)] space-y-6 mb-16 relative overflow-hidden"
        >
          {/* Format Switcher */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/20 text-[#C9A227]">
                <Layers className="h-5 w-5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">Marathon Scope</span>
                <p className="text-[11px] text-gray-400 font-light">Choose how many films to sequence tonight.</p>
              </div>
            </div>

            <div className="flex p-1 rounded-2xl bg-white/5 border border-white/10 w-full sm:w-auto">
              <button
                onClick={() => setMode("double")}
                className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  mode === "double" 
                    ? "bg-[#C9A227] text-black shadow-lg" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                🍿 Double Feature (2 Films)
              </button>
              <button
                onClick={() => setMode("triple")}
                className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  mode === "triple" 
                    ? "bg-[#C9A227] text-black shadow-lg" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                🎬 Epic Marathon (3 Films)
              </button>
            </div>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2 text-left">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-[#C9A227]" /> Anchor Movie (Optional)
              </label>
              <input
                type="text"
                value={anchorQuery}
                onChange={(e) => setAnchorQuery(e.target.value)}
                placeholder="e.g. Interstellar, Knives Out, Se7en..."
                className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#C9A227]/50 rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#C9A227] transition-all font-sans"
              />
              <span className="text-[10px] text-gray-500 font-light block">We'll architect the marathon around this film's DNA.</span>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" /> Thematic Mood / Vibe
              </label>
              <input
                type="text"
                value={themeQuery}
                onChange={(e) => setThemeQuery(e.target.value)}
                placeholder="e.g. 90s cyber-paranoia, cozy autumn mysteries, cosmic dread..."
                className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#C9A227]/50 rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#C9A227] transition-all font-sans"
              />
              <span className="text-[10px] text-gray-500 font-light block">Describe the overarching feeling, genre clash, or narrative arc.</span>
            </div>
          </div>

          {/* Quick Seed Pills */}
          <div className="space-y-2.5 text-left pt-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500">
              ⚡ Quick Curated Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_SEEDS.map((seed) => (
                <button
                  key={seed.label}
                  onClick={() => {
                    setAnchorQuery(seed.anchor)
                    setThemeQuery(seed.theme)
                    handleGenerate(seed.anchor, seed.theme)
                  }}
                  className="text-xs px-3.5 py-1.5 bg-white/5 hover:bg-[#C9A227]/10 border border-white/10 hover:border-[#C9A227]/30 text-gray-300 hover:text-[#C9A227] rounded-full transition-all duration-300 cursor-pointer font-medium"
                >
                  {seed.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              onClick={() => handleGenerate()}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[var(--color-gold)] to-[#b5952f] hover:from-[#e3bd3f] hover:to-[#c4a233] text-black font-bold text-sm uppercase tracking-wider py-4 rounded-2xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-[0_4px_25px_rgba(212,175,55,0.25)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Synthesizing Cinematic Synergy...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-black" />
                  <span>Architect {mode === "double" ? "Double Feature" : "Epic Marathon"}</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm text-center mb-10">
            {error}
          </div>
        )}

        {/* Marathon Results View */}
        <AnimatePresence>
          {marathon && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-16"
            >
              {/* Marquee Banner */}
              <div className="bg-[#0b0b0c]/95 border border-[#C9A227]/30 p-8 sm:p-12 rounded-[2.5rem] shadow-[0_30px_90px_rgba(0,0,0,0.9)] relative overflow-hidden text-left space-y-6">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.08),transparent_70%)] pointer-events-none" />

                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-[#C9A227] text-black px-3 py-1 rounded-full">
                      {marathon.mode === "double" ? "2-Film Double Bill" : "3-Film Epic Marathon"}
                    </span>
                    <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C9A227]" /> Total Run: <strong className="text-white">{marathon.totalRuntime}</strong>
                    </span>
                  </div>

                  {/* Save Entire Marathon Button */}
                  <button
                    onClick={handleSaveAll}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      savedSuccess 
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                    }`}
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Saved to Library!</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4 text-[#C9A227]" />
                        <span>Save Entire Marathon</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black text-white tracking-tight leading-tight">
                    {marathon.marathonTitle}
                  </h2>
                  <p className="text-base sm:text-lg text-gray-300 font-serif italic font-light leading-relaxed border-l-2 border-[#C9A227] pl-4 sm:pl-6 my-4">
                    "{marathon.curatorPrologue}"
                  </p>
                </div>
              </div>

              {/* Sequential Film Cards Timeline */}
              <div className="space-y-12 relative">
                {marathon.films.map((film, idx) => (
                  <React.Fragment key={film.id}>
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      className="bg-[#0b0b0c]/80 backdrop-blur-xl border border-white/10 hover:border-white/20 p-6 sm:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row gap-8 items-start text-left">
                        {/* Film Poster with 3D link */}
                        <div className="w-36 sm:w-44 shrink-0 mx-auto md:mx-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                          <LazyImage 
                            src={film.posterUrl} 
                            alt={film.title} 
                            className="w-full aspect-[2/3] object-cover" 
                          />
                        </div>

                        {/* Film Details */}
                        <div className="flex-1 space-y-4 w-full">
                          {/* Slot Tag & Sequence */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/25 text-[#C9A227] text-xs font-mono font-bold uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                              {film.slotTitle}
                            </div>
                            
                            <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
                              <span className="flex items-center gap-1 text-[#C9A227]">
                                <Star className="w-3.5 h-3.5 fill-[#C9A227]" /> {film.rating.toFixed(1)}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> {film.runtime}
                              </span>
                            </div>
                          </div>

                          {/* Title & Metadata */}
                          <div>
                            <Link 
                              to={`/movie/${film.id}`}
                              className="text-2xl sm:text-3xl font-serif font-bold text-white hover:text-[#C9A227] transition-colors"
                            >
                              {film.title}
                            </Link>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mt-1 font-light">
                              <span>{film.year}</span>
                              <span>•</span>
                              <span>Directed by <strong className="text-gray-300 font-normal">{film.director}</strong></span>
                              <span>•</span>
                              <span className="text-gray-500 font-sans">{film.genres.join(", ")}</span>
                            </div>
                          </div>

                          {/* Overview */}
                          <p className="text-xs sm:text-sm text-gray-300 font-sans font-light leading-relaxed line-clamp-3">
                            {film.overview}
                          </p>

                          {/* AI Justification Box */}
                          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-2 mt-4">
                            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C9A227] flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3" /> Why this film occupies this slot:
                            </div>
                            <p className="text-xs text-gray-300 font-sans font-light leading-relaxed">
                              {film.whyThisSlot}
                            </p>
                            <div className="text-[11px] text-gray-500 font-mono pt-1">
                              <strong>Tonal Trajectory:</strong> {film.toneShift}
                            </div>
                          </div>

                          {/* Action Bar */}
                          <div className="flex flex-wrap items-center gap-3 pt-2">
                            <Link
                              to={`/movie/${film.id}`}
                              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black hover:bg-[#C9A227] font-bold text-xs uppercase tracking-wider transition-all"
                            >
                              <span>Inspect Film Details</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Link>

                            <TrailerButton 
                              trailerUrl={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${film.title} official trailer`)}`} 
                              movieTitle={film.title}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Connecting Transition Bridge */}
                    {idx < marathon.films.length - 1 && (
                      <div className="flex flex-col items-center justify-center my-6 space-y-2 select-none">
                        <div className="h-8 w-px bg-gradient-to-b from-[#C9A227]/40 to-[#C9A227]/10" />
                        <div className="px-4 py-1.5 rounded-full bg-[#0b0b0c] border border-[#C9A227]/20 text-[10px] font-mono font-bold uppercase tracking-widest text-[#C9A227] flex items-center gap-2 shadow-lg">
                          <span>Transition & Energy Escalation</span>
                          <ArrowRight className="w-3 h-3 text-[#C9A227]" />
                        </div>
                        <div className="h-8 w-px bg-gradient-to-b from-[#C9A227]/10 to-[#C9A227]/40" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* The Intermission Lounge */}
              {marathon.intermission && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-[#0c0c0d] to-[#121214] border border-[#C9A227]/25 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl text-left space-y-6 relative overflow-hidden"
                >
                  <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <div className="p-2.5 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/25 text-[#C9A227]">
                      <Coffee className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-bold text-white">
                        ☕ The Intermission Lounge
                      </h3>
                      <p className="text-[11px] text-gray-400 font-mono">
                        Pause between reels for discussion and sensory refreshment.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Discussion Prompt */}
                    <div className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-2">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#C9A227] flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" /> Intermission Debate Prompt
                      </div>
                      <p className="text-xs sm:text-sm text-gray-200 font-serif italic leading-relaxed">
                        "{marathon.intermission.prompt}"
                      </p>
                    </div>

                    {/* Snack & Beverage Pairing */}
                    <div className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-2">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#C9A227] flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5" /> Suggested Refreshment Pairing
                      </div>
                      <p className="text-xs sm:text-sm text-gray-200 font-sans font-light leading-relaxed">
                        {marathon.intermission.snackVibe}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
