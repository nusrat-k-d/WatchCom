import { motion } from "framer-motion"
import { Sparkles, Brain, FileText } from "lucide-react"
import type { AICinematicData } from "../../../lib/ai-profile"

interface AISectionProps {
  aiData: AICinematicData
}

export function AISection({ aiData }: AISectionProps) {
  // Animation presets for entrance
  const fadeInUp = {
    initial: { opacity: 0, y: 35 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: "easeOut" }
  } as const

  return (
    <div className="space-y-16 py-10">
      
      {/* 1. AI SUMMARY CARD */}
      <motion.section 
        {...fadeInUp}
        className="w-full text-left"
        aria-labelledby="ai-summary-heading"
      >
        <div className="bg-[#0b0b0c]/60 backdrop-blur-md border border-white/5 p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden group hover:border-white/10 transition-colors duration-500">
          {/* Decorative ambient gold glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03),transparent_70%)] pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-[#C9A227]/10 border border-[#C9A227]/20 rounded-xl">
              <Sparkles className="h-5 w-5 text-[#C9A227]" />
            </div>
            <h2 id="ai-summary-heading" className="text-xs uppercase tracking-widest text-[#C9A227] font-bold font-mono">
              ✨ AI Summary
            </h2>
          </div>
          
          <p className="text-xl sm:text-2xl lg:text-3xl font-serif font-light leading-relaxed text-gray-200 tracking-wide">
            {aiData.aiSummary}
          </p>
        </div>
      </motion.section>

      {/* 2. WHY RECOMMENDATION CONTAINER (CONVERSATIONAL INTERFACE) */}
      <motion.section 
        {...fadeInUp}
        className="w-full text-left"
        aria-labelledby="ai-recommendation-heading"
      >
        <div className="bg-gradient-to-br from-[#0e0d0b] to-[#050505] border border-[#C9A227]/15 p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden">
          {/* Radiant gold back-glow */}
          <div className="absolute -top-[10%] left-[5%] w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05),transparent_70%)] pointer-events-none z-0 blur-[40px]" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
            {/* Pulsing AI Brain avatar */}
            <div className="relative w-14 h-14 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/25 flex items-center justify-center shrink-0 shadow-lg">
              <div className="absolute inset-0 rounded-2xl border border-[var(--color-gold)]/20 animate-ping opacity-60" style={{ animationDuration: '3s' }} />
              <Brain className="h-7 w-7 text-[#C9A227] animate-pulse" />
            </div>

            <div className="space-y-4">
              <h2 id="ai-recommendation-heading" className="text-xs uppercase tracking-widest text-[#C9A227] font-bold font-mono">
                🧠 Why WatchCom Recommended This
              </h2>
              <p className="text-lg sm:text-xl font-light text-gray-300 leading-relaxed font-sans max-w-4xl">
                {aiData.whyWatch}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 3. PROFESSIONAL EDITORIAL AI REVIEW */}
      <motion.section 
        {...fadeInUp}
        className="w-full text-left flex flex-col items-center lg:items-start"
        aria-labelledby="ai-review-heading"
      >
        <div className="w-full max-w-3xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
            <div className="p-2 bg-white/5 border border-white/10 rounded-lg">
              <FileText className="h-4 w-4 text-gray-400" />
            </div>
            <h2 id="ai-review-heading" className="text-xs uppercase tracking-widest text-gray-400 font-bold font-mono">
              🎬 AI Review
            </h2>
          </div>
          
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-lg text-gray-300 font-serif font-light leading-relaxed tracking-wide first-letter:text-5xl first-letter:font-bold first-letter:text-[#C9A227] first-letter:mr-3 first-letter:float-left first-letter:font-serif">
              {aiData.aiReview}
            </p>
          </div>
        </div>
      </motion.section>

    </div>
  )
}
