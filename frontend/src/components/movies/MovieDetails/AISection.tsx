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
  const fadeInUp = {
    initial: { opacity: 0, y: 25 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.6, ease: "easeOut" }
  } as const

  const hasValidInsight = Boolean(
    aiInsight && (
      (typeof aiInsight.matchScore === "number" && aiInsight.matchScore > 0) ||
      (typeof aiInsight.reason === "string" && aiInsight.reason.trim().length > 0)
    )
  )

  return (
    <div className="space-y-6 py-4">
      
      {/* 1. AI SUMMARY CARD */}
      <motion.section 
        {...fadeInUp}
        className="w-full text-left"
        aria-labelledby="ai-summary-heading"
      >
        <div className="bg-[#09090c]/80 backdrop-blur-md border border-white/[0.08] p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden group">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-1.5 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-lg text-[#C5A059]">
              <Sparkles className="h-4 w-4" />
            </div>
            <h2 id="ai-summary-heading" className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-medium font-mono">
              ✦ Film Profile & Telemetry
            </h2>
          </div>
          
          <p className="text-base sm:text-lg font-serif font-normal leading-relaxed text-zinc-300">
            {aiData.aiSummary}
          </p>
        </div>
      </motion.section>

      {/* 2. AI INSIGHT CARD (Conditionally Rendered) */}
      {hasValidInsight && aiInsight && (
        <motion.section 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="w-full text-left"
          aria-labelledby="ai-insight-heading"
        >
          <div className="bg-[#09090c]/80 backdrop-blur-md border border-[#C5A059]/25 p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-lg text-[#C5A059]">
                  <Brain className="h-4 w-4" />
                </div>
                <div>
                  <h2 id="ai-insight-heading" className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-medium font-mono">
                    ✦ AI Intent Mapping
                  </h2>
                  <p className="text-[10px] text-zinc-500 font-light mt-0.5">
                    Relevance to your search context.
                  </p>
                </div>
              </div>

              {/* Match Score Badge */}
              {aiInsight.matchScore !== undefined && aiInsight.matchScore > 0 && (
                <div className="flex items-center gap-2">
                  <div className="text-left md:text-right">
                    <div className="text-lg font-serif font-normal text-[#F0EDE6] leading-none">
                      {aiInsight.matchScore}% Match
                    </div>
                    {aiInsight.confidence && (
                      <div className="text-[9px] text-zinc-500 font-mono uppercase font-semibold tracking-wider mt-1">
                        {aiInsight.confidence}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Why Recommended */}
            {aiInsight.reason && (
              <div className="mt-4 space-y-1.5">
                <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 font-mono">
                  Recommendation Vector
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 font-sans font-light leading-relaxed max-w-3xl">
                  {aiInsight.reason}
                </p>
              </div>
            )}

            {/* Tags */}
            {aiInsight.tags && aiInsight.tags.length > 0 && (
              <div className="mt-5 space-y-2">
                <h4 className="text-[9px] font-mono font-medium tracking-widest uppercase text-zinc-500">
                  Resonance Tags
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {aiInsight.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="text-[11px] px-3 py-1 bg-white/[0.04] border border-white/[0.08] text-zinc-300 rounded-full font-mono font-light"
                    >
                      {tag}
                    </span>
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
