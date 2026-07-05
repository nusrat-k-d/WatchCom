import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Search, Brain, Sparkles, MessageSquare } from "lucide-react"

export function DiscoverPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  const chips = [
    "Mind Blowing",
    "Feel Good",
    "I Want To Cry",
    "Psychological Thriller",
    "Weekend Binge",
    "Date Night",
    "Family Night",
    "Comfort Movie",
    "Hidden Gem",
    "Mind-Bending Sci-Fi",
    "Plot Twist",
    "Underrated Masterpiece"
  ]

  const chipPrompts: Record<string, string> = {
    "Mind Blowing": "A mind-blowing movie with an insane concept that makes me question reality",
    "Feel Good": "A feel-good, heartwarming movie to lift my spirits and make me smile",
    "I Want To Cry": "An emotional, tear-jerking drama that will make me cry",
    "Psychological Thriller": "A tense psychological thriller with a complex plot that keeps me guessing",
    "Weekend Binge": "An addictive movie series or high-stakes film perfect for a weekend binge",
    "Date Night": "An engaging, romantic, or witty movie perfect for a luxury date night",
    "Family Night": "A fun, high-quality movie that both kids and adults will love for family night",
    "Comfort Movie": "A cozy comfort movie that feels like a warm hug and is easy to watch",
    "Hidden Gem": "An underrated, lesser-known masterpiece that is a true hidden gem",
    "Mind-Bending Sci-Fi": "A mind-bending sci-fi film like Interstellar or Inception with deep concepts",
    "Plot Twist": "A movie with a massive plot twist at the end that I won't see coming",
    "Underrated Masterpiece": "A critically acclaimed but underrated masterpiece that deserves more attention"
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/ai-results?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleChipClick = (chip: string) => {
    const prompt = chipPrompts[chip] || chip
    setSearchQuery(prompt)
    
    // Auto-navigate after a brief delay so the user sees the input populate
    setTimeout(() => {
      navigate(`/ai-results?q=${encodeURIComponent(prompt)}`)
    }, 400)
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-[#050505] text-[#F5F5F5] relative overflow-hidden">
      
      {/* Premium Luxury Background Ambient Glows */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent_60%)] pointer-events-none z-0 blur-[40px]" />
      <div className="absolute -top-[10%] left-[10%] w-[300px] h-[300px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03),transparent_70%)] pointer-events-none z-0 blur-[50px]" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.04),transparent_60%)] pointer-events-none z-0 blur-[60px]" />

      {/* Main Conversational Interface Section */}
      <section className="flex-1 flex items-center justify-center py-12 md:py-24 px-4 relative z-10">
        <div className="max-w-4xl w-full text-center flex flex-col items-center">
          
          {/* Glowing Premium AI Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[rgba(212,175,55,0.12)] to-[rgba(212,175,55,0.02)] border border-[var(--color-gold)]/20 px-4 py-2 rounded-full text-xs font-bold tracking-widest text-[var(--color-gold)] uppercase mb-8 shadow-xl"
          >
            <Brain className="h-4 w-4 animate-pulse text-[var(--color-gold)]" />
            WatchCom Conversational Director
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold tracking-tight mb-6 text-white leading-tight"
          >
            What should you <span className="text-[var(--color-gold)]">watch tonight?</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-[var(--color-text-secondary)] mb-10 max-w-2xl font-light leading-relaxed"
          >
            Describe your mood, situation, or the kind of story you're looking for. WatchCom understands natural language and recommends movies based on intent—not just genres.
          </motion.p>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-3xl mb-10"
          >
            <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-[#0d0d0d]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden focus-within:border-[var(--color-gold)]/50 focus-within:shadow-[0_0_35px_rgba(212,175,55,0.18)] transition-all duration-300 p-1.5 shadow-2xl">
              <div className="flex items-center flex-1 pl-4">
                <Search className="h-5 w-5 text-gray-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Example: I want something like Interstellar but easier to understand..."
                  className="w-full bg-transparent text-white pl-4 pr-4 py-4 md:py-5 outline-none placeholder:text-gray-600 text-sm sm:text-base font-sans"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-[var(--color-gold)] to-[#b5952f] text-black px-6 md:px-8 py-3.5 md:py-4 rounded-xl font-bold text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Sparkles className="h-4.5 w-4.5 fill-black" />
                <span>Search</span>
              </button>
            </form>
          </motion.div>

          {/* Suggestion Chips Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)] mb-4"
          >
            <MessageSquare className="h-3.5 w-3.5" /> Or try starting with a concept
          </motion.div>

          {/* Interactive Suggestion Chips */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-2.5 max-w-3xl"
          >
            {chips.map((chip) => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                className="px-4 py-2.5 rounded-full text-xs md:text-sm font-medium bg-[#111112] border border-white/5 text-gray-300 hover:text-[var(--color-gold)] hover:border-[var(--color-gold)]/30 hover:bg-[#161618] active:scale-95 transition-all shadow-md cursor-pointer duration-300"
              >
                {chip}
              </button>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
