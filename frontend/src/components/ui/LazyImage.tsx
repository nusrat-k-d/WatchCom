import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface LazyImageProps {
  src: string
  alt: string
  className?: string
}

export function LazyImage({ src, alt, className = "" }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentSrc, setCurrentSrc] = useState("")

  useEffect(() => {
    // Generate a tiny low-quality placeholder based on the original url.
    // If it's a TMDB image, e.g. https://image.tmdb.org/t/p/w500/path.jpg
    // we can generate a w92 or w185 version for a low-quality placeholder.
    let placeholderSrc = ""
    if (src.includes("image.tmdb.org/t/p/")) {
      placeholderSrc = src.replace(/\/w[0-9]+/g, "/w92").replace(/\/original/g, "/w92")
    } else {
      placeholderSrc = src
    }

    setIsLoaded(false)
    setCurrentSrc(placeholderSrc)

    const img = new Image()
    img.src = src
    img.onload = () => {
      setCurrentSrc(src)
      setIsLoaded(true)
    }
  }, [src])

  return (
    <div className={`relative overflow-hidden bg-white/5 ${className}`}>
      {/* Skeleton Shimmer while main image is not loaded */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite] pointer-events-none" />
      )}
      <motion.img
        src={currentSrc}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
        initial={{ filter: "blur(8px)", opacity: 0.6 }}
        animate={{ 
          filter: isLoaded ? "blur(0px)" : "blur(8px)", 
          opacity: 1 
        }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />
    </div>
  )
}
