import { motion } from "framer-motion"
import { AlertCircle, RotateCcw, Compass, Quote } from "lucide-react"
import { Button } from "../../ui/button"

import { HeroSection } from "./HeroSection"
import { AISection } from "./AISection"
import { CinematicProfile } from "./CinematicProfile"
import { CastCarousel } from "./CastCarousel"
import { SimilarMoviesCarousel } from "./SimilarMoviesCarousel"
import { MoodTags } from "./MoodTags"
import { ReasonsToWatch } from "./ReasonsToWatch"
import { DiscussionQuestions } from "./DiscussionQuestions"
import { WatchComVerdict } from "./WatchComVerdict"
import { LoadingSkeleton } from "./LoadingSkeleton"

import type { AICinematicData } from "../../../lib/ai-profile"
import type { Movie } from "../../../lib/mock-data"

interface Genre {
  id: number
  name: string
}

interface MovieDetails {
  id: number
  title: string
  tagline?: string
  overview: string
  backdrop_path?: string
  poster_path?: string
  release_date?: string
  runtime?: number
  vote_average?: number
  vote_count?: number
  original_language?: string
  popularity?: number
  genres?: Genre[]
}

interface CastMember {
  id: number
  name: string
  character: string
  profile_path?: string
}

interface MovieDetailsViewProps {
  isLoading: boolean
  error: string | null
  movieDetails: MovieDetails | null
  aiData: AICinematicData | null
  cast: CastMember[]
  director: string
  similarMovies: Movie[]
  trailerUrl: string | null
  matchScore: number | null
  onRetry: () => void
  onNavigateHome: () => void
}

export function MovieDetailsView({
  isLoading,
  error,
  movieDetails,
  aiData,
  cast,
  director,
  similarMovies,
  trailerUrl,
  matchScore,
  onRetry,
  onNavigateHome
}: MovieDetailsViewProps) {
  
  if (isLoading) {
    return <LoadingSkeleton />
  }

  // Beautiful High-Fidelity Error Experience
  if (error || !movieDetails || !aiData) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 text-center text-white relative">
        {/* Soft gold ambient highlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03),transparent_70%)] pointer-events-none blur-[60px]" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md w-full bg-[#0b0b0c]/90 backdrop-blur-2xl border border-white/5 p-10 md:p-12 rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.9)] flex flex-col items-center z-10"
        >
          <div className="h-16 w-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-500 mb-8 animate-pulse">
            <AlertCircle className="h-8 w-8" />
          </div>
          
          <h3 className="text-2xl font-serif font-bold text-white mb-3">Cinematic Link Broken</h3>
          
          <p className="text-sm text-gray-400 mb-8 leading-relaxed font-sans font-light">
            {error || "We encountered an issue downloading the AI-compiled profiles for this film."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button 
              onClick={onRetry}
              className="flex-1 bg-[var(--color-gold)] hover:bg-[#b5952f] text-black font-bold py-4.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01]"
            >
              <RotateCcw className="h-4 w-4" /> Retry Connection
            </Button>
            
            <Button 
              onClick={onNavigateHome}
              variant="outline"
              className="flex-1 border-white/10 hover:bg-white/5 hover:border-white/20 text-white font-bold py-4.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Compass className="h-4 w-4 text-gray-500" /> Explore Home
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col pb-24 bg-[#050505] text-[#F5F5F5] overflow-x-hidden selection:bg-[#C9A227]/30 selection:text-white relative">
      
      {/* 1. Subtle Film Grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.012] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* 2. Apple TV-style Hero & Header */}
      <HeroSection 
        movieDetails={movieDetails} 
        aiData={aiData} 
        matchScore={matchScore} 
        trailerUrl={trailerUrl} 
      />

      {/* 3. Luxury Space Editorial Grid Layout */}
      <div className="container mx-auto px-4 md:px-8 mt-16 space-y-20 max-w-6xl relative z-20">
        
        {/* Sections 1, 2, 3: AI Details */}
        <AISection aiData={aiData} />

        {/* Section 4: Circular Metrics Indicators */}
        <CinematicProfile metrics={aiData.metrics} />

        {/* Section 5: Reasons to Watch Card Grid */}
        <ReasonsToWatch reasons={aiData.reasonsToWatch} />

        {/* Section 6: Tone & Mood Tags */}
        <MoodTags moodTags={aiData.moodTags} />

        {/* Section 7: Cast Swipe Carousel */}
        <CastCarousel cast={cast} director={director} />

        {/* Section 11: Memorable Original Quote */}
        {aiData.memorableQuote && (
          <motion.section
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="py-16 text-center max-w-4xl mx-auto border-t border-white/5 w-full"
            aria-labelledby="quote-heading"
          >
            <div className="space-y-6 relative px-8">
              {/* Decorative Quote mark */}
              <Quote className="h-16 w-16 text-[#C9A227]/10 mx-auto fill-[#C9A227]/5 stroke-none" />
              
              <blockquote id="quote-heading" className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light leading-relaxed text-gray-200 italic tracking-wide">
                "{aiData.memorableQuote.text}"
              </blockquote>
              
              <cite className="block text-xs uppercase tracking-widest text-[#C9A227] font-bold font-mono not-italic mt-5">
                — {aiData.memorableQuote.by}
              </cite>
            </div>
          </motion.section>
        )}

        {/* Section 12: Premium WatchCom Verdict gradient callout */}
        <WatchComVerdict 
          metrics={aiData.metrics} 
          title={movieDetails.title} 
          voteAverage={movieDetails.vote_average || 0} 
        />

        {/* Section 10: Discussion Questions */}
        <DiscussionQuestions questions={aiData.discussionQuestions} />

        {/* Section 9: Similar Movie Snapping Recommendations */}
        <SimilarMoviesCarousel similarMovies={similarMovies} />

      </div>

    </div>
  )
}
