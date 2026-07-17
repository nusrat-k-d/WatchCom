import { useState } from "react"
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react"

interface PersonBiographyProps {
  biography: string | null
}

export function PersonBiography({ biography }: PersonBiographyProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!biography) return null

  const limit = 400
  const shouldTruncate = biography.length > limit
  const displayBio = isExpanded || !shouldTruncate 
    ? biography 
    : `${biography.substring(0, limit)}...`

  return (
    <section className="space-y-6 py-8 text-left border-b border-white/5">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/5 border border-white/10 rounded-lg">
          <BookOpen className="h-4 w-4 text-gray-400" />
        </div>
        <h2 className="text-xs uppercase tracking-widest text-gray-400 font-bold font-mono">
          📖 Biography
        </h2>
      </div>

      <div className="max-w-3xl space-y-4">
        <p className="text-sm md:text-base text-gray-300 font-sans font-light leading-relaxed whitespace-pre-line">
          {displayBio}
        </p>

        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 text-xs text-[#C9A227] hover:underline font-mono font-bold uppercase tracking-wider cursor-pointer focus-visible:outline-none"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                Read Biography <ChevronDown className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        )}
      </div>
    </section>
  )
}
