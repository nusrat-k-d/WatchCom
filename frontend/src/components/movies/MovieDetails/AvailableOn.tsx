import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Tv, ShoppingCart, Tag } from "lucide-react"
import { COUNTRIES, CountrySelectModal } from "./CountrySelectModal"

interface Provider {
  id: number
  name: string
  logoUrl: string | null
  displayPriority: number
}

interface WatchProvidersData {
  country: string
  link: string
  stream: Provider[]
  rent: Provider[]
  buy: Provider[]
}

interface AvailableOnProps {
  movieId: string
  movieTitle: string
}

// Local cache for watch provider responses to avoid redundant API hits
const providersCache = new Map<string, WatchProvidersData>()

export function AvailableOn({ movieId, movieTitle }: AvailableOnProps) {
  const [country, setCountry] = useState(() => {
    return localStorage.getItem("watchcom_user_country") || ""
  })
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [data, setData] = useState<WatchProvidersData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryTrigger, setRetryTrigger] = useState(0)

  // Auto-open country selector modal if not set in LocalStorage on first visit
  useEffect(() => {
    if (!country) {
      setIsModalOpen(true)
    }
  }, [country])

  // Resolve country visual name and flag
  const countryObj = useMemo(() => {
    return COUNTRIES.find(c => c.code === country) || null
  }, [country])

  // Fetch watch providers data
  useEffect(() => {
    if (!movieId || !country) return

    const cacheKey = `${movieId}::${country}`
    if (providersCache.has(cacheKey)) {
      setData(providersCache.get(cacheKey)!)
      setError(null)
      return
    }

    let active = true
    setIsLoading(true)
    setError(null)

    fetch(`http://localhost:5000/api/movies/${movieId}/watch-providers?country=${country}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch streaming availability.")
        return res.json()
      })
      .then(resData => {
        if (active) {
          setData(resData)
          providersCache.set(cacheKey, resData)
        }
      })
      .catch(err => {
        if (active) {
          setError(err.message || "Something went wrong.")
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [movieId, country, retryTrigger])

  const handleCountrySelect = (code: string) => {
    setCountry(code)
    localStorage.setItem("watchcom_user_country", code)
  }

  // Loading Skeleton View
  if (isLoading) {
    return (
      <div className="bg-[#0b0b0c]/60 border border-white/5 p-8 md:p-10 rounded-[2rem] shadow-2xl animate-pulse space-y-6 text-left">
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="h-6 bg-white/5 rounded w-36" />
          <div className="h-4 bg-white/5 rounded w-24" />
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-white/5 rounded w-48" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2].map(i => (
              <div key={i} className="h-14 bg-white/5 rounded-2xl border border-white/5" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error State View
  if (error) {
    return (
      <div className="bg-[#0b0b0c]/60 border border-white/5 p-8 md:p-10 rounded-[2rem] shadow-2xl text-center space-y-6">
        <h4 className="text-lg font-serif font-bold text-white">Availability Offline</h4>
        <p className="text-xs text-gray-400 max-w-xs mx-auto">
          We encountered an issue checking the streaming catalog for this region.
        </p>
        <button
          onClick={() => setRetryTrigger(prev => prev + 1)}
          className="bg-[#C9A227] hover:bg-[#b5952f] text-black font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    )
  }

  // No country selected yet fallback
  if (!country) {
    return (
      <div className="bg-[#0b0b0c]/60 border border-white/5 p-8 md:p-10 rounded-[2rem] shadow-2xl text-center space-y-4">
        <p className="text-sm text-gray-400">Select your country to view streaming options.</p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#C9A227] hover:bg-[#b5952f] text-black font-bold px-6 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
        >
          Choose Region
        </button>
        <CountrySelectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelect={handleCountrySelect}
        />
      </div>
    )
  }

  if (!data) return null

  const hasStream = data.stream && data.stream.length > 0
  const hasRent = data.rent && data.rent.length > 0
  const hasBuy = data.buy && data.buy.length > 0
  const hasOptions = hasStream || hasRent || hasBuy

  // Best Streaming Option (First flatrate provider, which represents highest display priority/best value)
  const bestStreaming = hasStream ? data.stream[0] : null

  return (
    <div className="w-full">
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full text-left"
        aria-labelledby="watch-providers-heading"
      >
        <div className="bg-[#0b0b0c]/60 backdrop-blur-md border border-white/5 p-8 md:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group hover:border-white/10 transition-colors duration-500">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.02),transparent_70%)] pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#C9A227]/10 border border-[#C9A227]/20 rounded-xl">
                <Tv className="h-4.5 w-4.5 text-[#C9A227]" />
              </div>
              <h2 id="watch-providers-heading" className="text-xs uppercase tracking-widest text-[#C9A227] font-bold font-mono">
                📺 Available On
              </h2>
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">Viewing availability for:</span>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-semibold transition-all cursor-pointer text-xs"
              >
                <span>{countryObj?.flag} {countryObj?.name}</span>
                <span className="text-[10px] text-[#C9A227] font-mono hover:underline">Change</span>
              </button>
            </div>
          </div>

          {/* Best Streaming Option Highlight */}
          {bestStreaming && (
            <div className="mt-6 p-4 bg-[#C9A227]/5 border border-[#C9A227]/15 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl overflow-hidden bg-black/40 border border-white/10 flex-shrink-0 flex items-center justify-center">
                  {bestStreaming.logoUrl ? (
                    <img src={bestStreaming.logoUrl} alt={bestStreaming.name} className="w-full h-full object-cover" />
                  ) : (
                    <Tv className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                <div>
                  <div className="text-[9px] font-mono font-bold tracking-widest uppercase text-[#C9A227]">
                    Best Streaming Option
                  </div>
                  <div className="text-sm font-semibold text-white mt-0.5">
                    Stream on {bestStreaming.name}
                  </div>
                </div>
              </div>
              <a
                href={data.link || `https://www.google.com/search?q=Watch+${encodeURIComponent(movieTitle)}+on+${encodeURIComponent(bestStreaming.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#C9A227] hover:bg-[#b5952f] text-black font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer text-center"
              >
                Watch Now
              </a>
            </div>
          )}

          {/* Providers Grid Container */}
          <div className="mt-8 space-y-8">
            {!hasOptions ? (
              <div className="py-8 text-center space-y-4">
                <p className="text-sm text-gray-400 font-light leading-relaxed">
                  Currently unavailable for streaming in your region.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-colors"
                >
                  Try another country
                </button>
              </div>
            ) : (
              <>
                {/* 1. Streaming Providers */}
                {hasStream && (
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-mono font-bold tracking-widest uppercase text-gray-500 flex items-center gap-1.5">
                      Streaming ({data.stream.length})
                    </h3>
                    
                    {/* Horizontal scroll container on mobile, flex grid on desktop */}
                    <div className="flex overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-4 gap-3.5 pb-2 md:pb-0 scrollbar-none snap-x snap-mandatory">
                      {data.stream.map((provider) => (
                        <a
                          key={provider.id}
                          href={data.link || `https://www.google.com/search?q=Watch+${encodeURIComponent(movieTitle)}+on+${encodeURIComponent(provider.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3.5 bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl hover:bg-white/[0.08] active:scale-[0.99] transition-all duration-300 w-52 md:w-full flex-shrink-0 snap-start focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A227]"
                        >
                          <div className="h-10 w-10 rounded-xl overflow-hidden bg-black/40 border border-white/5 flex-shrink-0 flex items-center justify-center">
                            {provider.logoUrl ? (
                              <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-cover" loading="lazy" />
                            ) : (
                              <Tv className="h-5 w-5 text-gray-600" />
                            )}
                          </div>
                          <span className="text-xs font-semibold text-gray-300 truncate">{provider.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Rental Providers */}
                {hasRent && (
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-mono font-bold tracking-widest uppercase text-gray-500">
                      Rent ({data.rent.length})
                    </h3>
                    <div className="flex overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-4 gap-3.5 pb-2 md:pb-0 scrollbar-none snap-x snap-mandatory">
                      {data.rent.map((provider) => (
                        <a
                          key={provider.id}
                          href={data.link || `https://www.google.com/search?q=Rent+${encodeURIComponent(movieTitle)}+on+${encodeURIComponent(provider.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3.5 bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl hover:bg-white/[0.08] active:scale-[0.99] transition-all duration-300 w-52 md:w-full flex-shrink-0 snap-start focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A227]"
                        >
                          <div className="h-10 w-10 rounded-xl overflow-hidden bg-black/40 border border-white/5 flex-shrink-0 flex items-center justify-center">
                            {provider.logoUrl ? (
                              <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-cover" loading="lazy" />
                            ) : (
                              <ShoppingCart className="h-4.5 w-4.5 text-gray-600" />
                            )}
                          </div>
                          <span className="text-xs font-semibold text-gray-300 truncate">{provider.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Purchase Providers */}
                {hasBuy && (
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-mono font-bold tracking-widest uppercase text-gray-500">
                      Buy ({data.buy.length})
                    </h3>
                    <div className="flex overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-4 gap-3.5 pb-2 md:pb-0 scrollbar-none snap-x snap-mandatory">
                      {data.buy.map((provider) => (
                        <a
                          key={provider.id}
                          href={data.link || `https://www.google.com/search?q=Buy+${encodeURIComponent(movieTitle)}+on+${encodeURIComponent(provider.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3.5 bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl hover:bg-white/[0.08] active:scale-[0.99] transition-all duration-300 w-52 md:w-full flex-shrink-0 snap-start focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A227]"
                        >
                          <div className="h-10 w-10 rounded-xl overflow-hidden bg-black/40 border border-white/5 flex-shrink-0 flex items-center justify-center">
                            {provider.logoUrl ? (
                              <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-cover" loading="lazy" />
                            ) : (
                              <Tag className="h-4.5 w-4.5 text-gray-600" />
                            )}
                          </div>
                          <span className="text-xs font-semibold text-gray-300 truncate">{provider.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </motion.section>

      {/* Country Select Modal */}
      <CountrySelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleCountrySelect}
      />
    </div>
  )
}
