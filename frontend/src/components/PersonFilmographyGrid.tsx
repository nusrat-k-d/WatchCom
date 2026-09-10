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

  const sectionTitle = type === "director" ? "Directed Works" : "Filmography"
  const sectionDesc = type === "director" 
    ? "Explore directorial credits and catalog selections." 
    : "Explore performance roles and screen credits."

  return (
    <section className="space-y-8 py-8 text-left">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/[0.04] border border-white/[0.06] rounded-xl text-[#C5A059]">
            <Film className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-zinc-300 font-medium font-mono">
              ✦ {sectionTitle}
            </h2>
            <p className="text-[11px] text-zinc-500 font-light mt-0.5">
              {sectionDesc}
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder={`Search ${type === "director" ? "directed works" : "filmography"}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#09090c] text-white border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 outline-none placeholder:text-zinc-600 text-xs focus:border-[#C5A059]/40 transition-colors"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="inline-flex bg-[#09090c]/90 border border-white/[0.08] p-1 rounded-xl shadow-inner gap-1">
        <button
          onClick={() => setActiveTab("popular")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium uppercase tracking-wider transition-all duration-300 cursor-pointer ${
            activeTab === "popular"
              ? "bg-[#C5A059] text-[#08080a] font-semibold shadow-md"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <TrendingUp className="h-3 w-3" />
          <span>Popular</span>
        </button>
        <button
          onClick={() => setActiveTab("rated")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium uppercase tracking-wider transition-all duration-300 cursor-pointer ${
            activeTab === "rated"
              ? "bg-[#C5A059] text-[#08080a] font-semibold shadow-md"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Star className="h-3 w-3" />
          <span>Top Rated</span>
        </button>
        <button
          onClick={() => setActiveTab("recent")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium uppercase tracking-wider transition-all duration-300 cursor-pointer ${
            activeTab === "recent"
              ? "bg-[#C5A059] text-[#08080a] font-semibold shadow-md"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Calendar className="h-3 w-3" />
          <span>Recent</span>
        </button>
      </div>

      {/* Grid */}
      {sortedMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {sortedMovies.map((movie, idx) => (
            <MovieCard key={movie.id} movie={movie} idx={idx} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#09090c]/80 border border-white/[0.08] rounded-2xl">
          <Film className="h-7 w-7 text-zinc-600 mx-auto mb-2" />
          <h3 className="text-xs font-mono text-zinc-400 mb-1 uppercase tracking-wider">
            No Titles Located
          </h3>
          <p className="text-xs text-zinc-500 font-light">
            No film credits found matching "{searchQuery}".
          </p>
        </div>
      )}
    </section>
  )
}
