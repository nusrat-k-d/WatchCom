import { useState, useEffect, useMemo, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Brain, Sparkles, MessageSquare, Clock, ArrowUpRight } from "lucide-react"
import { useDebounce } from "../lib/useDebounce"

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
  "I want something like Interstellar but easier to understand...",
  "A movie that will change my perspective.",
  "Something emotional but hopeful.",
  "I need a rainy Sunday movie.",
  "A masterpiece nobody talks about.",
  "A movie to watch with my parents.",
  "Mind-bending but not confusing."
]

const PROMPT_CHIPS = [
  "🧠 Mind-Bending",
  "😭 Emotional",
  "❤️ Date Night",
  "🌧 Rainy Day",
  "🏆 Oscar Winners",
  "✨ Hidden Gems",
  "🎬 Underrated Masterpieces",
  "🍿 Family Movie",
  "😂 Feel Good",
  "😱 Psychological Thriller",
  "🎞 Classic Cinema"
]

const CHIP_PROMPTS: Record<string, string> = {
  "🧠 Mind-Bending": "A mind-bending movie with a complex concept that will keep me thinking for days",
  "😭 Emotional": "An emotional, character-driven story that is deeply moving and tear-jerking",
  "❤️ Date Night": "An engaging date night movie that is romantic, witty, and high-quality",
  "🌧 Rainy Day": "A cozy, atmospheric movie perfect for a quiet, rainy Sunday afternoon",
  "🏆 Oscar Winners": "A highly acclaimed award-winning masterpiece with stellar performances",
  "✨ Hidden Gems": "A lesser-known, highly underrated movie that is a true hidden gem",
  "🎬 Underrated Masterpieces": "A critically acclaimed masterpiece that went under the radar",
  "🍿 Family Movie": "A heartwarming, high-quality family film that both kids and adults can enjoy",
  "😂 Feel Good": "A lighthearted, hilarious, and feel-good movie that lifts my mood instantly",
  "😱 Psychological Thriller": "A tense, psychological thriller with a massive plot twist at the end",
  "🎞 Classic Cinema": "A timeless cinematic classic with legendary status and great storytelling"
}

export function DiscoverPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // 1. Search History Hook (localStorage)
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("watchcom_search_history")
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // 2. Rotate placeholders every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % ROTATING_PLACEHOLDERS.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  // 3. Debounce input for Autocomplete Filtering
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

  const handleChipClick = (chip: string) => {
    const prompt = CHIP_PROMPTS[chip] || chip
    setSearchQuery(prompt)
    saveSearchToHistory(prompt)
    
    // Smooth transition delay so user sees selection fill the prompt input
    setTimeout(() => {
      navigate(`/ai-results?q=${encodeURIComponent(prompt)}`)
    }, 450)
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem("watchcom_search_history")
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-[#050505] text-[#F5F5F5] relative overflow-hidden">
      
      {/* Background ambient highlights (A24 / Linear style) */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[850px] h-[350px] bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.08),transparent_60%)] pointer-events-none z-0 blur-[40px]" />
      <div className="absolute -top-[10%] left-[10%] w-[350px] h-[350px] bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.03),transparent_70%)] pointer-events-none z-0 blur-[50px]" />
      
      <section className="flex-1 flex items-center justify-center py-16 md:py-24 px-4 relative z-10">
        <div className="max-w-4xl w-full text-center flex flex-col items-center">
          
          {/* AI Badge indicator */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[rgba(212,175,55,0.12)] to-[rgba(212,175,55,0.02)] border border-[#C9A227]/25 px-4 py-2 rounded-full text-xs font-bold tracking-widest text-[#C9A227] uppercase mb-8 shadow-xl select-none"
          >
            <Brain className="h-4 w-4 animate-pulse text-[#C9A227]" />
            WatchCom Cinematic AI v1.0
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold tracking-tight mb-4 text-white leading-tight uppercase"
          >
            ✨ Ask WatchCom anything
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-sm sm:text-base md:text-lg text-gray-500 mb-10 max-w-xl font-light leading-relaxed font-sans"
          >
            Describe a feeling, situation, movie, emotion, or anything you're looking for.
          </motion.p>

          {/* Assistant Prompt Input Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="w-full max-w-3xl mb-8 relative"
          >
            <form 
              onSubmit={handleSearchSubmit} 
              className={`relative flex items-center bg-[#0b0b0c]/80 backdrop-blur-xl border rounded-2xl overflow-visible p-2 shadow-[0_30px_70px_rgba(0,0,0,0.8)] transition-all duration-500 ${
                isFocused 
                  ? "border-[#C9A227]/50 shadow-[0_0_40px_rgba(201,162,39,0.18)] bg-black" 
                  : "border-white/10"
              }`}
            >
              <div className="flex items-center flex-1 pl-4 relative">
                <Search className={`h-5 w-5 transition-colors duration-300 ${isFocused ? "text-[#C9A227]" : "text-gray-500"}`} />
                
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full bg-transparent text-white pl-4 pr-4 py-4.5 outline-none placeholder:text-transparent text-sm sm:text-base font-sans"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                  aria-label="Describe the kind of movie you want to find"
                />

                {/* Rotating placeholder animation overlay */}
                <AnimatePresence mode="wait">
                  {!isFocused && !searchQuery && (
                    <motion.div
                      key={placeholderIdx}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.4 }}
                      className="absolute left-13 text-gray-600 pointer-events-none select-none text-sm sm:text-base font-sans font-light text-left truncate max-w-[80%]"
                    >
                      {ROTATING_PLACEHOLDERS[placeholderIdx]}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit search button */}
              <button
                type="submit"
                className="bg-gradient-to-r from-[var(--color-gold)] to-[#b5952f] text-black px-6 md:px-8 py-3.5 md:py-4 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.2)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.35)] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
              >
                <Sparkles className="h-4.5 w-4.5 fill-black" />
                <span className="tracking-wide">Refine</span>
              </button>

              {/* Autocomplete Dropdown overlay */}
              <AnimatePresence>
                {isFocused && filteredSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-[#0B0B0B]/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden z-30 shadow-2xl text-left"
                  >
                    <div className="p-3 text-[9px] text-gray-500 tracking-wider uppercase font-bold border-b border-white/5 bg-black/40 font-mono">
                      Suggested Movies
                    </div>
                    {filteredSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault() // Prevents input focus loss before transition
                          const queryText = `Tell me more about ${suggestion} and movies like it`
                          setSearchQuery(queryText)
                          saveSearchToHistory(queryText)
                          navigate(`/ai-results?q=${encodeURIComponent(queryText)}`)
                        }}
                        className="w-full text-left px-5 py-4 hover:bg-white/5 transition-colors text-sm text-gray-300 hover:text-white flex items-center justify-between cursor-pointer border-b border-white/5 last:border-b-0 outline-none focus-visible:bg-white/5"
                      >
                        <span className="font-light">{suggestion}</span>
                        <ArrowUpRight className="h-4 w-4 text-gray-500" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

            </form>
          </motion.div>

          {/* Suggestions header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 font-mono select-none"
          >
            <MessageSquare className="h-4 w-4 text-gray-500" /> Or try starting with a concept
          </motion.div>

          {/* Interactive prompt suggestion chips */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="flex flex-wrap justify-center gap-2.5 max-w-3xl mb-8"
          >
            {PROMPT_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                className="px-4.5 py-2.5 rounded-full text-xs font-semibold bg-[#0b0b0c]/40 border border-white/5 text-gray-300 hover:text-[#C9A227] hover:border-[#C9A227]/30 hover:bg-black/60 hover:scale-103 active:scale-97 transition-all duration-300 shadow-md cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-[#C9A227]"
              >
                {chip}
              </button>
            ))}
          </motion.div>

          {/* Search history list */}
          {searchHistory.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-6 flex flex-col items-center max-w-md w-full border-t border-white/5 pt-6 text-left"
            >
              <div className="flex items-center justify-between w-full pb-2 mb-3">
                <span className="text-[9px] uppercase font-bold tracking-widest text-gray-500 font-mono flex items-center gap-1.5 select-none">
                  <Clock className="h-3.5 w-3.5" /> Recent Directives
                </span>
                <button 
                  onClick={clearHistory}
                  className="text-[9px] text-gray-500 hover:text-[#C9A227] hover:underline tracking-wider uppercase font-bold cursor-pointer outline-none font-mono"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-col w-full gap-2.5">
                {searchHistory.map((histQuery) => (
                  <button
                    key={histQuery}
                    onClick={() => {
                      setSearchQuery(histQuery)
                      navigate(`/ai-results?q=${encodeURIComponent(histQuery)}`)
                    }}
                    className="w-full text-xs text-gray-400 hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/10 px-4 py-3 rounded-xl flex items-center justify-between transition-all cursor-pointer font-sans font-light select-none outline-none focus-visible:bg-white/5"
                  >
                    <span className="truncate pr-4">"{histQuery}"</span>
                    <ArrowUpRight className="h-4 w-4 text-gray-600 shrink-0" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </section>
    </div>
  )
}
