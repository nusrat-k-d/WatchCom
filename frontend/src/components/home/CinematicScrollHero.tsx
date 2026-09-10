import { useState, useEffect, useRef, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"
import { Search, Sparkles, Clock, ArrowUpRight, Film } from "lucide-react"
import { useDebounce } from "../../lib/useDebounce"

const AUTOCOMPLETE_SUGGESTIONS = [
  "Interstellar",
  "Arrival",
  "The Prestige",
  "The Green Mile",
  "Fight Club",
  "Whiplash",
  "Inception",
  "The Dark Knight",
  "Coherence",
  "Primer",
  "Moon",
  "Gravity",
  "Blade Runner 2049",
  "Ex Machina"
]

const ROTATING_PLACEHOLDERS = [
  "A quiet psychological mystery that rewards patient viewing…",
  "Something like Interstellar, focused on human grief and wonder…",
  "Atmospheric neo-noir with breathtaking cinematography…",
  "A philosophical masterpiece nobody talks about…",
  "An intense chamber drama with unforgettable performances…"
]

const PROMPT_CHIPS = [
  { label: "Mind-Bending", icon: "🧠", query: "A mind-bending movie with a complex narrative concept that lingers for days" },
  { label: "Deeply Emotional", icon: "😭", query: "An emotional, character-driven story that is deeply moving and melancholic" },
  { label: "Date Night Cinema", icon: "❤️", query: "An engaging, witty, and beautifully shot film ideal for an intimate evening" },
  { label: "Atmospheric & Rainy", icon: "🌧", query: "A cozy, atmospheric film with rich texture for a quiet, introspective evening" },
  { label: "Festival Laurels", icon: "🏆", query: "A critically acclaimed film festival masterpiece with visionary direction" },
  { label: "Hidden Gems", icon: "✨", query: "A lesser-known, underappreciated cinematic masterpiece" },
  { label: "Psychological Tension", icon: "😱", query: "A tense psychological thriller driven by nuance and quiet dread" },
  { label: "Classic Celluloid", icon: "🎞", query: "A timeless cinematic classic with legendary dialogue and composition" }
]

export function CinematicScrollHero() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const [isPopulating, setIsPopulating] = useState(false)

  // Search History from localStorage
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("watchcom_search_history")
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Smooth scroll tracking via framer-motion useScroll & useSpring
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Smooth luxury spring physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 24,
    restDelta: 0.0005
  })

  // 1. Smooth image zoom on scroll (from 1.00 up to 1.45)
  const bgScale = useTransform(smoothProgress, [0, 1], [1, 1.45])

  // 2. Cinematic Depth of Field (Bokeh / 85mm f1.4 blur)
  const bgFilter = useTransform(
    smoothProgress, 
    [0, 0.40, 0.80, 1], 
    ["blur(0px)", "blur(0px)", "blur(6px)", "blur(12px)"]
  )

  // 3. Textural 35mm Celluloid Film Grain emergence on scroll
  const grainOpacity = useTransform(smoothProgress, [0, 0.4, 1], [0, 0.15, 0.35])

  // 4. Dramatic Rim Light / Warmth separation behind search console
  const rimLightOpacity = useTransform(smoothProgress, [0.65, 0.88, 1], [0, 0.75, 0.95])

  // 5. AI Search Console emergence at the end of the zoom scroll
  const aiBarOpacity = useTransform(smoothProgress, [0.65, 0.90, 1], [0, 0.95, 1])
  const aiBarY = useTransform(smoothProgress, [0.65, 0.90, 1], [35, 6, 0])
  const aiBarPointerEvents = useTransform(smoothProgress, (p) => (p > 0.75 ? "auto" : "none"))

  // Subtle backdrop scrim ONLY when search bar appears
  const backdropScrim = useTransform(smoothProgress, [0.6, 0.9, 1], [0, 0.35, 0.55])

  // Subtle Scroll Indicator fading out immediately
  const hintOpacity = useTransform(smoothProgress, [0, 0.15], [0.85, 0])

  // Focus input when reaching completion
  const [hasReachedEnd, setHasReachedEnd] = useState(false)
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      if (latest > 0.88 && !hasReachedEnd) {
        setHasReachedEnd(true)
        inputRef.current?.focus()
      } else if (latest <= 0.75 && hasReachedEnd) {
        setHasReachedEnd(false)
      }
    })
    return () => unsubscribe()
  }, [smoothProgress, hasReachedEnd])

  // Rotate placeholder text every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % ROTATING_PLACEHOLDERS.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Debounce input for Autocomplete Filtering
  const debouncedInput = useDebounce(searchQuery, 200)

  const filteredSuggestions = useMemo(() => {
    const query = debouncedInput.trim().toLowerCase()
    if (!query) return []
    return AUTOCOMPLETE_SUGGESTIONS.filter(
      (item) => item.toLowerCase().includes(query) && item.toLowerCase() !== query
    )
  }, [debouncedInput])

  const saveSearchToHistory = (query: string) => {
    const updated = [query, ...searchHistory.filter((q) => q !== query)].slice(0, 5)
    setSearchHistory(updated)
    try {
      localStorage.setItem("watchcom_search_history", JSON.stringify(updated))
    } catch (e) {
      console.error("Error saving search history:", e)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    if (trimmed) {
      saveSearchToHistory(trimmed)
      navigate(`/ai-results?q=${encodeURIComponent(trimmed)}`)
    }
  }

  // Dynamic Prompt Population: Populate or Append Keywords to Search State & Focus
  const handleChipClick = (chipQuery: string) => {
    setIsPopulating(true)
    setSearchQuery(chipQuery)
    
    // Focus the input field and move cursor to the end
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
        inputRef.current.setSelectionRange(chipQuery.length, chipQuery.length)
      }
      setIsPopulating(false)
    }, 200)
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem("watchcom_search_history")
  }

  return (
    <div 
      ref={containerRef} 
      className="relative w-full bg-[#000000] text-[#F0EDE6]"
      style={{ height: "220vh" }}
    >
      {/* Pinned Fullscreen Viewport Canvas */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center">
        
        {/* Background Image: Crisp on top, smoothly gaining 85mm Depth of Field (bokeh) on scroll */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center pointer-events-none will-change-transform"
          style={{
            backgroundImage: `url('/hero/cinema-hero.png')`,
            scale: bgScale,
            filter: bgFilter,
            transformOrigin: "center center"
          }}
        />

        {/* Textural 35mm Celluloid Film Grain Overlay */}
        <motion.div 
          className="absolute inset-0 film-grain pointer-events-none z-10 mix-blend-overlay"
          style={{ opacity: grainOpacity }}
        />

        {/* Subtle Dark Backdrop Scrim — Enhances focus on the search console */}
        <motion.div 
          className="absolute inset-0 pointer-events-none z-10 bg-black"
          style={{ opacity: backdropScrim }}
        />

        {/* Cinematic Dramatic Rim Light / Golden Warmth Separation */}
        <motion.div 
          className="absolute inset-0 pointer-events-none z-15"
          style={{
            opacity: rimLightOpacity,
            background: "radial-gradient(circle at 50% 50%, rgba(216, 184, 120, 0.16) 0%, rgba(197, 160, 89, 0.04) 45%, transparent 70%)",
            mixBlendMode: "screen"
          }}
        />

        {/* Dimmer Focus Overlay: Smoothly dims background when user clicks into the search bar */}
        <div 
          className={`absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity duration-500 pointer-events-none z-20 ${
            isFocused ? "opacity-100" : "opacity-0"
          }`} 
        />

        {/* Minimal Initial Scroll Cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-20 select-none"
          style={{ opacity: hintOpacity }}
        >
          <span className="text-[10px] uppercase font-mono tracking-[0.35em] text-[#C5A059] font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Scroll to explore
          </span>
          <div className="w-[1px] h-5 bg-[#C5A059]/80 shadow-[0_0_8px_rgba(197,160,89,0.8)]" />
        </motion.div>

        {/* AI Cinema Console */}
        <motion.div
          className="relative z-30 w-full max-w-3xl px-6 flex flex-col items-center select-none"
          style={{
            opacity: aiBarOpacity,
            y: aiBarY,
            pointerEvents: aiBarPointerEvents
          }}
        >
          {/* Refined Brand Insignia */}
          <div className="inline-flex items-center gap-2 mb-4 select-none bg-black/60 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
            <Film className="h-3 w-3 text-[#C5A059]" />
            <span className="text-[9px] font-mono tracking-[0.35em] text-[#C5A059] uppercase font-semibold">
              WatchCom Cinema AI
            </span>
          </div>

          {/* Editorial Serif Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal tracking-tight mb-3 text-[#F0EDE6] text-center leading-[1.08] drop-shadow-[0_4px_35px_rgba(0,0,0,0.95)]">
            Ask WatchCom anything<span className="text-[#C5A059] font-serif font-light">.</span>
          </h1>

          {/* Refined Modern Sans Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-zinc-300 mb-7 max-w-lg text-center font-light leading-relaxed font-sans drop-shadow-md">
            Describe a feeling, moral dilemma, visual aesthetic, or story you want to experience.
          </p>

          {/* Smoked Obsidian Glass Search Bar with Focus Glow */}
          <div className="w-full relative mb-5">
            <form 
              onSubmit={handleSearchSubmit} 
              className={`relative flex items-center bg-[#09090c]/90 backdrop-blur-2xl border rounded-2xl overflow-visible p-2 transition-all duration-400 ${
                isFocused 
                  ? "border-[#C5A059] shadow-[0_0_40px_rgba(197,160,89,0.35),0_20px_50px_rgba(0,0,0,0.95)] bg-[#08080a] scale-[1.01]" 
                  : isPopulating
                  ? "border-[#C5A059]/80 shadow-[0_0_30px_rgba(197,160,89,0.25)]"
                  : "border-white/[0.12] hover:border-white/[0.25] shadow-obsidian"
              }`}
            >
              <div className="flex items-center flex-1 pl-4 relative">
                <Search className={`h-4 w-4 transition-colors duration-300 ${isFocused ? "text-[#C5A059]" : "text-zinc-400"}`} />
                
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full bg-transparent text-[#F0EDE6] pl-3.5 pr-4 py-3.5 outline-none placeholder:text-transparent text-sm sm:text-base font-sans font-light tracking-wide"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                  aria-label="Describe the kind of cinema you want to discover"
                />

                {/* Rotating placeholder animation */}
                <AnimatePresence mode="wait">
                  {!isFocused && !searchQuery && (
                    <motion.div
                      key={placeholderIdx}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="absolute left-11.5 text-zinc-400 pointer-events-none select-none text-xs sm:text-sm md:text-base font-sans font-light text-left truncate max-w-[82%]"
                    >
                      {ROTATING_PLACEHOLDERS[placeholderIdx]}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Luxury Champagne Gold CTA Button */}
              <button
                type="submit"
                className="bg-[#C5A059] hover:bg-[#D8B878] text-[#08080a] px-6 md:px-7 py-3 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer outline-none shadow-[0_2px_15px_rgba(197,160,89,0.3)] hover:shadow-[0_4px_20px_rgba(197,160,89,0.5)] active:scale-[0.98]"
              >
                <span>Explore</span>
                <Sparkles className="h-3.5 w-3.5 fill-[#08080a]" />
              </button>

              {/* Autocomplete Overlay */}
              <AnimatePresence>
                {isFocused && filteredSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-[#0a0a0d]/98 backdrop-blur-2xl border border-white/[0.12] rounded-2xl overflow-hidden z-40 shadow-2xl text-left"
                  >
                    <div className="p-3 text-[9px] text-zinc-400 tracking-[0.2em] uppercase font-mono font-medium border-b border-white/[0.06] bg-black/60">
                      Curated Titles
                    </div>
                    {filteredSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          const queryText = `Tell me more about ${suggestion} and movies like it`
                          setSearchQuery(queryText)
                          saveSearchToHistory(queryText)
                          navigate(`/ai-results?q=${encodeURIComponent(queryText)}`)
                        }}
                        className="w-full text-left px-5 py-3 hover:bg-white/[0.06] transition-colors text-xs sm:text-sm text-zinc-300 hover:text-[#F0EDE6] flex items-center justify-between cursor-pointer border-b border-white/[0.04] last:border-b-0 outline-none"
                      >
                        <span className="font-light">{suggestion}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Dynamic Interactive Category Chips with Smooth Hover States & Border Glow */}
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mb-4">
            {PROMPT_CHIPS.map((chip) => {
              const isSelected = searchQuery === chip.query

              return (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleChipClick(chip.query)}
                  className={`group px-3.5 py-1.5 rounded-full text-xs font-light transition-all duration-300 cursor-pointer outline-none flex items-center gap-1.5 shadow-md active:scale-[0.97] hover:scale-[1.04] ${
                    isSelected
                      ? "bg-[#C5A059]/20 border border-[#C5A059] text-[#F0EDE6] shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                      : "bg-black/65 backdrop-blur-md hover:bg-[#C5A059]/[0.12] border border-white/[0.10] hover:border-[#C5A059]/70 hover:shadow-[0_0_18px_rgba(197,160,89,0.22)] text-zinc-200 hover:text-[#F0EDE6]"
                  }`}
                >
                  <span className="text-xs transition-transform duration-300 group-hover:scale-110">
                    {chip.icon}
                  </span>
                  <span>{chip.label}</span>
                </button>
              )
            })}
          </div>

          {/* Recent Inquiries */}
          {searchHistory.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-sans mt-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/5">
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 flex items-center gap-1">
                <Clock className="h-3 w-3 text-[#C5A059]/80" /> Recent:
              </span>
              {searchHistory.slice(0, 2).map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setSearchQuery(q)
                    navigate(`/ai-results?q=${encodeURIComponent(q)}`)
                  }}
                  className="bg-white/[0.04] border border-white/[0.08] hover:border-[#C5A059]/40 px-2.5 py-1 rounded-lg text-zinc-300 hover:text-white truncate max-w-[170px] cursor-pointer transition-colors text-[11px]"
                >
                  "{q}"
                </button>
              ))}
              <button
                onClick={clearHistory}
                className="text-[10px] text-zinc-500 hover:text-[#C5A059] font-mono cursor-pointer ml-1 transition-colors"
              >
                Clear
              </button>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  )
}
