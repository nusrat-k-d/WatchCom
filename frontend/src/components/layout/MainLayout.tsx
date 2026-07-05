import { Link, Outlet, useNavigate, useLocation } from "react-router-dom"
import { Clapperboard, User, Menu, X, LogOut, Film, Dna, Brain, Sparkles } from "lucide-react"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useAuth } from "../../context/AuthContext"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
    navigate("/")
  }

  const isAiActive = currentPath === "/" || currentPath === "/discover" || currentPath === "/ai-results"
  const isTasteDnaActive = currentPath === "/taste-dna"
  const isForYouActive = currentPath === "/recommendations"

  const getDesktopClass = (isActive: boolean) => 
    `flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 ${
      isActive 
        ? "bg-[var(--color-gold)] text-black font-semibold shadow-lg shadow-[var(--color-gold)]/10" 
        : "text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5"
    }`

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-white focus:outline-none" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-[var(--color-gold)] rounded p-1.5 flex items-center justify-center">
                <Brain className="h-5 w-5 text-black" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white hidden sm:block">WatchCom</span>
                <span className="text-[10px] font-bold tracking-widest bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/30 text-[var(--color-gold)] px-1.5 py-0.5 rounded uppercase hidden sm:block">AI</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/discover" className={getDesktopClass(isAiActive)}>
              <Sparkles className={`h-4 w-4 ${isAiActive ? "fill-black text-black" : "text-[var(--color-text-secondary)]"}`} /> AI Assistant
            </Link>
            <Link to="/taste-dna" className={getDesktopClass(isTasteDnaActive)}>
              <Dna className={`h-4 w-4 ${isTasteDnaActive ? "text-black" : "text-[var(--color-text-secondary)]"}`} /> Taste DNA
            </Link>
            <Link to="/recommendations" className={getDesktopClass(isForYouActive)}>
              <Film className={`h-4 w-4 ${isForYouActive ? "text-black" : "text-[var(--color-text-secondary)]"}`} /> For You
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="text-sm font-medium px-4 py-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors hidden sm:block">
                Log Out
              </button>
            ) : (
              <Link to="/login" className="text-sm font-medium px-4 py-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors hidden sm:block">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
 
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden fixed top-16 left-0 right-0 z-40 bg-[var(--color-surface)] border-b border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col py-4 px-4 space-y-4">
              <Link to="/discover" onClick={() => setIsMenuOpen(false)} className={`text-lg font-medium flex items-center gap-3 transition-colors ${isAiActive ? "text-[var(--color-gold)] font-bold" : "text-white"}`}>
                <Sparkles className={`h-5 w-5 ${isAiActive ? "text-[var(--color-gold)]" : "text-white"}`} /> AI Assistant
              </Link>
              <Link to="/taste-dna" onClick={() => setIsMenuOpen(false)} className={`text-lg font-medium flex items-center gap-3 transition-colors ${isTasteDnaActive ? "text-[var(--color-gold)] font-bold" : "text-white"}`}>
                <Dna className={`h-5 w-5 ${isTasteDnaActive ? "text-[var(--color-gold)]" : "text-white"}`} /> Taste DNA
              </Link>
              <Link to="/recommendations" onClick={() => setIsMenuOpen(false)} className={`text-lg font-medium flex items-center gap-3 transition-colors ${isForYouActive ? "text-[var(--color-gold)] font-bold" : "text-white"}`}>
                <Film className={`h-5 w-5 ${isForYouActive ? "text-[var(--color-gold)]" : "text-white"}`} /> For You
              </Link>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-white flex items-center gap-3"><User className="h-5 w-5" /> Profile</Link>
              <div className="border-t border-white/10 pt-4 mt-2">
                {isAuthenticated ? (
                  <button onClick={handleLogout} className="text-lg font-medium text-red-500 flex items-center gap-3 w-full text-left">
                    <LogOut className="h-5 w-5" /> Log Out
                  </button>
                ) : (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-[var(--color-gold)] flex items-center gap-3">
                    <User className="h-5 w-5" /> Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function MainLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col font-sans text-[var(--color-text-primary)]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-4 md:px-8 text-center text-[var(--color-text-secondary)]">
          <Clapperboard className="h-8 w-8 mx-auto mb-4 text-white/20" />
          <p>&copy; {new Date().getFullYear()} WatchCom. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
