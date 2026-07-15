import { useState, useEffect } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"
import { Brain, Sparkles, Film, Compass, Menu, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const currentPath = location.pathname

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "AI Assistant", path: "/discover", icon: Sparkles },
    { name: "Discover", path: "/dashboard", icon: Compass },
    { name: "Trending", path: "/recommendations", icon: Film }
  ]

  const getDesktopClass = (path: string) => {
    const isActive = currentPath === path
    return `relative flex items-center gap-2 text-xs uppercase tracking-widest font-mono font-bold px-4 py-2 rounded-full transition-all duration-300 ${
      isActive 
        ? "text-[#C9A227] bg-[#C9A227]/5 border border-[#C9A227]/25 shadow-[0_0_15px_rgba(201,162,39,0.1)]" 
        : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
    }`
  }

  return (
    <>
      <nav className={`sticky top-0 z-50 w-full transition-all duration-500 border-b ${
        isScrolled 
          ? "bg-[#050505]/90 backdrop-blur-xl border-white/5 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)]" 
          : "bg-transparent border-transparent py-5"
      }`}>
        <div className="container mx-auto flex items-center justify-between px-4 md:px-8 max-w-6xl">
          
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-white focus:outline-none focus:ring-1 focus:ring-[#C9A227] rounded p-1" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close main navigation menu" : "Open main navigation menu"}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            
            <Link to="/" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A227] rounded" aria-label="WatchCom Home">
              <div className="bg-[#C9A227]/10 border border-[#C9A227]/30 rounded p-1.5 flex items-center justify-center">
                <Brain className="h-4.5 w-4.5 text-[#C9A227]" />
              </div>
              <div className="flex items-center gap-2 select-none">
                <span className="text-lg font-serif font-black tracking-widest text-white uppercase">WatchCom</span>
                <span className="text-[8px] font-bold tracking-widest bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] px-1 py-0.5 rounded uppercase font-mono">v1</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = currentPath === link.path
              return (
                <Link key={link.path} to={link.path} className={getDesktopClass(link.path)}>
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-[#C9A227]" : "text-gray-400"}`} />
                  <span>{link.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Luxury Minimal Accent */}
          <div className="hidden md:block w-3.5 h-3.5 rounded-full bg-white/5 border border-white/10" />

        </div>
      </nav>
 
      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden fixed top-16 left-0 right-0 z-40 bg-[#0B0B0B]/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col py-6 px-5 space-y-5">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = currentPath === link.path
                return (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    onClick={() => setIsMenuOpen(false)} 
                    className={`text-base font-bold tracking-wider font-mono flex items-center gap-3 transition-colors ${
                      isActive ? "text-[#C9A227]" : "text-gray-400"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    <span>{link.name.toUpperCase()}</span>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function MainLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col font-sans text-gray-200">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Simplified Luxury Footer */}
      <footer className="border-t border-white/5 bg-[#050505] py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-3 select-none">
              <Brain className="h-6 w-6 text-[#C9A227]/40" />
              <span className="font-serif font-black text-white tracking-widest uppercase">WATCHCOM</span>
            </div>
            
            <p className="font-serif italic text-gray-400 font-light text-center md:text-left text-xs tracking-wider">
              "Finding stories worth remembering."
            </p>

            <div className="flex items-center gap-6 font-mono text-xs font-bold uppercase tracking-wider">
              <a href="#" className="hover:text-[#C9A227] transition-colors focus-visible:outline-none focus-visible:underline">About</a>
              <a href="#" className="hover:text-[#C9A227] transition-colors focus-visible:outline-none focus-visible:underline">GitHub</a>
              <a href="#" className="hover:text-[#C9A227] transition-colors focus-visible:outline-none focus-visible:underline">Privacy</a>
              <a href="#" className="hover:text-[#C9A227] transition-colors focus-visible:outline-none focus-visible:underline">Contact</a>
            </div>
          </div>
          <div className="mt-8 text-center text-[10px] text-gray-700 font-mono select-none">
            &copy; {new Date().getFullYear()} WatchCom. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
