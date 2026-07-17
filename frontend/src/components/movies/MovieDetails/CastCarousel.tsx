import React, { useRef } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Users, Award } from "lucide-react"
import { LazyImage } from "../../ui/LazyImage"

interface CastMember {
  id: number
  name: string
  character: string
  profile_path?: string
}

interface Director {
  id: number
  name: string
  profile_path?: string
}

interface CastCarouselProps {
  cast: CastMember[]
  director: Director | null
}

interface CastCardProps {
  id: number
  name: string
  role: string
  photoUrl: string | null
  isDirector?: boolean
}

// Interactive 3D tilt Card for Cast and Crew members with enhanced hover animations
const CastCard = React.memo(function CastCard({ id, name, role, photoUrl, isDirector = false }: CastCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left - width / 2
    const mouseY = e.clientY - rect.top - height / 2
    
    // Limits tilt to ~12 degrees for smaller cards
    const rotateX = -mouseY / (height / 12)
    const rotateY = mouseX / (width / 12)
    
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
  }

  const toUrl = isDirector ? `/director/${id}` : `/actor/${id}`

  return (
    <Link 
      to={toUrl}
      className="flex flex-col items-center text-center shrink-0 w-36 snap-start group cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A227] rounded-2xl p-1"
    >
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ 
          transformStyle: "preserve-3d",
          perspective: 600,
          transition: "transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)",
          willChange: "transform"
        }}
        className={`w-28 h-28 rounded-2xl overflow-hidden border bg-[#0b0b0c] mb-4 shadow-xl transition-all duration-500 relative ${
          isDirector 
            ? "border-[#C9A227]/30 group-hover:border-[#C9A227] group-hover:shadow-[0_15px_30px_rgba(201,162,39,0.25),0_0_15px_rgba(201,162,39,0.2)]" 
            : "border-white/5 group-hover:border-[#C9A227] group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.9),0_0_20px_rgba(201,162,39,0.25)]"
        }`}
      >
        {/* Cursor glare effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {photoUrl ? (
          <LazyImage 
             src={photoUrl} 
             alt={name} 
             className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black/60">
            <Award className="h-9 w-9 text-[#C9A227] animate-pulse" />
          </div>
        )}
      </div>
      <span className="text-xs font-semibold text-white truncate w-full group-hover:text-[#C9A227] transition-colors duration-300">
        {name}
      </span>
      <span className={`text-[10px] text-gray-500 truncate w-full mt-0.5 ${isDirector ? "uppercase font-bold tracking-wider font-mono" : "font-light"}`}>
        {role}
      </span>
    </Link>
  )
})

export function CastCarousel({ cast, director }: CastCarouselProps) {
  if (cast.length === 0) return null

  return (
    <motion.section 
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="space-y-8 py-10 text-left w-full border-t border-white/5"
      aria-labelledby="cast-section-heading"
    >
      <div className="flex items-center gap-3 pb-2">
        <div className="p-2 bg-white/5 border border-white/10 rounded-lg">
          <Users className="h-4 w-4 text-gray-400" />
        </div>
        <h2 id="cast-section-heading" className="text-xs uppercase tracking-widest text-gray-400 font-bold font-mono">
          🎭 Cast & Crew
        </h2>
      </div>

      <div className="relative overflow-hidden w-full group/cast-carousel">
        {/* Soft edge blur overlays (vignette effect) */}
        <div className="absolute top-0 left-0 bottom-0 w-12 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none opacity-0 group-hover/cast-carousel:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none opacity-0 group-hover/cast-carousel:opacity-100 transition-opacity duration-300" />

        <div className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-6 px-1 snap-x select-none">
          
          {/* Director Card */}
          {director && (
            <CastCard 
              id={director.id}
              name={director.name}
              role="Director"
              photoUrl={director.profile_path ? `https://image.tmdb.org/t/p/w185${director.profile_path}` : null}
              isDirector={true}
            />
          )}

          {/* Actor list */}
          {cast.slice(0, 15).map((actor) => {
            const photoUrl = actor.profile_path 
              ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` 
              : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"

            return (
              <CastCard 
                key={actor.id}
                id={actor.id}
                name={actor.name}
                role={actor.character}
                photoUrl={photoUrl}
              />
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}
