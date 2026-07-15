import { motion } from "framer-motion"
import { MessageSquare } from "lucide-react"

interface DiscussionQuestionsProps {
  questions: string[]
}

export function DiscussionQuestions({ questions }: DiscussionQuestionsProps) {
  if (questions.length === 0) return null

  const containerVariants = {
    initial: { opacity: 0 },
    whileInView: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    },
    viewport: { once: true, margin: "-100px" }
  }

  const itemVariants = {
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
      className="space-y-8 py-10 text-left w-full border-t border-white/5"
      aria-labelledby="discussion-heading"
    >
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <div className="p-2 bg-white/5 border border-white/10 rounded-lg">
          <MessageSquare className="h-4 w-4 text-gray-400" />
        </div>
        <h2 id="discussion-heading" className="text-xs uppercase tracking-widest text-gray-400 font-bold font-mono">
          💭 AI Discussion Questions
        </h2>
      </div>

      <div className="space-y-4 max-w-4xl">
        {questions.map((q, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            whileHover={{ x: 6, borderColor: "rgba(201,162,39,0.25)" }}
            className="flex gap-5 p-5 md:p-6 rounded-[1.5rem] bg-[#0b0b0c]/40 border border-white/5 font-serif font-light text-gray-300 text-sm sm:text-base leading-relaxed hover:bg-black/30 transition-all duration-300 select-none cursor-pointer"
          >
            <span className="text-[#C9A227] font-bold font-mono text-sm sm:text-base select-none shrink-0 mt-0.5">
              {(i + 1).toString().padStart(2, "0")}
            </span>
            <p>{q}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
