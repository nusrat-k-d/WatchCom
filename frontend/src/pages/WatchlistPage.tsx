import { Link } from "react-router-dom"
import { BookmarkMinus } from "lucide-react"
import { Button } from "../components/ui/button"
import { MOCK_MOVIES } from "../lib/mock-data"
import { MovieCard } from "../components/movies/MovieCard"

export function WatchlistPage() {
  const watchlist = MOCK_MOVIES.slice(0, 4)

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-4rem)]">
      <div className="mb-8 border-b border-white/10 pb-8">
        <h1 className="text-3xl font-serif font-bold tracking-tight mb-2">My Rate Queue</h1>
        <p className="text-[var(--color-text-secondary)]">Movies you've saved to rate later.</p>
      </div>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <BookmarkMinus className="h-10 w-10 text-[var(--color-text-secondary)]" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your rate queue is empty</h2>
          <p className="text-[var(--color-text-secondary)] mb-6">Add movies and shows to your queue to keep track of what you want to rate next.</p>
          <Link to="/discover">
            <Button>Explore Movies</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {watchlist.map((movie, idx) => (
            <MovieCard key={movie.id} movie={movie} idx={idx} />
          ))}
        </div>
      )}
    </div>
  )
}
