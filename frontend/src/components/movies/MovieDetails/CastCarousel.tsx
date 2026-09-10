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

// Interactive 3D tilt Card for Cast and Crew members
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
    
    const rotateX = -mouseY / (height / 12)
    const rotateY = mouseX / (width / 12)
    
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`
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
      className="flex flex-col items-center text-center shrink-0 w-32 snap-start group cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C5A059] rounded-2xl p-1"
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
        className={`w-24 h-24 rounded-2xl overflow-hidden border bg-[#09090c] mb-3 shadow-lg transition-all duration-500 relative ${
          isDirector 
            ? "border-[#C5A059]/40 group-hover:border-[#C5A059]" 
            : "border-white/[0.08] group-hover:border-[#C5A059]/40"
        }`}
      >
        {photoUrl ? (
          <LazyImage 
             src={photoUrl} 
             alt={name} 
             className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black/60">
            <Award className="h-6 w-6 text-[#C5A059]" />
          </div>
        )}
      </div>
      <span className="text-xs font-medium text-[#F0EDE6] truncate w-full group-hover:text-[#C5A059] transition-colors duration-200">
        {name}
      </span>
      <span className={`text-[10px] text-zinc-500 truncate w-full mt-0.5 ${isDirector ? "uppercase font-medium tracking-wider font-mono text-[#C5A059]" : "font-light"}`}>
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
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-6 py-8 text-left w-full border-t border-white/[0.06]"
      aria-labelledby="cast-section-heading"
    >
      <div className="flex items-center gap-2.5 pb-1">
        <div className="p-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[#C5A059]">
          <Users className="h-4 w-4" />
        </div>
        <h2 id="cast-section-heading" className="text-[11px] uppercase tracking-[0.25em] text-zinc-400 font-medium font-mono">
          ✦ Cast & Crew Ensemble
        </h2>
      </div>

      <div className="relative overflow-hidden w-full group/cast-carousel">
        <div className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4 px-1 snap-x select-none">
          
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
