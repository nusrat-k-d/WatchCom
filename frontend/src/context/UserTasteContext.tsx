import React, { createContext, useContext, useState, useEffect } from "react"
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

type UserTasteContextType = {
  ratings: Rating[]
  dismissals: Dismissal[]
  rateMovie: (movieId: string, score: number) => void
  dismissMovie: (movieId: string, reason: "not_interested" | "already_seen") => void
  getRatingForMovie: (movieId: string) => number | null
  isDismissed: (movieId: string) => boolean
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
  const [ratings, setRatings] = useState<Rating[]>([])
  const [dismissals, setDismissals] = useState<Dismissal[]>([])

  useEffect(() => {
    setRatings([
      { movieId: MOCK_MOVIES[0]?.id || "1", score: 5, date: new Date().toISOString() },
      { movieId: MOCK_MOVIES[2]?.id || "3", score: 4, date: new Date().toISOString() },
      { movieId: MOCK_MOVIES[5]?.id || "6", score: 3, date: new Date().toISOString() },
      { movieId: MOCK_MOVIES[8]?.id || "9", score: 5, date: new Date().toISOString() },
      { movieId: MOCK_MOVIES[9]?.id || "10", score: 2, date: new Date().toISOString() }
    ])
  }, [])

  const rateMovie = (movieId: string, score: number) => {
    setRatings(prev => {
      const existing = prev.filter(r => r.movieId !== movieId)
      return [...existing, { movieId, score, date: new Date().toISOString() }]
    })
  }

  const dismissMovie = (movieId: string, reason: "not_interested" | "already_seen") => {
    setDismissals(prev => {
      if (prev.some(d => d.movieId === movieId)) return prev
      return [...prev, { movieId, reason, date: new Date().toISOString() }]
    })
  }

  const getRatingForMovie = (movieId: string) => {
    return ratings.find(r => r.movieId === movieId)?.score || null
  }

  const isDismissed = (movieId: string) => {
    return dismissals.some(d => d.movieId === movieId)
  }

  // Calculate dynamic metrics
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

  const metrics = {
    totalRated,
    profileStrength: profileStrength < 10 ? 12 : profileStrength, // Floor at 12% for UI
    averageRating,
    confidence: confidence < 15 ? 15 : confidence, // Floor at 15% for UI
    ratedDecadesCount,
    ratedGenresCount
  }

  return (
    <UserTasteContext.Provider value={{
      ratings,
      dismissals,
      rateMovie,
      dismissMovie,
      getRatingForMovie,
      isDismissed,
      metrics
    }}>
      {children}
    </UserTasteContext.Provider>
  )
}

export function useTaste() {
  const context = useContext(UserTasteContext)
  if (context === undefined) {
    throw new Error("useTaste must be used within a UserTasteProvider")
  }
  return context
}
