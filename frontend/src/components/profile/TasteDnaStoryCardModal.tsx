import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Download, X, Sparkles, Check } from "lucide-react"
import { Button } from "../ui/button"

interface TasteDnaStoryCardModalProps {
  isOpen: boolean
  onClose: () => void
  dimensions: { label: string; score: number; color: string }[]
  metrics: { profileStrength: number; averageRating: number; totalRated: number }
  topFilms: string[]
}

export function TasteDnaStoryCardModal({
  isOpen,
  onClose,
  dimensions,
  metrics,
  topFilms
}: TasteDnaStoryCardModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [downloaded, setDownloaded] = useState(false)

  // Compute dominant persona title
  const topDimension = [...dimensions].sort((a, b) => b.score - a.score)[0]
  const personaMap: Record<string, string> = {
    "Escapism & Wonder": "The Cosmic Visionary",
    "Intellectual Depth": "The Cerebral Philosopher",
    "Dark & Gritty": "The Noir Thrillseeker",
    "Adrenaline & Action": "The Spectacle Enthusiast",
    "Heart & Emotion": "The Empathetic Romantic",
    "Atmosphere & Pacing": "The Auteur Purist"
  }
  const personaTitle = (topDimension && personaMap[topDimension.label]) || "The Cinematic Connoisseur"

  useEffect(() => {
    if (!isOpen) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // High DPI 1080x1920 (9:16 Instagram Story Resolution)
    const width = 1080
    const height = 1920
    canvas.width = width
    canvas.height = height

    // 1. Background Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, width, height)
    bgGradient.addColorStop(0, "#050505")
    bgGradient.addColorStop(0.5, "#0d0d10")
    bgGradient.addColorStop(1, "#141108")
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, width, height)

    // 2. Ambient Gold Radial Glows
    const glow1 = ctx.createRadialGradient(width / 2, 400, 50, width / 2, 400, 500)
    glow1.addColorStop(0, "rgba(201, 162, 39, 0.18)")
    glow1.addColorStop(1, "rgba(201, 162, 39, 0)")
    ctx.fillStyle = glow1
    ctx.fillRect(0, 0, width, height)

    // 3. Border Frame
    ctx.strokeStyle = "rgba(201, 162, 39, 0.25)"
    ctx.lineWidth = 4
    ctx.strokeRect(50, 50, width - 100, height - 100)

    // 4. Logo & Header
    ctx.fillStyle = "#C9A227"
    ctx.font = "bold 44px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("WATCHCOM", width / 2, 160)

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
    ctx.font = "bold 24px monospace"
    ctx.fillText("CINEMATIC TASTE DNA • NEURAL PROFILE", width / 2, 210)

    // 5. Persona Badge
    ctx.fillStyle = "rgba(201, 162, 39, 0.12)"
    ctx.beginPath()
    ctx.roundRect(width / 2 - 320, 280, 640, 150, 30)
    ctx.fill()
    ctx.strokeStyle = "rgba(201, 162, 39, 0.4)"
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = "#FFFFFF"
    ctx.font = "bold 52px serif"
    ctx.fillText(personaTitle, width / 2, 360)

    ctx.fillStyle = "#C9A227"
    ctx.font = "bold 26px sans-serif"
    ctx.fillText(`Profile Strength: ${metrics.profileStrength}% • ${metrics.totalRated} Films Analyzed`, width / 2, 405)

    // 6. 6-Dimension Vector Breakdown
    ctx.textAlign = "left"
    let startY = 540

    dimensions.forEach((dim) => {
      // Label
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "bold 32px sans-serif"
      ctx.fillText(dim.label, 120, startY)

      // Score
      ctx.fillStyle = "#C9A227"
      ctx.font = "bold 32px monospace"
      ctx.textAlign = "right"
      ctx.fillText(`${dim.score}%`, width - 120, startY)
      ctx.textAlign = "left"

      // Bar Background
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)"
      ctx.beginPath()
      ctx.roundRect(120, startY + 18, width - 240, 20, 10)
      ctx.fill()

      // Bar Fill
      ctx.fillStyle = dim.color || "#C9A227"
      ctx.beginPath()
      ctx.roundRect(120, startY + 18, (width - 240) * (dim.score / 100), 20, 10)
      ctx.fill()

      startY += 105
    })

    // 7. Top Pillar Films Box
    if (topFilms.length > 0) {
      const boxY = 1240
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)"
      ctx.beginPath()
      ctx.roundRect(100, boxY, width - 200, 340, 24)
      ctx.fill()
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)"
      ctx.stroke()

      ctx.fillStyle = "#C9A227"
      ctx.font = "bold 28px monospace"
      ctx.fillText("CORE TASTE ANCHORS", 140, boxY + 60)

      topFilms.slice(0, 3).forEach((film, i) => {
        ctx.fillStyle = "#FFFFFF"
        ctx.font = "34px sans-serif"
        ctx.fillText(`★  ${film}`, 140, boxY + 130 + i * 65)
      })
    }

    // 8. Footer Watermark
    ctx.textAlign = "center"
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)"
    ctx.font = "26px sans-serif"
    ctx.fillText("Discover your own Cinematic Taste DNA on WatchCom", width / 2, 1780)

    ctx.fillStyle = "#C9A227"
    ctx.font = "bold 28px monospace"
    ctx.fillText("watchcom.ai", width / 2, 1825)

    // Set export data URL
    try {
      setDownloadUrl(canvas.toDataURL("image/png"))
    } catch (e) {
      console.error(e)
    }
  }, [isOpen, dimensions, metrics, personaTitle, topFilms])

  const handleDownload = () => {
    if (!downloadUrl) return
    const a = document.createElement("a")
    a.href = downloadUrl
    a.download = `My-WatchCom-Taste-DNA.png`
    a.click()
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md max-h-[95vh] overflow-y-auto rounded-3xl bg-[#09090b] border border-white/10 shadow-2xl p-6 space-y-5 scrollbar-none text-center"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Story Exporter</span>
          </div>
          <h3 className="text-xl font-bold font-serif text-white">
            Your Shareable Taste DNA Card
          </h3>
          <p className="text-xs text-gray-400">
            Formatted for Instagram Story, Twitter & Discord sharing.
          </p>
        </div>

        {/* Canvas Preview Container */}
        <div className="relative w-full aspect-[9/16] max-h-[55vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl mx-auto flex items-center justify-center bg-black">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            onClick={handleDownload}
            className="w-full py-5 bg-[#C9A227] hover:bg-[#B38F1E] text-black font-extrabold text-sm rounded-2xl shadow-xl shadow-[#C9A227]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {downloaded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Downloaded Successfully!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download High-Res Story Card (PNG)</span>
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
