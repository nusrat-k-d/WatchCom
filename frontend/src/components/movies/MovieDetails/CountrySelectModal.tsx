import { motion, AnimatePresence } from "framer-motion"
import { Globe, X } from "lucide-react"

interface Country {
  code: string
  name: string
  flag: string
}

export const COUNTRIES: Country[] = [
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" }
]

interface CountrySelectModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (code: string) => void
}

export function CountrySelectModal({ isOpen, onClose, onSelect }: CountrySelectModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm bg-[#0b0b0c] border border-white/10 rounded-[2rem] shadow-[0_30px_70px_rgba(0,0,0,0.8)] overflow-hidden relative z-10 p-8 flex flex-col items-center"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-1.5 hover:bg-white/10 text-gray-500 hover:text-white rounded-full transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="h-12 w-12 bg-[#C9A227]/10 border border-[#C9A227]/25 rounded-2xl flex items-center justify-center text-[#C9A227] mb-6">
              <Globe className="h-5 w-5" />
            </div>

            <h3 className="text-xl font-serif font-bold text-white mb-2">Choose Your Region</h3>
            <p className="text-xs text-gray-400 text-center mb-8 max-w-[240px] leading-relaxed">
              Select your region to see streaming, rental, and purchasing options.
            </p>

            {/* Countries List */}
            <div className="w-full space-y-2">
              {COUNTRIES.map((country) => (
                <button
                  key={country.code}
                  onClick={() => {
                    onSelect(country.code)
                    onClose()
                  }}
                  className="w-full flex items-center gap-4 px-5 py-3.5 bg-white/5 border border-white/5 hover:border-[#C9A227]/20 hover:bg-[#C9A227]/5 rounded-2xl transition-all cursor-pointer group text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A227]"
                >
                  <span className="text-2xl select-none">{country.flag}</span>
                  <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
                    {country.name}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
