import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import { MOCK_MOVIES } from "../lib/mock-data"

type Rating = {
  movieId: string
  score: number
  date: string
}

type Dismissal = {
  movieId: string
  reason: "not_interested" | "already_seen"
  date: string
}

export type FavoriteMovie = {
  id: string
  title: string
  year: number
  posterUrl: string
  rating: number
  genres: string[]
  matchScore?: number
  runtime?: string
  confidence?: string
  reason?: string
  tags?: string[]
}

type UserTasteContextType = {
  ratings: Rating[]
  dismissals: Dismissal[]
  favorites: FavoriteMovie[]
  rateMovie: (movieId: string, score: number) => void
  bulkImportRatings: (importedRatings: Rating[]) => void
  dismissMovie: (movieId: string, reason: "not_interested" | "already_seen") => void
  getRatingForMovie: (movieId: string) => number | null
  isDismissed: (movieId: string) => boolean
  addFavorite: (movie: FavoriteMovie) => void
  removeFavorite: (movieId: string) => void
  isFavorite: (movieId: string) => boolean
  metrics: {
    totalRated: number
    profileStrength: number
    averageRating: number
    confidence: number
    ratedDecadesCount: number
    ratedGenresCount: number
  }
}

const UserTasteContext = createContext<UserTasteContextType | undefined>(undefined)

export function UserTasteProvider({ children }: { children: React.ReactNode }) {
  const [ratings, setRatings] = useState<Rating[]>(() => {
    try {
      const stored = localStorage.getItem("watchcom_ratings")
      if (stored) return JSON.parse(stored)
    } catch (e) {
      console.error(e)
    }
    return [
      { movieId: MOCK_MOVIES[0]?.id || "1", score: 5, date: new Date().toISOString() },
      { movieId: MOCK_MOVIES[2]?.id || "3", score: 4, date: new Date().toISOString() },
      { movieId: MOCK_MOVIES[5]?.id || "6", score: 3, date: new Date().toISOString() },
      { movieId: MOCK_MOVIES[8]?.id || "9", score: 5, date: new Date().toISOString() },
      { movieId: MOCK_MOVIES[9]?.id || "10", score: 2, date: new Date().toISOString() }
    ]
  })

  // Persist ratings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("watchcom_ratings", JSON.stringify(ratings))
    } catch (e) {
      console.error("Failed to persist ratings:", e)
    }
  }, [ratings])

  const [dismissals, setDismissals] = useState<Dismissal[]>([])
  const [favorites, setFavorites] = useState<FavoriteMovie[]>(() => {
    try {
      const stored = localStorage.getItem("watchcom_favorites")
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Persist favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("watchcom_favorites", JSON.stringify(favorites))
    } catch (e) {
      console.error("Failed to persist favorites:", e)
    }
  }, [favorites])

  const rateMovie = useCallback((movieId: string, score: number) => {
    setRatings(prev => {
      const existing = prev.filter(r => r.movieId !== movieId)
      return [...existing, { movieId, score, date: new Date().toISOString() }]
    })
  }, [])

  const bulkImportRatings = useCallback((imported: Rating[]) => {
    setRatings(prev => {
      const map = new Map<string, Rating>()
      prev.forEach(r => map.set(r.movieId, r))
      imported.forEach(r => map.set(r.movieId, r))
      return Array.from(map.values())
    })
  }, [])

  const dismissMovie = useCallback((movieId: string, reason: "not_interested" | "already_seen") => {
    setDismissals(prev => {
      if (prev.some(d => d.movieId === movieId)) return prev
      return [...prev, { movieId, reason, date: new Date().toISOString() }]
    })
  }, [])

  const getRatingForMovie = useCallback((movieId: string) => {
    return ratings.find(r => r.movieId === movieId)?.score || null
  }, [ratings])

  const isDismissed = useCallback((movieId: string) => {
    return dismissals.some(d => d.movieId === movieId)
  }, [dismissals])

  const addFavorite = useCallback((movie: FavoriteMovie) => {
    setFavorites(prev => {
      if (prev.some(f => f.id === movie.id)) return prev
      return [...prev, movie]
    })
  }, [])

  const removeFavorite = useCallback((movieId: string) => {
    setFavorites(prev => prev.filter(f => f.id !== movieId))
  }, [])

  const isFavorite = useCallback((movieId: string) => {
    return favorites.some(f => f.id === movieId)
  }, [favorites])

  // Calculate dynamic metrics
  const metrics = useMemo(() => {
    const totalRated = ratings.length
    
    // Calculate profile strength based on number of ratings (cap at 100%)
    const profileStrength = Math.min(100, Math.round((totalRated / 20) * 100))
    
    const averageRating = totalRated > 0 
      ? Number((ratings.reduce((acc, r) => acc + r.score, 0) / totalRated).toFixed(1)) 
      : 0

    // Calculate unique decades and genres from rated movies
    const ratedMoviesData = ratings.map(r => MOCK_MOVIES.find(m => m.id === r.movieId)).filter(Boolean)
    const ratedDecadesCount = new Set(ratedMoviesData.map(m => m?.decade)).size
    const ratedGenresCount = new Set(ratedMoviesData.flatMap(m => m?.genres)).size

    // Confidence is a function of profile strength and diversity
    const confidence = Math.min(100, profileStrength + (ratedGenresCount * 2))

    return {
      totalRated,
      profileStrength: profileStrength < 10 ? 12 : profileStrength, // Floor at 12% for UI
      averageRating,
      confidence: confidence < 15 ? 15 : confidence, // Floor at 15% for UI
      ratedDecadesCount,
      ratedGenresCount
    }
  }, [ratings])

  const value = useMemo(() => ({
    ratings,
    dismissals,
    favorites,
    rateMovie,
    bulkImportRatings,
    dismissMovie,
    getRatingForMovie,
    isDismissed,
    addFavorite,
    removeFavorite,
    isFavorite,
    metrics
  }), [ratings, dismissals, favorites, rateMovie, bulkImportRatings, dismissMovie, getRatingForMovie, isDismissed, addFavorite, removeFavorite, isFavorite, metrics])

  return (
    <UserTasteContext.Provider value={value}>
      {children}
    </UserTasteContext.Provider>
  )
}

export function useTaste() {
  const context = useContext(UserTasteContext)
  if (context === undefined) {
    throw new Error("useTaste must be used within a UserTasteProvider")
  }
  return context;
}
