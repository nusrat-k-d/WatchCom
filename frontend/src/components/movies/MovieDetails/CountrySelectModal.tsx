import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, X } from "lucide-react"

interface Country {
  code: string
  name: string
  flag: string
}

export const COUNTRIES: Country[] = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "IN", name: "India", flag: "🇮🇳" },
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
  if (!isOpen) return null

  return typeof document !== "undefined" ? createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-sm bg-[#09090c] border border-white/[0.08] rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.9)] overflow-hidden relative z-10 p-7 flex flex-col items-center"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 hover:bg-white/[0.06] text-zinc-500 hover:text-white rounded-full transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="h-10 w-10 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-xl flex items-center justify-center text-[#C5A059] mb-4">
              <Globe className="h-5 w-5" />
            </div>

            <h3 className="text-lg font-serif font-normal text-[#F0EDE6] mb-1">Select Streaming Region</h3>
            <p className="text-xs text-zinc-400 text-center mb-6 max-w-[240px] font-light leading-relaxed">
              Calibrate availability for streaming and purchase platforms.
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
                  className="w-full flex items-center gap-3.5 px-4 py-3 bg-white/[0.03] border border-white/[0.06] hover:border-[#C5A059]/30 hover:bg-white/[0.06] rounded-xl transition-all cursor-pointer group text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5A059]"
                >
                  <span className="text-xl select-none">{country.flag}</span>
                  <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">
                    {country.name}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  ) : null
}
