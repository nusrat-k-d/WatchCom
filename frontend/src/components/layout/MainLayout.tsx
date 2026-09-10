import { useState } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const currentPath = location.pathname

  const navLinks = [
    { name: "Discover", path: "/discover" },
    { name: "Trending", path: "/trending" }
  ]

  const getDesktopClass = (path: string) => {
    const isActive = currentPath === path || (path === "/discover" && currentPath === "/")
    return `text-[11px] uppercase tracking-[0.25em] font-mono font-medium px-3.5 py-1.5 rounded-full transition-all duration-300 ${
      isActive 
        ? "text-[#C5A059] bg-[#C5A059]/[0.1] border border-[#C5A059]/30 shadow-[0_0_15px_rgba(197,160,89,0.15)]" 
        : "text-zinc-300 hover:text-[#F0EDE6] hover:bg-white/[0.06] border border-transparent"
    }`
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 w-full py-5 bg-transparent pointer-events-auto">
        <div className="container mx-auto flex items-center justify-between px-6 md:px-10 max-w-6xl">
          
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-zinc-300 focus:outline-none focus:ring-1 focus:ring-[#C5A059] rounded p-1" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close main navigation menu" : "Open main navigation menu"}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            
            <Link to="/" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C5A059] rounded group" aria-label="WatchCom Home">
              <span className="text-[13px] text-[#C5A059] font-serif">✦</span>
              <div className="flex items-baseline gap-2 select-none">
                <span className="text-base font-serif font-medium tracking-[0.18em] text-[#F0EDE6] uppercase group-hover:text-white transition-colors">WATCHCOM</span>
                <span className="text-[8px] font-mono tracking-[0.2em] text-[#C5A059]/80 uppercase">AI</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              return (
                <Link key={link.path} to={link.path} className={getDesktopClass(link.path)}>
                  <span>{link.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Minimal Accent */}
          <div className="hidden md:block text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
            EST. 2026
          </div>

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
            className="md:hidden fixed top-16 left-0 right-0 z-40 bg-[#0A0A0D]/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col py-6 px-6 space-y-4">
              {navLinks.map((link) => {
                const isActive = currentPath === link.path
                return (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    onClick={() => setIsMenuOpen(false)} 
                    className={`text-sm font-medium tracking-[0.2em] font-mono flex items-center gap-3 transition-colors ${
                      isActive ? "text-[#C5A059]" : "text-zinc-400"
                    }`}
                  >
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
    <div className="min-h-screen bg-[#060607] flex flex-col font-sans text-[#F0EDE6]">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
