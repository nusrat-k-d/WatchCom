import { motion } from "framer-motion"
import { Sparkles, Brain } from "lucide-react"
import type { AICinematicData } from "../../../lib/ai-profile"

interface AIInsight {
  matchScore: number
  confidence: string
  reason: string
  tags: string[]
}

interface AISectionProps {
  aiData: AICinematicData
  aiInsight?: AIInsight | null
}

export function AISection({ aiData, aiInsight }: AISectionProps) {
  // Animation presets for entrance
  const fadeInUp = {
    initial: { opacity: 0, y: 35 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: "easeOut" }
  } as const

  return (
    <div className="space-y-8 py-6">
      
      {/* 1. AI SUMMARY CARD */}
      <motion.section 
        {...fadeInUp}
        className="w-full text-left"
        aria-labelledby="ai-summary-heading"
      >
        <div className="bg-[#0b0b0c]/60 backdrop-blur-md border border-white/5 p-8 md:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group hover:border-white/10 transition-colors duration-500">
          {/* Decorative ambient gold glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03),transparent_70%)] pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-[#C9A227]/10 border border-[#C9A227]/20 rounded-xl">
              <Sparkles className="h-4.5 w-4.5 text-[#C9A227]" />
            </div>
            <h2 id="ai-summary-heading" className="text-xs uppercase tracking-widest text-[#C9A227] font-bold font-mono">
              ✨ Summary
            </h2>
          </div>
          
          <p className="text-base sm:text-lg lg:text-xl font-serif font-light leading-relaxed text-gray-300 tracking-wide">
            {aiData.aiSummary}
          </p>
        </div>
      </motion.section>

      {/* 2. AI INSIGHT CARD (Conditionally Rendered) */}
      {aiInsight && (
        <motion.section 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="w-full text-left"
          aria-labelledby="ai-insight-heading"
        >
          <div className="bg-[#0b0b0c]/60 backdrop-blur-md border border-[#C9A227]/20 p-8 md:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group hover:border-[#C9A227]/30 transition-all duration-500">
            {/* Backdrop ambient glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.04),transparent_70%)] pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#C9A227]/10 border border-[#C9A227]/20 rounded-xl">
                  <Brain className="h-4.5 w-4.5 text-[#C9A227]" />
                </div>
                <div>
                  <h2 id="ai-insight-heading" className="text-xs uppercase tracking-widest text-[#C9A227] font-bold font-mono">
                    🧠 AI Insight
                  </h2>
                  <p className="text-[10px] text-gray-500 font-light mt-0.5">
                    How this film maps to your search request.
                  </p>
                </div>
              </div>

              {/* Match Score Badge */}
              <div className="flex items-center gap-3">
                <div className="text-left md:text-right">
                  <div className="text-xl font-serif font-black text-white leading-none">
                    {aiInsight.matchScore}% Match
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono uppercase font-bold tracking-wider mt-1.5">
                    {aiInsight.confidence}
                  </div>
                </div>
              </div>
            </div>

            {/* Why Recommended */}
            <div className="mt-6 space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-mono">
                Why WatchCom Recommended This
              </h3>
              <p className="text-base text-gray-300 font-sans font-light leading-relaxed max-w-3xl">
                {aiInsight.reason}
              </p>
            </div>

            {/* Tags */}
            {aiInsight.tags && aiInsight.tags.length > 0 && (
              <div className="mt-8 space-y-3">
                <h4 className="text-[10px] font-mono font-bold tracking-widest uppercase text-gray-500">
                  Match Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {aiInsight.tags.map((tag, idx) => (
                    <motion.span 
                      key={tag}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      className="text-xs px-3.5 py-1.5 bg-white/5 border border-white/10 hover:border-[#C9A227]/20 text-gray-300 hover:text-white rounded-full transition-all duration-300 shadow-md font-medium"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.section>
      )}

    </div>
  )
}
