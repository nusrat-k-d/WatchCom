import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, TrendingUp, Info, ShieldCheck, HelpCircle, Activity, Target, Users, Clapperboard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { MOCK_MOVIES } from "../lib/mock-data"
import { useState } from "react"
import { useTaste } from "../context/UserTasteContext"

export function RecommendationsPage() {
  const { isDismissed, dismissMovie, metrics } = useTaste()
  const recommendations = [...MOCK_MOVIES]
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .filter(m => !isDismissed(m.id))
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id)
  }

  const getConfidenceIcon = (label?: string) => {
    if (label === "High") return <ShieldCheck className="h-4 w-4 text-green-400" />
    if (label === "Medium") return <Activity className="h-4 w-4 text-[var(--color-gold)]" />
    return <HelpCircle className="h-4 w-4 text-purple-400" />
  }

  const getConfidenceColor = (label?: string) => {
    if (label === "High") return "text-green-400 border-green-400/30 bg-green-400/10"
    if (label === "Medium") return "text-[var(--color-gold)] border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10"
    return "text-purple-400 border-purple-400/30 bg-purple-400/10"
  }

  return (
    <div className="container mx-auto px-4 py-12 pb-24">
      {/* Hero */}
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center justify-center p-4 bg-[#0f0f0f] border border-white/5 rounded-full mb-6 shadow-xl"
        >
          <Sparkles className="h-8 w-8 text-[var(--color-gold)]" />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4"
        >
          Your Taste Vector Matches
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-[var(--color-text-secondary)]"
        >
          Curated explicitly for your profile. We explain exactly why each film was chosen for you.
        </motion.p>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        <Card className="bg-[#0f0f0f] border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider font-bold text-gray-500">Taste Profile Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white flex items-center gap-2">
              {metrics.profileStrength}%
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#0f0f0f] border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider font-bold text-gray-500">Discovery Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">92 <span className="text-sm text-[var(--color-text-secondary)]">/ 100</span></p>
          </CardContent>
        </Card>
        <Card className="bg-[#0f0f0f] border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider font-bold text-gray-500">Movies Rated</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">{metrics.totalRated}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-[#1a1814] to-[#0a0a0a] border-[var(--color-gold)]/20 shadow-[0_0_15px_rgba(212,175,55,0.05)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider font-bold text-[var(--color-gold)]">Global Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--color-gold)] flex items-center gap-2">
              {metrics.confidence > 70 ? "High" : "Learning"} <TrendingUp className="h-5 w-5" />
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recommendation List */}
      <div className="space-y-12">
        {recommendations.map((movie, idx) => (
          <motion.div 
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 bg-[#0f0f0f] rounded-2xl border border-white/5 p-4 shadow-2xl">
              {/* Poster */}
              <Link to={`/movie/${movie.id}`} className="md:w-1/4 shrink-0 overflow-hidden rounded-xl border border-white/5">
                <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover aspect-[2/3]" />
              </Link>
              
              {/* Content */}
              <div className="flex flex-col flex-1 py-2 pr-4">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="bg-[var(--color-gold)] text-black px-3 py-1 rounded font-bold text-sm">
                    {movie.matchScore}% Match
                  </div>
                  <div className={`px-3 py-1 rounded text-xs font-bold border flex items-center gap-1 ${getConfidenceColor(movie.confidenceLabel)}`}>
                    {getConfidenceIcon(movie.confidenceLabel)} {movie.confidenceLabel} Confidence
                  </div>
                </div>
                
                <Link to={`/movie/${movie.id}`}>
                  <h2 className="text-3xl font-bold mb-2 hover:text-[var(--color-gold)] transition-colors">{movie.title}</h2>
                </Link>
                
                <div className="text-xs font-medium text-gray-400 mb-6 flex flex-wrap gap-x-4 gap-y-2">
                  <span>{movie.year}</span>
                  <span>{movie.runtime}</span>
                  <span>Dir: {movie.director}</span>
                </div>
                
                <p className="text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                  {movie.overview}
                </p>

                {movie.hiddenGemReason && (
                  <div className="bg-purple-500/10 border border-purple-500/20 text-purple-300 px-4 py-3 rounded-lg text-sm mb-6 flex gap-3">
                    <Sparkles className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                      <strong>Hidden Gem Discovery:</strong> {movie.hiddenGemReason}
                    </div>
                  </div>
                )}
                
                <div className="mt-auto pt-6 border-t border-white/5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <button 
                      onClick={() => toggleExpand(movie.id)}
                      className="flex items-center gap-2 text-sm font-medium text-[var(--color-gold)] hover:text-white transition-colors"
                    >
                      <Info className="h-4 w-4" /> 
                      {expandedId === movie.id ? "Hide AI Reasoning" : "Explain Match Score"}
                    </button>
                    
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => dismissMovie(movie.id, "already_seen")}
                        className="text-xs px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      >
                        Already Seen
                      </button>
                      <button 
                        onClick={() => dismissMovie(movie.id, "not_interested")}
                        className="text-xs px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      >
                        Not Interested
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === movie.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-6 border-t border-white/5 mt-6">
                          <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Why This Recommendation Exists</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-[#141414] rounded-lg p-4 border border-[var(--color-gold)]/10 flex gap-3">
                              <div className="mt-0.5"><Target className="h-4 w-4 text-[var(--color-gold)]" /></div>
                              <div>
                                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Genre Alignment</div>
                                <div className="text-sm text-gray-300">You consistently rate <strong>{movie.genres[0]}</strong> highly. This film aligns strongly with your core affinity.</div>
                              </div>
                            </div>
                            <div className="bg-[#141414] rounded-lg p-4 border border-[var(--color-gold)]/10 flex gap-3">
                              <div className="mt-0.5"><Users className="h-4 w-4 text-[var(--color-gold)]" /></div>
                              <div>
                                <div className="text-xs text-gray-500 uppercase font-bold mb-1">User Similarity</div>
                                <div className="text-sm text-gray-300">Users with identical taste clusters to yours loved this film, rating it 4.5 stars on average.</div>
                              </div>
                            </div>
                            {movie.director && (
                            <div className="bg-[#141414] rounded-lg p-4 border border-[var(--color-gold)]/10 flex gap-3">
                              <div className="mt-0.5"><Clapperboard className="h-4 w-4 text-[var(--color-gold)]" /></div>
                              <div>
                                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Director Affinity</div>
                                <div className="text-sm text-gray-300">Features directorial themes commonly found in your top-rated films by <strong>{movie.director}</strong>.</div>
                              </div>
                            </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
