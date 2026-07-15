import { motion } from "framer-motion"
import { Users, Award } from "lucide-react"
import { LazyImage } from "../../ui/LazyImage"

interface CastMember {
  id: number
  name: string
  character: string
  profile_path?: string
}

interface CastCarouselProps {
  cast: CastMember[]
  director: string
}

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
        {/* Soft edge blur overlays */}
        <div className="absolute top-0 left-0 bottom-0 w-12 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none opacity-0 group-hover/cast-carousel:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none opacity-0 group-hover/cast-carousel:opacity-100 transition-opacity duration-300" />
        
        <div className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-6 px-1 snap-x select-none">
          
          {/* Director Card */}
          <div className="flex flex-col items-center text-center shrink-0 w-36 snap-start group/director">
            <div className="w-28 h-28 rounded-2xl overflow-hidden border border-[#C9A227]/30 bg-black/60 flex items-center justify-center mb-4 shadow-xl group-hover/director:border-[#C9A227] group-hover/director:shadow-[0_12px_25px_rgba(201,162,39,0.15)] transition-all duration-500 group-hover/director:-translate-y-1.5">
              <Award className="h-9 w-9 text-[#C9A227] animate-pulse" />
            </div>
            <span className="text-xs font-semibold text-white truncate w-full group-hover/director:text-[#C9A227] transition-colors">{director}</span>
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-0.5 font-mono">Director</span>
          </div>

          {/* Actor list */}
          {cast.slice(0, 15).map((actor) => {
            const photoUrl = actor.profile_path 
              ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` 
              : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"

            return (
              <div 
                key={actor.id} 
                className="flex flex-col items-center text-center shrink-0 w-36 snap-start group cursor-pointer"
              >
                <div className="w-28 h-28 rounded-2xl overflow-hidden border border-white/5 bg-[#0b0b0c] mb-4 group-hover:border-[#C9A227]/40 group-hover:shadow-[0_12px_25px_rgba(0,0,0,0.8),0_0_20px_rgba(201,162,39,0.15)] transition-all duration-500 group-hover:-translate-y-1.5 relative">
                  <LazyImage 
                     src={photoUrl} 
                     alt={actor.name} 
                     className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-101" 
                  />
                </div>
                <span className="text-xs font-semibold text-white truncate w-full group-hover:text-[#C9A227] transition-colors duration-300">
                  {actor.name}
                </span>
                <span className="text-[10px] text-gray-500 truncate w-full font-light mt-0.5">
                  {actor.character}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}
