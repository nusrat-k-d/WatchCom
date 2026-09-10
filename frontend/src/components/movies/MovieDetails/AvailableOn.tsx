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

const providersCache = new Map<string, WatchProvidersData>()

export function AvailableOn({ movieId, movieTitle }: AvailableOnProps) {
  const [country, setCountry] = useState(() => {
    return localStorage.getItem("watchcom_user_country") || "US"
  })
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [data, setData] = useState<WatchProvidersData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryTrigger, setRetryTrigger] = useState(0)

  // Resolve country visual name and flag
  const countryObj = useMemo(() => {
    return COUNTRIES.find(c => c.code === country) || { code: "US", name: "United States", flag: "🇺🇸" }
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

  if (isLoading) {
    return (
      <div className="bg-[#09090c]/80 border border-white/[0.08] p-6 md:p-8 rounded-3xl animate-pulse space-y-4 text-left">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="h-4 bg-white/[0.06] rounded w-32" />
          <div className="h-4 bg-white/[0.06] rounded w-20" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-12 bg-white/[0.04] rounded-xl border border-white/[0.06]" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-[#09090c]/80 border border-white/[0.08] p-6 md:p-8 rounded-3xl text-center space-y-4">
        <h4 className="text-sm font-serif text-[#F0EDE6]">Availability Directory Offline</h4>
        <p className="text-xs text-zinc-500 max-w-xs mx-auto font-light">
          Unable to synchronize streaming catalog for this region.
        </p>
        <button
          onClick={() => setRetryTrigger(prev => prev + 1)}
          className="bg-[#C5A059] text-[#08080a] font-semibold px-4 py-2 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!data) return null

  const hasStream = data.stream && data.stream.length > 0
  const hasRent = data.rent && data.rent.length > 0
  const hasBuy = data.buy && data.buy.length > 0
  const hasOptions = hasStream || hasRent || hasBuy

  const bestStreaming = hasStream ? data.stream[0] : null

  return (
    <div className="w-full">
      <motion.section
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full text-left"
        aria-labelledby="watch-providers-heading"
      >
        <div className="bg-[#09090c]/80 backdrop-blur-md border border-white/[0.08] p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden group">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-lg text-[#C5A059]">
                <Tv className="h-4 w-4" />
              </div>
              <h2 id="watch-providers-heading" className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-medium font-mono">
                ✦ Streaming & Distribution
              </h2>
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-500 font-light">Region:</span>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-full text-zinc-300 font-medium transition-all cursor-pointer text-xs"
              >
                <span>{countryObj.flag} {countryObj.name}</span>
                <span className="text-[10px] text-[#C5A059] font-mono ml-1">Change</span>
              </button>
            </div>
          </div>

          {/* Best Streaming Option Highlight */}
          {bestStreaming && (
            <div className="mt-5 p-3.5 bg-[#C5A059]/[0.06] border border-[#C5A059]/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl overflow-hidden bg-black/60 border border-white/[0.08] shrink-0 flex items-center justify-center">
                  {bestStreaming.logoUrl ? (
                    <img src={bestStreaming.logoUrl} alt={bestStreaming.name} className="w-full h-full object-cover" />
                  ) : (
                    <Tv className="h-4 w-4 text-zinc-500" />
                  )}
                </div>
                <div>
                  <div className="text-[9px] font-mono font-medium tracking-widest uppercase text-[#C5A059]">
                    Primary Streamer
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-zinc-200 mt-0.5">
                    Stream on {bestStreaming.name}
                  </div>
                </div>
              </div>
              <a
                href={data.link || `https://www.google.com/search?q=Watch+${encodeURIComponent(movieTitle)}+on+${encodeURIComponent(bestStreaming.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#C5A059] hover:bg-[#D8B878] text-[#08080a] font-semibold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer text-center uppercase tracking-wider"
              >
                Watch Now
              </a>
            </div>
          )}

          {/* Providers Grid */}
          <div className="mt-6 space-y-6">
            {!hasOptions ? (
              <div className="py-6 text-center space-y-3">
                <p className="text-xs text-zinc-500 font-light">
                  Currently unavailable for direct digital streaming in this region.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-zinc-300 text-xs px-4 py-2 rounded-xl cursor-pointer transition-colors font-mono uppercase tracking-wider"
                >
                  Change Region
                </button>
              </div>
            ) : (
              <>
                {/* 1. Streaming */}
                {hasStream && (
                  <div className="space-y-2.5">
                    <h3 className="text-[10px] font-mono font-medium tracking-widest uppercase text-zinc-500">
                      Subscription ({data.stream.length})
                    </h3>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {data.stream.map((provider) => (
                        <a
                          key={provider.id}
                          href={data.link || `https://www.google.com/search?q=Watch+${encodeURIComponent(movieTitle)}+on+${encodeURIComponent(provider.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 p-2.5 bg-white/[0.03] border border-white/[0.06] hover:border-[#C5A059]/30 rounded-xl hover:bg-white/[0.06] transition-all cursor-pointer group"
                        >
                          <div className="h-8 w-8 rounded-lg overflow-hidden bg-black/60 border border-white/[0.08] shrink-0 flex items-center justify-center">
                            {provider.logoUrl ? (
                              <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-cover" loading="lazy" />
                            ) : (
                              <Tv className="h-4 w-4 text-zinc-600" />
                            )}
                          </div>
                          <span className="text-xs text-zinc-300 truncate group-hover:text-white font-medium">{provider.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Rent */}
                {hasRent && (
                  <div className="space-y-2.5">
                    <h3 className="text-[10px] font-mono font-medium tracking-widest uppercase text-zinc-500">
                      Rent ({data.rent.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {data.rent.map((provider) => (
                        <a
                          key={provider.id}
                          href={data.link || `https://www.google.com/search?q=Rent+${encodeURIComponent(movieTitle)}+on+${encodeURIComponent(provider.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 p-2.5 bg-white/[0.03] border border-white/[0.06] hover:border-[#C5A059]/30 rounded-xl hover:bg-white/[0.06] transition-all cursor-pointer group"
                        >
                          <div className="h-8 w-8 rounded-lg overflow-hidden bg-black/60 border border-white/[0.08] shrink-0 flex items-center justify-center">
                            {provider.logoUrl ? (
                              <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-cover" loading="lazy" />
                            ) : (
                              <ShoppingCart className="h-4 w-4 text-zinc-600" />
                            )}
                          </div>
                          <span className="text-xs text-zinc-300 truncate group-hover:text-white font-medium">{provider.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Buy */}
                {hasBuy && (
                  <div className="space-y-2.5">
                    <h3 className="text-[10px] font-mono font-medium tracking-widest uppercase text-zinc-500">
                      Purchase ({data.buy.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {data.buy.map((provider) => (
                        <a
                          key={provider.id}
                          href={data.link || `https://www.google.com/search?q=Buy+${encodeURIComponent(movieTitle)}+on+${encodeURIComponent(provider.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 p-2.5 bg-white/[0.03] border border-white/[0.06] hover:border-[#C5A059]/30 rounded-xl hover:bg-white/[0.06] transition-all cursor-pointer group"
                        >
                          <div className="h-8 w-8 rounded-lg overflow-hidden bg-black/60 border border-white/[0.08] shrink-0 flex items-center justify-center">
                            {provider.logoUrl ? (
                              <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-cover" loading="lazy" />
                            ) : (
                              <Tag className="h-4 w-4 text-zinc-600" />
                            )}
                          </div>
                          <span className="text-xs text-zinc-300 truncate group-hover:text-white font-medium">{provider.name}</span>
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
