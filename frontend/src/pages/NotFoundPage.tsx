import { Link } from "react-router-dom"
import { Compass, Ghost } from "lucide-react"
import { Button } from "../components/ui/button"

export function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4">
      <div className="h-32 w-32 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)]">
        <Ghost className="h-12 w-12 text-[var(--color-gold)]" />
      </div>
      <h1 className="text-6xl font-serif font-bold mb-4 tracking-tight">404</h1>
      <h2 className="text-2xl font-bold mb-4">Signal Lost</h2>
      <p className="text-[var(--color-text-secondary)] mb-8 max-w-md text-lg">
        The cinematic coordinates you entered don't exist in our database. Let's get you back to calibrated space.
      </p>
      <Link to="/discover">
        <Button size="lg" className="bg-[var(--color-gold)] hover:bg-[#b5952f] text-black font-bold">
          <Compass className="mr-2 h-5 w-5" /> Return to Discover
        </Button>
      </Link>
    </div>
  )
}
