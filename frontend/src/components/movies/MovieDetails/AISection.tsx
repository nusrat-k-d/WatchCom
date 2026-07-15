import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
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
    <div className="py-6">
      
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

    </div>
  )
}
