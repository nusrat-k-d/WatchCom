import { motion } from "framer-motion"
import { Award, Star } from "lucide-react"

interface CinematicMetrics {
  story: number
  characters: number
  emotionalIntensity: number
  storyComplexity: number
  cinematography: number
  visualEffects: number
  soundtrack: number
  pacing: number
  rewatchability: number
  endingImpact: number
}

interface WatchComVerdictProps {
  metrics: CinematicMetrics
  title: string
  voteAverage: number
}

export function WatchComVerdict({ metrics, title, voteAverage }: WatchComVerdictProps) {
  // Translate internal keys to readable text labels
  const metricLabels: Record<keyof CinematicMetrics, string> = {
    story: "masterful storytelling structure",
    characters: "exceptionally deep character arcs",
    emotionalIntensity: "profound emotional resonance",
    storyComplexity: "mind-bending narrative complexity",
    cinematography: "breathtaking visual cinematography",
    visualEffects: "groundbreaking visual effects craftsmanship",
    soundtrack: "an immersive, atmosphere-defining score",
    pacing: "tense, clockwork-like pacing",
    rewatchability: "endlessly rewarding rewatchability",
    endingImpact: "an unforgettable, punch-in-the-gut climax"
  }

  // Algorithm: Find the highest rated metric to highlight in the verdict
  const highestMetricKey = Object.entries(metrics).reduce((a, b) => 
    a[1] > b[1] ? a : b
  )[0] as keyof CinematicMetrics

  const primaryStrength = metricLabels[highestMetricKey] || "superb cinematic execution"
  const starScore = (voteAverage / 2).toFixed(1)

  return (
    <motion.section 
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="py-12 w-full max-w-4xl mx-auto text-center"
      aria-labelledby="verdict-heading"
    >
      <div className="bg-gradient-to-br from-[#1c1912] via-[#09090a] to-[#040404] border border-[#C9A227]/30 p-10 md:p-14 rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(201,162,39,0.05)] relative overflow-hidden group">
        
        {/* Soft gold backdrop highlights */}
        <div className="absolute -top-[20%] left-[30%] w-[350px] h-[350px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06),transparent_75%)] pointer-events-none z-0 blur-[50px]" />
        
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#C9A227]/10 border border-[#C9A227]/25 px-4 py-2 rounded-full text-xs font-bold tracking-widest text-[#C9A227] uppercase font-mono shadow-md">
            <Award className="h-4 w-4 text-[#C9A227]" /> WatchCom Verdict
          </div>

          <h3 id="verdict-heading" className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            The Final Takeaway
          </h3>

          <p className="text-gray-300 text-base sm:text-lg lg:text-xl font-light font-serif leading-relaxed max-w-3xl mx-auto">
            {title} is a landmark feature that cements its status as a must-watch, largely driven by its <span className="text-[#C9A227] font-semibold">{primaryStrength}</span>. Holding a strong <span className="text-[#C9A227] font-semibold">{starScore}/5 stars</span>, it stands as an elite selection tailored for viewers looking for top-tier cinematic achievements.
          </p>

          <div className="flex justify-center gap-1.5 pt-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`h-5 w-5 ${parseFloat(starScore) >= star ? "fill-[#C9A227] text-[#C9A227]" : "text-gray-800"}`} 
              />
            ))}
          </div>
        </div>

      </div>
    </motion.section>
  )
}
