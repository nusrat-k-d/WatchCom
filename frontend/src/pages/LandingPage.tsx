import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Sparkles, Brain, Compass, MessageSquare, ArrowRight } from "lucide-react"

export function LandingPage() {
  const navigate = useNavigate()

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  } as const

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-[#050505] text-[#F5F5F5] relative overflow-hidden">
      
      {/* Premium Luxury Background Ambient Glows */}
      <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.06),transparent_60%)] pointer-events-none z-0 blur-[50px]" />
      <div className="absolute top-[50%] right-[10%] w-[350px] h-[350px] bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.02),transparent_75%)] pointer-events-none z-0 blur-[60px]" />
      
      {/* Hero Header Section */}
      <section className="flex-1 flex items-center justify-center py-20 px-4 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="max-w-5xl w-full text-center flex flex-col items-center"
        >
          
          {/* Subtle tag badge */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 bg-[#C9A227]/5 border border-[#C9A227]/25 px-4.5 py-1.5 rounded-full text-[10px] font-bold tracking-widest text-[#C9A227] uppercase mb-8 shadow-xl font-mono"
          >
            <Sparkles className="h-3.5 w-3.5 fill-[#C9A227] text-[#C9A227]" />
            A new era of recommendation
          </motion.div>

          {/* Luxury Main Title */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-6xl md:text-8xl font-serif font-black tracking-tight mb-6 text-white leading-none uppercase max-w-4xl"
          >
            Finding stories <br/>
            <span className="text-[#C9A227]">worth remembering</span>
          </motion.h1>

          {/* Elevator Pitch Description */}
          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg md:text-xl text-gray-500 mb-12 max-w-2xl font-light leading-relaxed font-sans"
          >
            WatchCom is a minimal, AI-first film director that translates your mood, situations, and subtext into exact movie profiles—bypassing generic genre tags.
          </motion.p>

          {/* Core Call to Action */}
          <motion.div variants={fadeInUp} className="mb-24">
            <button
              onClick={() => navigate("/discover")}
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-[var(--color-gold)] to-[#b5952f] text-black px-10 py-5 rounded-2xl font-bold text-base hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shadow-[0_4px_30px_rgba(212,175,55,0.25)] hover:shadow-[0_4px_35px_rgba(212,175,55,0.45)] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
            >
              <Brain className="h-5 w-5 fill-black" />
              <span>Launch AI Assistant</span>
              <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
          </motion.div>

          {/* 3 Pillars Flowchart Explanation */}
          <motion.div 
            variants={fadeInUp}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left max-w-4xl border-t border-white/5 pt-16 relative z-10"
          >
            {/* Pillar 1 */}
            <div className="space-y-4 p-6 bg-[#0b0b0c]/30 border border-white/5 rounded-2xl shadow-xl hover:border-[#C9A227]/20 transition-all duration-500">
              <div className="h-10 w-10 bg-[#C9A227]/10 border border-[#C9A227]/20 rounded-xl flex items-center justify-center text-[#C9A227]">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">1. Describe What You Want</h3>
              <p className="text-sm text-gray-500 font-light leading-relaxed">
                Describe a complex feeling, a rainy day setup, or a movie combination in normal human sentences.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="space-y-4 p-6 bg-[#0b0b0c]/30 border border-white/5 rounded-2xl shadow-xl hover:border-[#C9A227]/20 transition-all duration-500">
              <div className="h-10 w-10 bg-[#C9A227]/10 border border-[#C9A227]/20 rounded-xl flex items-center justify-center text-[#C9A227]">
                <Brain className="h-5 w-5 animate-pulse" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">2. AI Maps Intent</h3>
              <p className="text-sm text-gray-500 font-light leading-relaxed">
                WatchCom extracts thematic vibe tags, pacing complexity curves, and language metrics from your input.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="space-y-4 p-6 bg-[#0b0b0c]/30 border border-white/5 rounded-2xl shadow-xl hover:border-[#C9A227]/20 transition-all duration-500">
              <div className="h-10 w-10 bg-[#C9A227]/10 border border-[#C9A227]/20 rounded-xl flex items-center justify-center text-[#C9A227]">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">3. Get Custom Matches</h3>
              <p className="text-sm text-gray-500 font-light leading-relaxed">
                Explore a highly tailored profile of movie recommendations complete with animated concentric stats.
              </p>
            </div>
          </motion.div>

        </motion.div>
      </section>
    </div>
  )
}
