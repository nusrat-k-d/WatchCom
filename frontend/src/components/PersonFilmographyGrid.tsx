import { useState, useMemo } from "react"
import { Search, Film, Calendar, Star, TrendingUp } from "lucide-react"
import { MovieCard } from "./movies/MovieCard"

interface Movie {
  id: string
  title: string
  year: number
  runtime: string
  genres: string[]
  overview: string
  posterUrl: string
  rating: number
  popularity: number
}

interface PersonFilmographyGridProps {
  movies: Movie[]
  type: "actor" | "director"
}

type SortTab = "popular" | "rated" | "recent"

export function PersonFilmographyGrid({ movies, type }: PersonFilmographyGridProps) {
  const [activeTab, setActiveTab] = useState<SortTab>("popular")
  const [searchQuery, setSearchQuery] = useState("")

  // Filtered movies based on search input
  const filteredMovies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return movies

    return movies.filter(
      (m) =>
        m.title.toLowerCase().includes(query) ||
        m.overview.toLowerCase().includes(query) ||
        m.genres.some((g) => g.toLowerCase().includes(query))
    )
  }, [movies, searchQuery])

  // Sorted movies based on active tab
  const sortedMovies = useMemo(() => {
    const list = [...filteredMovies]
    if (activeTab === "popular") {
      return list.sort((a, b) => b.popularity - a.popularity)
    } else if (activeTab === "rated") {
      return list.sort((a, b) => {
        if (b.rating !== a.rating) {
          return b.rating - a.rating
        }
        return b.popularity - a.popularity
      })
    } else if (activeTab === "recent") {
      return list.sort((a, b) => {
        if (b.year !== a.year) {
          return b.year - a.year
        }
        return b.popularity - a.popularity
      })
    }
    return list
  }, [filteredMovies, activeTab])

  const sectionTitle = type === "director" ? "Directed Films" : "Filmography"
  const sectionDesc = type === "director" 
    ? "Explore this director's works and movie credits." 
    : "Explore this actor's roles and movie credits."

  const popularLabel = type === "director" ? "Most Popular Films" : "Most Popular Movies"
  const ratedLabel = type === "director" ? "Highest Rated Films" : "Highest Rated Movies"
  const recentLabel = type === "director" ? "Latest Films" : "Recent Movies"

  return (
    <section className="space-y-8 py-10 text-left">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 border border-white/10 rounded-lg">
            <Film className="h-4 w-4 text-gray-400" />
          </div>
          <div>
            <h2 className="text-xs uppercase tracking-widest text-gray-400 font-bold font-mono">
              🎬 {sectionTitle}
            </h2>
            <p className="text-[10px] text-gray-500 font-light mt-0.5">
              {sectionDesc}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder={`Search ${type === "director" ? "directed films" : "filmography"}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0b0b0c] text-white border border-white/10 rounded-xl pl-10 pr-4 py-2.5 outline-none placeholder:text-gray-600 text-sm focus:border-[#C9A227]/40 transition-colors"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap bg-[#0b0b0c] border border-white/5 p-1 rounded-xl shadow-inner max-w-lg gap-1 sm:gap-0">
        <button
          onClick={() => setActiveTab("popular")}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
            activeTab === "popular"
              ? "bg-[#C9A227] text-black shadow-lg"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          <span className="truncate">{popularLabel}</span>
        </button>
        <button
          onClick={() => setActiveTab("rated")}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
            activeTab === "rated"
              ? "bg-[#C9A227] text-black shadow-lg"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Star className="h-3.5 w-3.5" />
          <span className="truncate">{ratedLabel}</span>
        </button>
        <button
          onClick={() => setActiveTab("recent")}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
            activeTab === "recent"
              ? "bg-[#C9A227] text-black shadow-lg"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Calendar className="h-3.5 w-3.5" />
          <span className="truncate">{recentLabel}</span>
        </button>
      </div>

      {/* Grid */}
      {sortedMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {sortedMovies.map((movie, idx) => (
            <MovieCard key={movie.id} movie={movie} idx={idx} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#0b0b0c] border border-white/5 rounded-2xl">
          <Film className="h-8 w-8 text-gray-600 mx-auto mb-3" />
          <h3 className="text-sm font-serif font-bold text-white mb-1 uppercase tracking-wide">
            No Movies Found
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed font-light">
            We couldn't find any films matching "{searchQuery}".
          </p>
        </div>
      )}
    </section>
  )
}
