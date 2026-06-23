import { useState } from "react"
import { Search, Target, Compass, Gem } from "lucide-react"
import { Input } from "../components/ui/input"
import { MOCK_MOVIES } from "../lib/mock-data"
import { MovieCard } from "../components/movies/MovieCard"
import { useTaste } from "../context/UserTasteContext"

export function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const { isDismissed } = useTaste()

  const activeMovies = MOCK_MOVIES.filter(m => !isDismissed(m.id))

  const sciFiMovies = activeMovies.filter(m => m.genres.includes("Sci-Fi"))
  const hiddenGems = activeMovies.filter(m => m.discoveryScore && m.discoveryScore > 90)
  const highlyAligned = activeMovies.filter(m => m.matchScore && m.matchScore > 90)

  // A helper component to render a row
  const MovieRow = ({ title, icon: Icon, description, movies }: { title: string, icon: any, description: string, movies: typeof MOCK_MOVIES }) => (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-5 w-5 text-[var(--color-gold)]" />
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">{description}</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((movie, idx) => (
          <MovieCard key={`${title}-${movie.id}`} movie={movie} idx={idx} showActions />
        ))}
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-12 pb-24">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-3">What are you in the mood for today?</h1>
          <p className="text-lg text-[var(--color-text-secondary)]">Recommendations built around your taste profile. Find your next obsession.</p>
        </div>
        
        <div className="w-full md:w-96 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-secondary)]" />
          <Input 
            placeholder="Search movies to rate..." 
            className="pl-9 bg-[#0f0f0f] border-white/10 focus:border-[var(--color-gold)]/50 transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {searchQuery ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {activeMovies.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase())).map(movie => (
            <MovieCard key={`search-${movie.id}`} movie={movie} showActions />
          ))}
        </div>
      ) : (
        <>
          <MovieRow 
            title="Highly Aligned" 
            icon={Target}
            description="Movies with a 90%+ match based on your taste vector." 
            movies={highlyAligned} 
          />
          
          <MovieRow 
            title="Because You Rate Sci-Fi Highly" 
            icon={Compass}
            description="Your strong affinity for cerebral Sci-Fi drove these suggestions." 
            movies={sciFiMovies} 
          />

          <MovieRow 
            title="Hidden Gems" 
            icon={Gem}
            description="Lesser-known films that mathematically align with your profile." 
            movies={hiddenGems} 
          />
        </>
      )}
    </div>
  )
}
