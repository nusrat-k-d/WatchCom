import { useState, useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, RefreshCw, AlertCircle, ExternalLink, Film, RotateCcw, RotateCw } from "lucide-react"

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

interface TrailerModalProps {
  movieId: string | number | null
  movieTitle: string
  isOpen: boolean
  onClose: () => void
}

interface VideoResult {
  id: string
  key: string
  name: string
  site: string
  type: string
  official?: boolean
}

export function TrailerModal({ movieId, movieTitle, isOpen, onClose }: TrailerModalProps) {
  const [videoKey, setVideoKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [skipFeedback, setSkipFeedback] = useState<{ text: string; dir: "left" | "right" } | null>(null)
  const [isPlayerHovered, setIsPlayerHovered] = useState(false)
  
  const playerRef = useRef<any>(null)
  const playerContainerId = useRef(`yt-player-${Math.random().toString(36).substring(2, 9)}`)

  // Ensure YouTube IFrame API script is loaded globally
  useEffect(() => {
    if (typeof window !== "undefined" && !window.YT) {
      const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]')
      if (!existingScript) {
        const tag = document.createElement("script")
        tag.src = "https://www.youtube.com/iframe_api"
        const firstScriptTag = document.getElementsByTagName("script")[0]
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag)
      }
    }
  }, [])

  // Fetch trailer for movie
  useEffect(() => {
    if (!isOpen || !movieId) {
      setVideoKey(null)
      setError(null)
      return
    }

    const fetchTrailer = async () => {
      setLoading(true)
      setError(null)
      setVideoKey(null)

      try {
        const res = await fetch(`http://localhost:5000/api/movies/${movieId}/videos`)
        if (!res.ok) throw new Error("Could not load trailer")

        const data = await res.json()
        const videos: VideoResult[] = data.results || []

        // Find official trailer on YouTube, or fallback to teaser/clip
        const trailer = videos.find(v => v.site === "YouTube" && v.type === "Trailer" && v.official)
          || videos.find(v => v.site === "YouTube" && v.type === "Trailer")
          || videos.find(v => v.site === "YouTube" && v.type === "Teaser")
          || videos.find(v => v.site === "YouTube")

        if (trailer && trailer.key) {
          setVideoKey(trailer.key)
        } else {
          setError("No official trailer found for this title.")
        }
      } catch (err: unknown) {
        console.error(err)
        setError("Unable to retrieve trailer stream.")
      } finally {
        setLoading(false)
      }
    }

    fetchTrailer()
  }, [isOpen, movieId])

  // Initialize YT.Player instance when videoKey is loaded
  useEffect(() => {
    if (!isOpen || !videoKey) return

    let isSubscribed = true
    const targetElementId = playerContainerId.current

    const initPlayer = () => {
      if (!isSubscribed) return

      if (window.YT && window.YT.Player) {
        try {
          const domEl = document.getElementById(targetElementId)
          if (!domEl) {
            setTimeout(initPlayer, 100)
            return
          }

          playerRef.current = new window.YT.Player(targetElementId, {
            videoId: videoKey,
            playerVars: {
              autoplay: 1,
              controls: 1,
              rel: 0,
              modestbranding: 1,
              playsinline: 1,
              enablejsapi: 1,
              origin: window.location.origin
            },
            events: {
              onReady: (event: any) => {
                if (isSubscribed) {
                  playerRef.current = event.target
                  try {
                    event.target.playVideo()
                  } catch (e) {
                    // Autoplay may require user interaction on some browsers
                  }
                }
              }
            }
          })
        } catch (err) {
          console.error("Error creating YT.Player:", err)
        }
      } else {
        setTimeout(initPlayer, 150)
      }
    }

    // Delay slight tick for portal DOM insertion
    const timer = setTimeout(initPlayer, 100)

    return () => {
      isSubscribed = false
      clearTimeout(timer)
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        try {
          playerRef.current.destroy()
        } catch (e) {
          // ignore
        }
        playerRef.current = null
      }
    }
  }, [isOpen, videoKey])

  // Function to skip time forward / backward (+10s or -10s)
  const skipTime = useCallback((seconds: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (playerRef.current) {
      try {
        let currentTime = 0
        if (typeof playerRef.current.getCurrentTime === "function") {
          currentTime = playerRef.current.getCurrentTime() || 0
        }
        
        let duration = 0
        if (typeof playerRef.current.getDuration === "function") {
          duration = playerRef.current.getDuration() || 0
        }

        const targetTime = Math.max(0, duration > 0 ? Math.min(currentTime + seconds, duration) : currentTime + seconds)
        
        if (typeof playerRef.current.seekTo === "function") {
          playerRef.current.seekTo(targetTime, true)
        }
      } catch (err) {
        console.error("Failed to seek with YT Player API:", err)
      }
    }

    // Show visual badge feedback
    setSkipFeedback({
      text: seconds > 0 ? "+10s" : "-10s",
      dir: seconds > 0 ? "right" : "left"
    })
    setTimeout(() => setSkipFeedback(null), 650)
  }, [])

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowLeft" || e.key === "j" || e.key === "J") {
        e.preventDefault()
        skipTime(-10)
      } else if (e.key === "ArrowRight" || e.key === "l" || e.key === "L") {
        e.preventDefault()
        skipTime(10)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, skipTime])

  if (!isOpen) return null

  return typeof document !== "undefined" ? createPortal(
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/92 backdrop-blur-2xl animate-fade-in"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl rounded-3xl bg-[#09090c] border border-white/[0.08] shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/[0.06] bg-[#070709]">
          <div className="flex items-center gap-2.5 truncate pr-4">
            <Film className="w-4 h-4 text-[#C5A059] shrink-0" />
            <h3 className="text-xs sm:text-sm font-serif font-normal text-[#F0EDE6] truncate">
              {movieTitle} <span className="text-[#C5A059] font-sans font-light text-[11px] ml-1 opacity-85">— Official Trailer</span>
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Quick 10s Skip Buttons in Header */}
            {videoKey && (
              <div className="flex items-center gap-1.5 mr-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-2 py-1">
                <button
                  onClick={(e) => skipTime(-10, e)}
                  className="flex items-center gap-1 text-[11px] font-mono text-zinc-300 hover:text-[#C5A059] px-2 py-0.5 rounded-full hover:bg-white/[0.08] transition-all cursor-pointer outline-none active:scale-95"
                  title="Rewind 10 seconds (← or J)"
                  aria-label="Skip backward 10 seconds"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>-10s</span>
                </button>

                <div className="w-[1px] h-3 bg-white/10" />

                <button
                  onClick={(e) => skipTime(10, e)}
                  className="flex items-center gap-1 text-[11px] font-mono text-zinc-300 hover:text-[#C5A059] px-2 py-0.5 rounded-full hover:bg-white/[0.08] transition-all cursor-pointer outline-none active:scale-95"
                  title="Forward 10 seconds (→ or L)"
                  aria-label="Skip forward 10 seconds"
                >
                  <span>+10s</span>
                  <RotateCw className="w-3.5 h-3.5 text-[#C5A059]" />
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-all cursor-pointer outline-none"
              aria-label="Close trailer player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Player Container */}
        <div 
          onMouseEnter={() => setIsPlayerHovered(true)}
          onMouseLeave={() => setIsPlayerHovered(false)}
          className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden group/player"
        >
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-zinc-400">
              <RefreshCw className="w-7 h-7 animate-spin text-[#C5A059]" />
              <span className="text-[11px] uppercase tracking-[0.25em] font-mono text-zinc-400">Loading Cinema Stream...</span>
            </div>
          ) : videoKey ? (
            <>
              {/* Dynamic YouTube Player Mount */}
              <div 
                id={playerContainerId.current} 
                className="w-full h-full border-0"
              />

              {/* Floating Side Skip Buttons on Video Hover */}
              <div 
                className={`absolute inset-y-0 left-4 z-40 flex items-center pointer-events-none transition-opacity duration-300 ${
                  isPlayerHovered ? "opacity-100" : "opacity-0"
                }`}
              >
                <button
                  onClick={(e) => skipTime(-10, e)}
                  className="pointer-events-auto p-3.5 rounded-full bg-black/80 hover:bg-[#C5A059] text-white hover:text-black border border-white/20 hover:border-[#C5A059] transition-all duration-200 shadow-2xl cursor-pointer flex flex-col items-center gap-0.5 hover:scale-110 active:scale-95 group"
                  title="Skip backward 10s (← or J)"
                  aria-label="Skip backward 10 seconds"
                >
                  <RotateCcw className="w-5 h-5 text-white group-hover:text-black" />
                  <span className="text-[9px] font-mono font-bold tracking-wider">10s</span>
                </button>
              </div>

              <div 
                className={`absolute inset-y-0 right-4 z-40 flex items-center pointer-events-none transition-opacity duration-300 ${
                  isPlayerHovered ? "opacity-100" : "opacity-0"
                }`}
              >
                <button
                  onClick={(e) => skipTime(10, e)}
                  className="pointer-events-auto p-3.5 rounded-full bg-black/80 hover:bg-[#C5A059] text-white hover:text-black border border-white/20 hover:border-[#C5A059] transition-all duration-200 shadow-2xl cursor-pointer flex flex-col items-center gap-0.5 hover:scale-110 active:scale-95 group"
                  title="Skip forward 10s (→ or L)"
                  aria-label="Skip forward 10 seconds"
                >
                  <RotateCw className="w-5 h-5 text-white group-hover:text-black" />
                  <span className="text-[9px] font-mono font-bold tracking-wider">10s</span>
                </button>
              </div>

              {/* Animated Visual Skip Feedback Overlay */}
              <AnimatePresence>
                {skipFeedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.25 }}
                    className={`absolute top-1/2 -translate-y-1/2 ${
                      skipFeedback.dir === "left" ? "left-16" : "right-16"
                    } pointer-events-none z-50 flex flex-col items-center justify-center p-4 rounded-2xl bg-black/90 backdrop-blur-md border border-[#C5A059]/60 shadow-[0_0_35px_rgba(197,160,89,0.4)] text-[#C5A059]`}
                  >
                    {skipFeedback.dir === "left" ? (
                      <RotateCcw className="w-8 h-8 mb-1 animate-pulse" />
                    ) : (
                      <RotateCw className="w-8 h-8 mb-1 animate-pulse" />
                    )}
                    <span className="text-xs font-mono font-bold tracking-widest">{skipFeedback.text}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center p-8 max-w-md">
              <AlertCircle className="w-10 h-10 text-[#C5A059]/80 mb-1" />
              <p className="text-sm text-zinc-300 font-light">
                {error || "Trailer currently unavailable."}
              </p>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${movieTitle} trailer`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 text-xs font-semibold transition-all cursor-pointer"
              >
                <span>Search on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Minimal Bottom Keyboard Hint Bar */}
        {videoKey && (
          <div className="px-6 py-2.5 bg-[#070709] border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-zinc-500 select-none">
            <div className="flex items-center gap-3">
              <span><kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-zinc-300">←</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-zinc-300">J</kbd> -10s</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-zinc-300">→</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-zinc-300">L</kbd> +10s</span>
            </div>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-zinc-300">ESC</kbd> Close</span>
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  ) : null
}
