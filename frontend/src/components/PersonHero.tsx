import { useRef } from "react"
import { ArrowLeft, MapPin, Calendar, Heart, Globe } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { LazyImage } from "./ui/LazyImage"

interface PersonHeroProps {
  person: {
    name: string
    profile_path: string | null
    known_for_department: string
    birthday: string | null
    deathday: string | null
    place_of_birth: string | null
    popularity: number
    homepage?: string | null
  }
}

export function PersonHero({ person }: PersonHeroProps) {
  const navigate = useNavigate()
  const cardRef = useRef<HTMLDivElement>(null)

  const photoUrl = person.profile_path
    ? `https://image.tmdb.org/t/p/h632${person.profile_path}`
    : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400"

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A"
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      })
    } catch {
      return dateStr
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left - width / 2
    const mouseY = e.clientY - rect.top - height / 2
    
    const rotateX = -mouseY / (height / 16)
    const rotateY = mouseX / (width / 16)
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
  }

  // Visual label for department
  const roleLabel = person.known_for_department === "Directing" ? "Director" : "Actor"

  return (
    <div className="relative w-full border-b border-white/[0.06] bg-gradient-to-b from-[#09090c] to-[#060607] pt-24 md:pt-28 pb-12">
      {/* Background decoration */}
      <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.03),transparent_70%)] pointer-events-none z-0 blur-[60px]" />
      
      <div className="container mx-auto px-6 md:px-10 max-w-6xl relative z-10 text-left">
        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 hover:text-[#C5A059] transition-colors mb-8 group cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-[#C5A059] rounded-md px-2 py-1"
          aria-label="Go back to previous page"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Hero Content */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          {/* Profile Photo */}
          <div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ 
              transformStyle: "preserve-3d",
              perspective: 1000,
              transition: "transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)",
              willChange: "transform"
            }}
            className="w-48 h-72 md:w-64 md:h-96 rounded-2xl overflow-hidden border border-white/[0.08] bg-[#09090c] shadow-2xl shrink-0 group hover:border-[#C5A059]/30 transition-all duration-500 relative"
          >
            {/* Glare effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <LazyImage
              src={photoUrl}
              alt={person.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          </div>

          {/* Person Info */}
          <div className="flex-1 space-y-6 pt-2">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-medium tracking-[0.25em] text-[#C5A059] uppercase">
                ✦ {roleLabel} • {person.known_for_department}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#F0EDE6] leading-tight tracking-tight">
                {person.name}
              </h1>
            </div>

            {/* Metadata fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-sans font-light text-zinc-300">
              {/* Born */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/[0.04] rounded-lg border border-white/[0.06]">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 font-mono uppercase font-medium tracking-wider">Born</div>
                  <div className="text-xs text-zinc-300">{formatDate(person.birthday)}</div>
                </div>
              </div>

              {/* Place of Birth */}
              {person.place_of_birth && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/[0.04] rounded-lg border border-white/[0.06]">
                    <MapPin className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 font-mono uppercase font-medium tracking-wider">Place of Birth</div>
                    <div className="text-xs text-zinc-300 truncate max-w-[200px]" title={person.place_of_birth}>
                      {person.place_of_birth}
                    </div>
                  </div>
                </div>
              )}

              {/* Popularity */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/[0.04] rounded-lg border border-white/[0.06]">
                  <Heart className="h-4 w-4 text-[#C5A059] fill-[#C5A059]/20" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 font-mono uppercase font-medium tracking-wider">Popularity Score</div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-zinc-200">{person.popularity.toFixed(1)}</span>
                    <span className="text-[10px] text-zinc-500">points</span>
                  </div>
                </div>
              </div>

              {/* Homepage (if available) */}
              {person.homepage && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/[0.04] rounded-lg border border-white/[0.06]">
                    <Globe className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 font-mono uppercase font-medium tracking-wider">Official Website</div>
                    <div>
                      <a
                        href={person.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#C5A059] hover:underline truncate max-w-[200px] block"
                        title={person.homepage}
                      >
                        Visit site
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Died (if applicable) */}
              {person.deathday && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/[0.04] rounded-lg border border-white/[0.06]">
                    <Calendar className="h-4 w-4 text-rose-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 font-mono uppercase font-medium tracking-wider">Died</div>
                    <div className="text-xs text-zinc-300">{formatDate(person.deathday)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
