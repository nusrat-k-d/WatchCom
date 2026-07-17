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
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
  }

  // Visual label for department
  const roleLabel = person.known_for_department === "Directing" ? "Director" : "Actor"

  return (
    <div className="relative w-full border-b border-white/5 bg-gradient-to-b from-[#0e0e10] to-[#050505] pt-8 pb-12">
      {/* Background decoration */}
      <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.02),transparent_70%)] pointer-events-none z-0 blur-[60px]" />
      
      <div className="container mx-auto px-4 md:px-8 max-w-5xl relative z-10 text-left">
        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#C9A227] transition-colors mb-8 group cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-[#C9A227] rounded-md px-2 py-1"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
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
            className="w-48 h-72 md:w-64 md:h-96 rounded-2xl overflow-hidden border border-white/5 bg-[#0b0b0c] shadow-2xl shrink-0 group hover:border-[#C9A227]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.7),0_0_25px_rgba(201,162,39,0.15)] transition-all duration-500 relative"
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
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#C9A227] uppercase">
                {roleLabel} • {person.known_for_department}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight uppercase tracking-tight">
                {person.name}
              </h1>
            </div>

            {/* Metadata fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-sans font-light text-gray-400">
              {/* Born */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-mono uppercase font-bold tracking-wider">Born</div>
                  <div>{formatDate(person.birthday)}</div>
                </div>
              </div>

              {/* Place of Birth */}
              {person.place_of_birth && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                    <MapPin className="h-4 w-4 text-gray-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-mono uppercase font-bold tracking-wider">Place of Birth</div>
                    <div className="truncate max-w-[200px]" title={person.place_of_birth}>
                      {person.place_of_birth}
                    </div>
                  </div>
                </div>
              )}

              {/* Popularity */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                  <Heart className="h-4 w-4 text-[#C9A227] fill-[#C9A227]/20" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-mono uppercase font-bold tracking-wider">Popularity Score</div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-white">{person.popularity.toFixed(1)}</span>
                    <span className="text-[10px] text-gray-600">points</span>
                  </div>
                </div>
              </div>

              {/* Homepage (if available) */}
              {person.homepage && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                    <Globe className="h-4 w-4 text-gray-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-mono uppercase font-bold tracking-wider">Official Website</div>
                    <div>
                      <a
                        href={person.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#C9A227] hover:underline truncate max-w-[200px] block"
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
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                    <Calendar className="h-4 w-4 text-red-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-mono uppercase font-bold tracking-wider">Died</div>
                    <div>{formatDate(person.deathday)}</div>
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
