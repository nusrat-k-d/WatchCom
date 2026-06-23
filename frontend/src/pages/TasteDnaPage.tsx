import { motion } from "framer-motion"
import { Dna, Target, Clapperboard, Star, TrendingUp, Users, Compass, Zap } from "lucide-react"
import { ProfileCompletion } from "../components/profile/ProfileCompletion"
import { useTaste } from "../context/UserTasteContext"

export function TasteDnaPage() {
  const { metrics, ratings } = useTaste()
  const affinities = [
    { genre: "Sci-Fi", score: 92 },
    { genre: "Thriller", score: 87 },
    { genre: "Drama", score: 74 },
    { genre: "Mystery", score: 65 },
    { genre: "Comedy", score: 31 },
    { genre: "Romance", score: 12 },
  ]

  const ratingDistribution = [
    { stars: 5, count: ratings.filter(r => r.score === 5).length, color: "bg-[var(--color-gold)]" },
    { stars: 4, count: ratings.filter(r => r.score === 4).length, color: "bg-[var(--color-gold)]/80" },
    { stars: 3, count: ratings.filter(r => r.score === 3).length, color: "bg-[var(--color-gold)]/60" },
    { stars: 2, count: ratings.filter(r => r.score === 2).length, color: "bg-[var(--color-gold)]/40" },
    { stars: 1, count: ratings.filter(r => r.score === 1).length, color: "bg-[var(--color-gold)]/20" },
  ]


  
  const directors = [
    { name: "Christopher Nolan", score: 95 },
    { name: "Denis Villeneuve", score: 88 },
    { name: "David Fincher", score: 82 },
  ]
  
  const actors = [
    { name: "Christian Bale", score: 91 },
    { name: "Matthew McConaughey", score: 86 },
    { name: "Amy Adams", score: 79 },
  ]

  return (
    <div className="container mx-auto px-4 py-12 pb-24">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-2 flex items-center gap-4">
            <Dna className="h-10 w-10 text-[var(--color-gold)]" />
            Taste DNA
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)]">The mathematical breakdown of your cinematic preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Taste Archetype */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-gradient-to-br from-[#1a1814] to-[#0a0a0a] border border-[var(--color-gold)]/20 p-8 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-gold)]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="h-32 w-32 shrink-0 rounded-full bg-black border-2 border-[var(--color-gold)]/30 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.15)]">
            <Compass className="h-16 w-16 text-[var(--color-gold)]" />
          </div>
          <div className="text-center md:text-left relative z-10">
            <div className="text-[var(--color-gold)] text-sm font-bold tracking-widest uppercase mb-2">Taste Archetype</div>
            <h2 className="text-4xl font-serif font-bold text-white mb-4">The Explorer</h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
              You enjoy ambitious science fiction, psychological thrillers, and thought-provoking narratives. You value complex plots and strong directorial vision over simple entertainment.
            </p>
          </div>
        </motion.div>

        {/* Profile Completion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ProfileCompletion />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Genre Affinity Column */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0f0f0f] border border-white/5 p-8 rounded-2xl shadow-xl"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Target className="h-5 w-5 text-[var(--color-gold)]" /> Genre Affinity Map
            </h2>
            <div className="space-y-6">
              {affinities.map((item, idx) => (
                <div key={item.genre} className="relative">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-white">{item.genre}</span>
                    <span className="text-[var(--color-gold)]">{item.score}%</span>
                  </div>
                  <div className="w-full h-3 bg-black rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className="h-full bg-[var(--color-gold)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#0f0f0f] border border-white/5 p-8 rounded-2xl shadow-xl"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Clapperboard className="h-5 w-5 text-[var(--color-gold)]" /> Director Affinity
              </h2>
              <div className="space-y-6">
                {directors.map((item, idx) => (
                  <div key={item.name} className="relative">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-white">{item.name}</span>
                      <span className="text-[var(--color-gold)]">{item.score}%</span>
                    </div>
                    <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className="h-full bg-[var(--color-gold)]/80"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#0f0f0f] border border-white/5 p-8 rounded-2xl shadow-xl"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Users className="h-5 w-5 text-[var(--color-gold)]" /> Actor Affinity
              </h2>
              <div className="space-y-6">
                {actors.map((item, idx) => (
                  <div key={item.name} className="relative">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-white">{item.name}</span>
                      <span className="text-[var(--color-gold)]">{item.score}%</span>
                    </div>
                    <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className="h-full bg-[var(--color-gold)]/60"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Analytics Column */}
        <div className="space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#0f0f0f] border border-white/5 p-8 rounded-2xl shadow-xl"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Zap className="h-5 w-5 text-[var(--color-gold)]" /> Recommendation Confidence
            </h2>
            <div className="flex items-center justify-center mb-6 relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-black" />
                <motion.circle 
                  cx="64" 
                  cy="64" 
                  r="60" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray="376.99" 
                  initial={{ strokeDashoffset: 376.99 }}
                  animate={{ strokeDashoffset: 376.99 - (376.99 * (metrics.confidence / 100)) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="text-[var(--color-gold)]" 
                />
              </svg>
              <div className="absolute text-3xl font-bold text-white">{metrics.confidence}%</div>
            </div>
            <p className="text-center text-sm text-gray-400">Your profile data is highly robust, allowing for extremely accurate predictions.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-[#0f0f0f] border border-white/5 p-8 rounded-2xl shadow-xl"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Star className="h-5 w-5 text-[var(--color-gold)]" /> Rating Distribution
            </h2>
            <div className="flex flex-col gap-3 mb-6">
              {ratingDistribution.map((item, idx) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <div className="w-12 text-sm text-gray-400 flex items-center gap-1">
                    {item.stars} <Star className="h-3 w-3 fill-current" />
                  </div>
                  <div className="flex-1 h-6 bg-black rounded overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${metrics.totalRated > 0 ? (item.count / metrics.totalRated) * 100 : 0}%` }}
                      transition={{ duration: 1, delay: 0.7 + (idx * 0.1) }}
                      className={`h-full ${item.color}`}
                    />
                  </div>
                  <div className="w-8 text-right text-xs text-gray-500">{item.count}</div>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-white/10 flex justify-between items-center">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Average Rating</div>
                <div className="text-2xl font-bold text-white flex items-baseline gap-1">{metrics.averageRating.toFixed(1)} <Star className="h-4 w-4 fill-[var(--color-gold)] text-[var(--color-gold)]" /></div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Ratings</div>
                <div className="text-2xl font-bold text-white">{metrics.totalRated}</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-[#0f0f0f] border border-white/5 p-8 rounded-2xl shadow-xl text-center"
          >
            <TrendingUp className="h-8 w-8 text-[var(--color-gold)] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Taste Evolution Timeline</h3>
            <p className="text-sm text-gray-400 mb-6">Your preference for cerebral Sci-Fi has increased by 14% over the last 6 months.</p>
            <div className="h-24 w-full bg-black/40 rounded-lg border border-white/5 flex items-end px-2 gap-1 pb-2">
              {[40, 45, 42, 55, 60, 75, 82, 85, 90, 92].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 1, delay: 0.8 + (i * 0.05) }}
                  className="flex-1 bg-[var(--color-gold)]/80 rounded-t-sm"
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500 uppercase tracking-wider font-bold">
              <span>6 mos ago</span>
              <span>Today</span>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  )
}
