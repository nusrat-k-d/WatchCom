import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Dna, Sparkles, Share2, Camera } from "lucide-react"
import { useTaste } from "../../context/UserTasteContext"
import { TasteDnaStoryCardModal } from "./TasteDnaStoryCardModal"
import { Button } from "../ui/button"

interface DimensionScore {
  axis: string
  label: string
  score: number
  description: string
  color: string
}

export function TasteDnaRadar() {
  const { ratings, favorites, metrics } = useTaste()
  const [activeDimension, setActiveDimension] = useState<DimensionScore | null>(null)
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Compute 6-axis taste dimensions dynamically based on ratings and favorited movies
  const dimensions: DimensionScore[] = useMemo(() => {
    // Base scores
    let depth = 65
    let dark = 55
    let adrenaline = 60
    let heart = 70
    let wonder = 75
    let pacing = 60

    // Factor in favorites genres and tags
    favorites.forEach((fav) => {
      const g = (fav.genres || []).map(x => x.toLowerCase())
      if (g.includes("sci-fi") || g.includes("fantasy") || g.includes("adventure")) wonder += 6
      if (g.includes("thriller") || g.includes("horror") || g.includes("crime")) dark += 6
      if (g.includes("action") || g.includes("war") || g.includes("western")) adrenaline += 6
      if (g.includes("drama") || g.includes("romance") || g.includes("family")) heart += 6
      if (g.includes("mystery") || g.includes("animation")) depth += 6
      if (g.includes("comedy")) pacing += 5
    })

    // Factor in user ratings
    ratings.forEach((r) => {
      if (r.score >= 4) {
        depth += 2
        wonder += 2
      }
    })

    const clamp = (val: number) => Math.min(98, Math.max(45, val))

    return [
      {
        axis: "wonder",
        label: "Escapism & Wonder",
        score: clamp(wonder),
        description: "Preference for imaginative worldbuilding, high-concept sci-fi, and mythical lore.",
        color: "#38BDF8" // sky blue
      },
      {
        axis: "depth",
        label: "Intellectual Depth",
        score: clamp(depth),
        description: "Love for complex narratives, philosophical themes, and mind-bending puzzle plots.",
        color: "#C9A227" // gold
      },
      {
        axis: "dark",
        label: "Dark & Gritty",
        score: clamp(dark),
        description: "Appetite for psychological suspense, neo-noir realism, and morally ambiguous antiheroes.",
        color: "#F43F5E" // rose
      },
      {
        axis: "adrenaline",
        label: "Adrenaline & Action",
        score: clamp(adrenaline),
        description: "Excitement for high-octane pacing, cinematic spectacle, and relentless momentum.",
        color: "#FB923C" // orange
      },
      {
        axis: "heart",
        label: "Heart & Emotion",
        score: clamp(heart),
        description: "Connection to intimate character arcs, poignant relationships, and emotional resonance.",
        color: "#EC4899" // pink
      },
      {
        axis: "pacing",
        label: "Atmosphere & Pacing",
        score: clamp(pacing),
        description: "Appreciation for deliberate visual framing, mood immersion, and rich soundscapes.",
        color: "#A855F7" // purple
      }
    ]
  }, [ratings, favorites])

  // Radar geometry calculations
  const size = 340
  const center = size / 2
  const radius = center - 50
  const totalAxes = dimensions.length
  const angleStep = (Math.PI * 2) / totalAxes

  const polygonPoints = useMemo(() => {
    return dimensions.map((dim, i) => {
      const angle = i * angleStep - Math.PI / 2
      const r = (dim.score / 100) * radius
      const x = center + r * Math.cos(angle)
      const y = center + r * Math.sin(angle)
      return { x, y, dim, angle }
    })
  }, [dimensions, center, radius, angleStep])

  const polygonString = polygonPoints.map(p => `${p.x},${p.y}`).join(" ")

  const handleShare = () => {
    const text = `🎬 My WatchCom Movie Taste DNA:\n` +
      dimensions.map(d => `• ${d.label}: ${d.score}%`).join("\n") +
      `\nDiscover your cinematic DNA on WatchCom!`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/30 flex items-center justify-center text-[#C9A227]">
            <Dna className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-serif text-white flex items-center gap-2">
              <span>Taste DNA</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#C9A227]/20 text-[#C9A227] font-mono font-semibold">
                Neural Vector
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              6-dimensional mathematical representation of your narrative preferences.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={() => setIsStoryModalOpen(true)}
            variant="outline"
            className="border-[#C9A227]/30 hover:border-[#C9A227] bg-[#C9A227]/10 hover:bg-[#C9A227]/20 text-[#C9A227] px-4 py-2 text-xs flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Export Story Card</span>
          </Button>

          <Button
            onClick={handleShare}
            variant="outline"
            className="border-white/10 hover:border-[#C9A227]/40 text-gray-200 hover:text-white px-4 py-2 text-xs flex items-center gap-2 cursor-pointer shrink-0"
          >
            {copied ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                <span className="text-[#C9A227] font-semibold">DNA Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Profile</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Radar Chart & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Radar SVG Visualizer */}
        <div className="lg:col-span-6 flex justify-center relative">
          <div className="relative">
            <svg width={size} height={size} className="overflow-visible select-none">
              <defs>
                <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#C9A227" stopOpacity="0.45" />
                  <stop offset="70%" stopColor="#C9A227" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#C9A227" stopOpacity="0.0" />
                </radialGradient>
              </defs>

              {/* Concentric Grid Circles */}
              {[0.25, 0.5, 0.75, 1.0].map((level, idx) => (
                <circle
                  key={idx}
                  cx={center}
                  cy={center}
                  r={radius * level}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeDasharray={idx === 3 ? "none" : "3,3"}
                />
              ))}

              {/* Axis Spoke Lines */}
              {dimensions.map((_, i) => {
                const angle = i * angleStep - Math.PI / 2
                const x = center + radius * Math.cos(angle)
                const y = center + radius * Math.sin(angle)
                return (
                  <line
                    key={i}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.1)"
                  />
                )
              })}

              {/* Radar Filled Area */}
              <motion.polygon
                points={polygonString}
                fill="url(#radarGradient)"
                stroke="#C9A227"
                strokeWidth="2.5"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />

              {/* Vertex Nodes & Interactive Labels */}
              {polygonPoints.map((p, idx) => {
                const labelRadius = radius + 24
                const labelX = center + labelRadius * Math.cos(p.angle)
                const labelY = center + labelRadius * Math.sin(p.angle)

                return (
                  <g key={idx}>
                    {/* Glowing Vertex Circle */}
                    <motion.circle
                      cx={p.x}
                      cy={p.y}
                      r={activeDimension?.axis === p.dim.axis ? 7 : 5}
                      fill={p.dim.color}
                      stroke="#050505"
                      strokeWidth="2"
                      className="cursor-pointer transition-all"
                      whileHover={{ scale: 1.4 }}
                      onClick={() => setActiveDimension(p.dim)}
                    />

                    {/* Spoke Axis Label */}
                    <text
                      x={labelX}
                      y={labelY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[11px] font-sans font-medium fill-gray-400 cursor-pointer hover:fill-white transition-colors"
                      onClick={() => setActiveDimension(p.dim)}
                    >
                      {p.dim.label.split(" ")[0]}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        {/* Dimension Breakdown Metrics */}
        <div className="lg:col-span-6 space-y-3.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 flex items-center justify-between">
            <span>Neural Vector Dimensions</span>
            <span className="text-[#C9A227]">{ratings.length + favorites.length} data points</span>
          </div>

          {dimensions.map((dim) => {
            const isSelected = activeDimension?.axis === dim.axis
            return (
              <motion.div
                key={dim.axis}
                onClick={() => setActiveDimension(dim)}
                whileHover={{ scale: 1.01 }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white/[0.06] border-[#C9A227] shadow-lg shadow-[#C9A227]/10"
                    : "bg-white/[0.02] border-white/5 hover:border-white/15"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: dim.color }}
                    />
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {dim.label}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#C9A227]">
                    {dim.score}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: dim.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.score}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>

                {isSelected && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 text-[11px] text-gray-300 leading-relaxed pt-1"
                  >
                    {dim.description}
                  </motion.p>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      <TasteDnaStoryCardModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        dimensions={dimensions}
        metrics={metrics}
        topFilms={favorites.map(f => f.title).slice(0, 3)}
      />
    </div>
  )
}
