import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Loader2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Progress } from "../components/ui/progress"
import { MOCK_MOVIES, GENRES } from "../lib/mock-data"

export function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [ratings, setRatings] = useState<Record<string, number>>({})

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  const rateMovie = (movieId: string, rating: number) => {
    setRatings(prev => ({ ...prev, [movieId]: rating }))
  }

  const handleNext = () => {
    if (step === 1) {
      if (selectedGenres.length > 0) setStep(2)
    } else if (step === 2) {
      if (Object.keys(ratings).length > 0) {
        setStep(3)
        generateProfile()
      }
    }
  }

  const generateProfile = () => {
    setTimeout(() => {
      navigate("/dashboard")
    }, 4000)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Progress value={(step / 3) * 100} className="h-2" />
        <p className="text-right text-sm text-[var(--color-text-secondary)] mt-2">Step {step} of 3</p>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-8"
          >
            <div>
              <h1 className="text-4xl font-serif font-bold mb-4">What do you like to explore?</h1>
              <p className="text-xl text-[var(--color-text-secondary)]">Select at least one genre to help us understand your taste.</p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {GENRES.map(genre => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`px-6 py-3 rounded-full border text-lg transition-all duration-300 ${
                    selectedGenres.includes(genre)
                      ? "bg-[var(--color-gold)] border-[var(--color-gold)] text-black font-medium scale-105"
                      : "bg-transparent border-white/20 text-white hover:border-[var(--color-gold)]/50"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <Button size="lg" onClick={handleNext} disabled={selectedGenres.length === 0}>
                Continue
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-8"
          >
            <div>
              <h1 className="text-4xl font-serif font-bold mb-4">Build Your Taste Vector</h1>
              <p className="text-xl text-[var(--color-text-secondary)]">
                Vector Data Points: {Object.keys(ratings).length} / 20
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {MOCK_MOVIES.map(movie => (
                <div key={movie.id} className="flex flex-col gap-2 group">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden relative">
                    <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-sm font-medium">Rate this</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              onClick={() => rateMovie(movie.id, star)}
                              className="text-white hover:text-[var(--color-gold)] transition-colors focus:outline-none"
                            >
                              <Star className={`h-4 w-4 ${ratings[movie.id] >= star ? "fill-[var(--color-gold)] text-[var(--color-gold)]" : ""}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm truncate font-medium">{movie.title}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
              <Button size="lg" onClick={handleNext} disabled={Object.keys(ratings).length < 5}>
                Generate Taste DNA
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[50vh] text-center"
          >
            <Loader2 className="h-16 w-16 text-[var(--color-gold)] animate-spin mb-8" />
            <h2 className="text-3xl font-serif font-bold mb-4">Training Your Recommendation Profile</h2>
            
            <div className="h-8 overflow-hidden">
              <motion.div
                animate={{ y: [0, -32, -64, -96, -128] }}
                transition={{ duration: 4, times: [0, 0.25, 0.5, 0.75, 1] }}
                className="flex flex-col text-lg"
              >
                <span className="h-8 text-[var(--color-gold)]">Analyzing Preferences...</span>
                <span className="h-8 text-[var(--color-gold)]">Building Taste Vector...</span>
                <span className="h-8 text-[var(--color-gold)]">Finding Similar Viewers...</span>
                <span className="h-8 text-[var(--color-gold)]">Calculating Match Scores...</span>
                <span className="h-8 text-[var(--color-gold)]">Generating Recommendations...</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
