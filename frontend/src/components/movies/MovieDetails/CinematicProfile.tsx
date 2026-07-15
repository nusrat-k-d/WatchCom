import React, { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Activity } from "lucide-react"

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

interface CinematicProfileProps {
  metrics: CinematicMetrics
}

export function CinematicProfile({ metrics }: CinematicProfileProps) {
  // Map metrics payload to a cleaner array list
  const metricsList = [
    { label: "Story", value: metrics.story },
    { label: "Characters", value: metrics.characters },
    { label: "Emotional Intensity", value: metrics.emotionalIntensity },
    { label: "Complexity", value: metrics.storyComplexity },
    { label: "Cinematography", value: metrics.cinematography },
    { label: "Visual Effects", value: metrics.visualEffects },
    { label: "Soundtrack", value: metrics.soundtrack },
    { label: "Pacing", value: metrics.pacing },
    { label: "Rewatchability", value: metrics.rewatchability },
    { label: "Ending Impact", value: metrics.endingImpact }
  ]

  return (
    <motion.section 
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="space-y-10 py-10 text-left w-full"
      aria-labelledby="cinematic-profile-heading"
    >
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <div className="p-2 bg-[#C9A227]/10 border border-[#C9A227]/20 rounded-lg">
          <Activity className="h-4 w-4 text-[#C9A227]" />
        </div>
        <h2 id="cinematic-profile-heading" className="text-xs uppercase tracking-widest text-[#C9A227] font-bold font-mono">
          📊 Cinematic DNA Profile
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {metricsList.map((item) => (
          <CircularProgressMetric 
            key={item.label} 
            label={item.label} 
            value={item.value} 
          />
        ))}
      </div>
    </motion.section>
  )
}

interface CircularProgressMetricProps {
  value: number
  label: string
}

// Subcomponent representing a single animated indicator circle
const CircularProgressMetric = React.memo(function CircularProgressMetric({ value, label }: CircularProgressMetricProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [currentVal, setCurrentVal] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 1.4
    const totalFrames = duration * 60
    const increment = value / totalFrames
    let frame = 0
    const timer = setInterval(() => {
      frame++
      start += increment
      if (frame >= totalFrames) {
        setCurrentVal(value)
        clearInterval(timer)
      } else {
        setCurrentVal(start)
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [isInView, value])

  const radius = 30
  const strokeWidth = 3
  const circumference = 2 * Math.PI * radius
  // NormalizeTMDB values (mostly out of 10) to progress arcs
  const strokeDashoffset = circumference - (currentVal / 10) * circumference

  return (
    <div 
      ref={ref} 
      className="flex flex-col items-center justify-between text-center p-6 bg-[#0b0b0c]/40 border border-white/5 rounded-3xl transition-all duration-300 hover:border-white/15 hover:bg-black/60 hover:-translate-y-1 hover:shadow-2xl select-none group"
    >
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* SVG background & foreground progress arcs */}
        <svg className="w-full h-full -rotate-90">
          {/* Base track */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active progress */}
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            stroke="#C9A227"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transition={{ ease: "easeOut" }}
            className="group-hover:stroke-[#e6b92e] transition-colors duration-300"
          />
        </svg>
        <span className="absolute text-base font-mono font-bold text-white tracking-tight group-hover:scale-105 transition-transform duration-300">
          {currentVal.toFixed(1)}
        </span>
      </div>
      
      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-5 font-mono">
        {label}
      </span>
    </div>
  )
})
