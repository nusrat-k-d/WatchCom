import { motion } from "framer-motion"
import { Award, Film, Sparkles, Heart, BookOpen, Clapperboard, Compass, Zap, HelpCircle } from "lucide-react"

interface ReasonsToWatchProps {
  reasons: string[]
}

export function ReasonsToWatch({ reasons }: ReasonsToWatchProps) {
  if (reasons.length === 0) return null

  // Assign clean icons to index values
  const icons = [Award, Film, Sparkles, Heart, BookOpen, Clapperboard, Compass, Zap]

  const containerVariants = {
    initial: { opacity: 0 },
    whileInView: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    },
    viewport: { once: true, margin: "-100px" }
  }

  const cardVariants = {
    initial: { opacity: 0, y: 25 },
    whileInView: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  }

  return (
    <motion.section 
      variants={containerVariants}
      initial="initial"
      whileInView="whileInView"
      viewport={{ once: true, margin: "-100px" }}
      className="space-y-10 py-10 text-left w-full border-t border-white/5"
      aria-labelledby="reasons-heading"
    >
      <div className="text-center max-w-xl mx-auto mb-6">
        <h2 id="reasons-heading" className="text-3xl font-serif font-bold text-white mb-3">
          Five Reasons to Watch
        </h2>
        <p className="text-sm text-gray-500 font-light font-sans">
          Curated attributes parsed from the film's artistic profile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {reasons.map((reason, idx) => {
          const IconComponent = icons[idx % icons.length] || HelpCircle
          
          return (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ 
                y: -6, 
                borderColor: "rgba(201,162,39,0.3)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(201,162,39,0.05)"
              }}
              className="bg-[#0b0b0c]/40 border border-white/5 p-8 rounded-[2rem] shadow-2xl flex flex-col justify-between items-start text-left hover:bg-black/40 transition-all duration-300 relative group"
            >
              {/* Subtle backglow in card */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.015),transparent_70%)] pointer-events-none" />
              
              <div className="h-11 w-11 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center text-[#C9A227] mb-6 group-hover:bg-[#C9A227]/20 group-hover:border-[#C9A227]/40 transition-colors duration-300">
                <IconComponent className="h-5 w-5" />
              </div>
              
              <p className="text-gray-400 text-sm font-sans font-light leading-relaxed flex-1 group-hover:text-gray-300 transition-colors duration-300">
                {reason}
              </p>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}
