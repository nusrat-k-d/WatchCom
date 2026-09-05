import { useState } from "react"
import { motion } from "framer-motion"
import { HeartHandshake, Sparkles, RefreshCw, CheckCircle2, HelpCircle } from "lucide-react"
import { Button } from "../components/ui/button"
import { MovieCard } from "../components/movies/MovieCard"

interface CouplesBreakdown {
  forPerson1?: string
  forPerson2?: string
}

interface CouplesCandidate {
  id: number
  title: string
  release_date?: string
  poster_path?: string
  vote_average?: number
  genre_ids?: number[]
  overview?: string
  watchComScore?: number
  confidence?: string
  reason?: string
  tags?: string[]
  couplesBreakdown?: CouplesBreakdown
  bothMatch?: boolean
}

const PRESETS_PERSON1 = [
  "Mind-bending sci-fi like Interstellar or Inception",
  "High stakes crime thriller with smart plot twists",
  "Dark atmospheric mystery with neo-noir tone",
  "Fast-paced action adventure with witty humor"
]

const PRESETS_PERSON2 = [
  "Heartwarming emotional drama like About Time",
  "Cozy romantic comedy with great chemistry",
  "Thought-provoking psychological character study",
  "Feel-good inspiring story with happy ending"
]

export function CouplesMatchPage() {
  const [name1, setName1] = useState("Person 1")
  const [query1, setQuery1] = useState(PRESETS_PERSON1[0])
  const [name2, setName2] = useState("Person 2")
  const [query2, setQuery2] = useState(PRESETS_PERSON2[0])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<CouplesCandidate[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleMatch = async () => {
    if (!query1.trim() || !query2.trim()) return

    setLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const response = await fetch("http://localhost:5000/api/ai/couples-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          person1Name: name1.trim() || "Person 1",
          person1Query: query1.trim(),
          person2Name: name2.trim() || "Person 2",
          person2Query: query2.trim()
        })
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.message || `Server returned status ${response.status}. Make sure backend is running.`)
      }

      const data = await response.json()
      setResults(data.recommendations || [])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error matching tastes. Please try again."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#C9A227]/20 to-pink-500/20 border border-[#C9A227]/30 text-[#C9A227] text-xs font-semibold uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4 text-pink-400" />
            <span>Dual Taste Match Engine</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-serif tracking-tight">
            Couples & Group <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A227] via-amber-200 to-pink-400">Vibe Matcher</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Stop arguing over what to watch. Enter what both of you are in the mood for, and WatchCom's AI will find the cinematic sweet spot that thrills you both.
          </p>
        </div>

        {/* Dual Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative">
          {/* Decorative Intersection Ring */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#121212] border border-[#C9A227]/40 shadow-xl shadow-black/80 items-center justify-center text-[#C9A227]">
            <Sparkles className="w-5 h-5 animate-pulse text-[#C9A227]" />
          </div>

          {/* Person 1 Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-[#C9A227]/30 backdrop-blur-xl transition-all shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center text-[#C9A227] font-bold">
                  1
                </div>
                <input
                  type="text"
                  value={name1}
                  onChange={(e) => setName1(e.target.value)}
                  placeholder="Person 1 Name"
                  className="bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#C9A227] focus:outline-none text-lg font-bold text-white px-1 py-0.5 transition-all w-36"
                />
              </div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Viewer 1</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                What is {name1} in the mood for?
              </label>
              <textarea
                rows={3}
                value={query1}
                onChange={(e) => setQuery1(e.target.value)}
                placeholder="e.g. A fast sci-fi thriller like Edge of Tomorrow with good humor"
                className="w-full p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] transition-all resize-none"
              />
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
              <span className="text-[11px] text-gray-500 uppercase tracking-wider">Quick Suggestions</span>
              <div className="flex flex-wrap gap-2">
                {PRESETS_PERSON1.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery1(p)}
                    className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-gray-300 hover:text-white border border-white/5 transition-all truncate max-w-full cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Person 2 Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-pink-500/30 backdrop-blur-xl transition-all shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 font-bold">
                  2
                </div>
                <input
                  type="text"
                  value={name2}
                  onChange={(e) => setName2(e.target.value)}
                  placeholder="Person 2 Name"
                  className="bg-transparent border-b border-transparent hover:border-white/20 focus:border-pink-400 focus:outline-none text-lg font-bold text-white px-1 py-0.5 transition-all w-36"
                />
              </div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Viewer 2</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                What is {name2} in the mood for?
              </label>
              <textarea
                rows={3}
                value={query2}
                onChange={(e) => setQuery2(e.target.value)}
                placeholder="e.g. A heartwarming romantic comedy like Crazy Stupid Love"
                className="w-full p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all resize-none"
              />
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
              <span className="text-[11px] text-gray-500 uppercase tracking-wider">Quick Suggestions</span>
              <div className="flex flex-wrap gap-2">
                {PRESETS_PERSON2.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery2(p)}
                    className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-gray-300 hover:text-white border border-white/5 transition-all truncate max-w-full cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleMatch}
            disabled={loading || !query1.trim() || !query2.trim()}
            className="bg-gradient-to-r from-[#C9A227] via-amber-300 to-pink-500 hover:opacity-95 text-black font-extrabold text-base px-10 py-6 rounded-2xl shadow-xl shadow-[#C9A227]/20 flex items-center gap-3 transition-all transform hover:scale-[1.02] active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Blending Cinematic Tastes...</span>
              </>
            ) : (
              <>
                <HeartHandshake className="w-5 h-5" />
                <span>Find The Sweet Spot</span>
              </>
            )}
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm">
            {error}
          </div>
        )}

        {/* Results View */}
        {hasSearched && !loading && (
          <div className="space-y-8 pt-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-2xl font-bold font-serif text-white">
                  The Overlap Collection
                </h2>
                <p className="text-sm text-gray-400">
                  Curated films specifically balanced to satisfy both {name1} and {name2}.
                </p>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/20 text-[#C9A227] text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{results.length} Matches Found</span>
              </div>
            </div>

            {results.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <HelpCircle className="w-10 h-10 mx-auto mb-2 text-gray-500" />
                <p className="text-base font-medium text-gray-300">No direct overlap candidates found</p>
                <p className="text-sm text-gray-500 mt-1">Try broadening your queries or selecting different presets.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((movie, idx) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-[#C9A227]/40 backdrop-blur-md transition-all flex flex-col justify-between space-y-4 shadow-xl"
                  >
                    <div>
                      {/* Movie Card Preview */}
                      <MovieCard
                        movie={{
                          id: String(movie.id),
                          title: movie.title,
                          year: movie.release_date ? parseInt(movie.release_date.split("-")[0], 10) : 2024,
                          posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "",
                          rating: movie.vote_average || 7.5,
                          genres: movie.tags || ["Feature Film"],
                          matchScore: movie.watchComScore || 90,
                          confidence: movie.confidence || "Great Overlap",
                          reason: movie.reason
                        }}
                        idx={idx}
                        showActions={true}
                      />

                      {/* Dual Breakdown Box */}
                      {movie.couplesBreakdown && (
                        <div className="mt-4 p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2.5 text-xs">
                          <div className="flex items-start gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-[#C9A227]/20 text-[#C9A227] font-semibold shrink-0">
                              For {name1}
                            </span>
                            <span className="text-gray-300 leading-relaxed">
                              {movie.couplesBreakdown.forPerson1}
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-400 font-semibold shrink-0">
                              For {name2}
                            </span>
                            <span className="text-gray-300 leading-relaxed">
                              {movie.couplesBreakdown.forPerson2}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
