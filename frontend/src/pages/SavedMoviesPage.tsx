import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Search, Filter, ArrowRight, Sparkles, Film, ArrowUpDown } from "lucide-react"
import { useTaste } from "../context/UserTasteContext"
import { MovieCard } from "../components/movies/MovieCard"
import { Button } from "../components/ui/button"

type SortOption = "recent" | "rating-desc" | "rating-asc" | "match-desc" | "year-desc" | "title-asc"

export function SavedMoviesPage() {
  const { favorites } = useTaste()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string>("all")
  const [sortBy, setSortBy] = useState<SortOption>("recent")

  // Extract all unique genres from saved favorites
  const allGenres = useMemo(() => {
    const genreSet = new Set<string>()
    favorites.forEach((movie) => {
      if (Array.isArray(movie.genres)) {
        movie.genres.forEach((g) => genreSet.add(g))
      }
    })
    return Array.from(genreSet).sort()
  }, [favorites])

  // Filter and sort the favorites list
  const filteredAndSortedFavorites = useMemo(() => {
    let list = [...favorites]

    // 1. Text Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter((movie) => {
        const titleMatch = movie.title?.toLowerCase().includes(q)
        const reasonMatch = movie.reason?.toLowerCase().includes(q)
        const genreMatch = movie.genres?.some((g) => g.toLowerCase().includes(q))
        return titleMatch || reasonMatch || genreMatch
      })
    }

    // 2. Genre Filter
    if (selectedGenre !== "all") {
      list = list.filter((movie) => movie.genres?.includes(selectedGenre))
    }

    // 3. Sorting
    list.sort((a, b) => {
      switch (sortBy) {
        case "rating-desc":
          return (b.rating || 0) - (a.rating || 0)
        case "rating-asc":
          return (a.rating || 0) - (b.rating || 0)
        case "match-desc":
          return (b.matchScore || 0) - (a.matchScore || 0)
        case "year-desc":
          return (b.year || 0) - (a.year || 0)
        case "title-asc":
          return (a.title || "").localeCompare(b.title || "")
        case "recent":
        default:
          return 0 // maintains insertion/reverse order
      }
    })

    return list
  }, [favorites, searchQuery, selectedGenre, sortBy])

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium uppercase tracking-wider mb-3">
              <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
              <span>Personal Vault</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-serif text-white">
              Saved <span className="text-[#C9A227]">Movies</span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-400 max-w-xl">
              Your curated watchlist and favorite cinematic masterpieces ready for your next movie night.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex items-center gap-3">
              <Film className="w-5 h-5 text-[#C9A227]" />
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Total Saved</div>
                <div className="text-lg font-bold text-white leading-none">{favorites.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Bar: Search, Genre Filters, Sorting */}
        {favorites.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, genre, vibe..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sorting Select */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-[#C9A227] shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-gray-200 text-sm focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] transition-all cursor-pointer"
                >
                  <option value="recent" className="bg-[#121212] text-white">Recently Added</option>
                  <option value="rating-desc" className="bg-[#121212] text-white">Highest Rating</option>
                  <option value="rating-asc" className="bg-[#121212] text-white">Lowest Rating</option>
                  <option value="match-desc" className="bg-[#121212] text-white">Match Score</option>
                  <option value="year-desc" className="bg-[#121212] text-white">Release Year</option>
                  <option value="title-asc" className="bg-[#121212] text-white">Title (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Genre Filter Pills */}
            {allGenres.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                  onClick={() => setSelectedGenre("all")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    selectedGenre === "all"
                      ? "bg-[#C9A227] text-black font-semibold shadow-lg shadow-[#C9A227]/20"
                      : "bg-white/[0.04] text-gray-400 hover:text-white border border-white/10 hover:border-white/20"
                  }`}
                >
                  All Genres ({favorites.length})
                </button>
                {allGenres.map((genre) => {
                  const count = favorites.filter((m) => m.genres?.includes(genre)).length
                  return (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                        selectedGenre === genre
                          ? "bg-[#C9A227] text-black font-semibold shadow-lg shadow-[#C9A227]/20"
                          : "bg-white/[0.04] text-gray-400 hover:text-white border border-white/10 hover:border-white/20"
                      }`}
                    >
                      {genre} ({count})
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Content Area */}
        {favorites.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-6 shadow-xl">
              <Heart className="w-8 h-8 fill-red-500/20 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold font-serif text-white mb-2">Your Saved Vault is Empty</h2>
            <p className="text-gray-400 text-sm max-w-md mb-8">
              Click the heart icon on any movie card or recommendation to save it here for future viewing.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/discover">
                <Button className="bg-[#C9A227] hover:bg-[#B38F1E] text-black font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-[#C9A227]/20">
                  <Sparkles className="w-4 h-4" />
                  <span>Discover with AI</span>
                </Button>
              </Link>
              <Link to="/trending">
                <Button variant="outline" className="border-white/20 text-gray-200 hover:bg-white/10 px-6 py-2.5 rounded-xl flex items-center gap-2">
                  <span>Browse Trending</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : filteredAndSortedFavorites.length === 0 ? (
          /* No Search/Filter Results */
          <div className="py-16 text-center">
            <Filter className="w-10 h-10 text-gray-500 mx-auto mb-3" />
            <p className="text-lg font-medium text-gray-300">No movies match your filters</p>
            <p className="text-sm text-gray-500 mt-1">Try clearing your search query or selecting another genre.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedGenre("all")
              }}
              className="mt-4 border-white/10 text-xs text-gray-400 hover:text-white"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          /* Movie Grid */
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
          >
            <AnimatePresence>
              {filteredAndSortedFavorites.map((movie, idx) => (
                <motion.div
                  key={movie.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                  className="relative group"
                >
                  <MovieCard
                    movie={{
                      id: movie.id,
                      title: movie.title,
                      year: movie.year,
                      posterUrl: movie.posterUrl,
                      rating: movie.rating,
                      genres: movie.genres || [],
                      matchScore: movie.matchScore,
                      runtime: movie.runtime,
                      confidence: movie.confidence,
                      reason: movie.reason,
                      tags: movie.tags
                    }}
                    idx={idx}
                    showActions={true}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
