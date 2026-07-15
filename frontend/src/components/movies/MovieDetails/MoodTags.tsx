import { motion } from "framer-motion"
import { Tag } from "lucide-react"

interface MoodTagsProps {
  moodTags: string[]
}

export function MoodTags({ moodTags }: MoodTagsProps) {
  if (moodTags.length === 0) return null

  // Staggered list container animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    whileInView: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    },
    viewport: { once: true, margin: "-100px" }
  }

  const tagVariants = {
    initial: { opacity: 0, y: 15 },
    whileInView: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  }

  return (
    <motion.section 
      variants={containerVariants}
      initial="initial"
      whileInView="whileInView"
      viewport={{ once: true, margin: "-100px" }}
      className="space-y-6 py-10 text-left w-full"
      aria-labelledby="mood-tags-heading"
    >
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <div className="p-2 bg-white/5 border border-white/10 rounded-lg">
          <Tag className="h-4 w-4 text-gray-400" />
        </div>
        <h2 id="mood-tags-heading" className="text-xs uppercase tracking-widest text-gray-400 font-bold font-mono">
          💭 Mood & Tone Tags
        </h2>
      </div>

      <div className="flex flex-wrap gap-3">
        {moodTags.map((tag) => (
          <motion.span 
            key={tag}
            variants={tagVariants}
            whileHover={{ 
              scale: 1.05, 
              borderColor: "rgba(212,175,55,0.3)", 
              color: "#C9A227",
              boxShadow: "0 4px 15px rgba(201, 162, 39, 0.08)"
            }}
            className="px-5 py-2.5 rounded-full bg-[#0b0b0c]/40 border border-white/5 text-xs font-semibold text-gray-300 cursor-pointer shadow-md select-none transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A227]"
            tabIndex={0}
            aria-label={`Mood tag: ${tag}`}
          >
            #{tag}
          </motion.span>
        ))}
      </div>
    </motion.section>
  )
}
