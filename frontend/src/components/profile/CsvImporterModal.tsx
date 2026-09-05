import { useState } from "react"
import { motion } from "framer-motion"
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Sparkles, Film, Star } from "lucide-react"
import { useTaste } from "../../context/UserTasteContext"
import { Button } from "../ui/button"

interface CsvImporterModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ParsedMovieRow {
  title: string
  year?: number
  score: number // 1-5 scale
}

const SAMPLE_CSV = `Title,Year,Your Rating
Interstellar,2014,10
Inception,2010,9
Arrival,2016,10
Blade Runner 2049,2017,9
About Time,2013,8
Whiplash,2014,10
The Dark Knight,2008,10
Parasite,2019,9
Dune: Part Two,2024,9
Her,2013,8`

export function CsvImporterModal({ isOpen, onClose }: CsvImporterModalProps) {
  const { bulkImportRatings } = useTaste()
  const [dragActive, setDragActive] = useState(false)
  const [parsedRows, setParsedRows] = useState<ParsedMovieRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState(false)

  const parseCsvText = (text: string) => {
    try {
      setError(null)
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
      if (lines.length < 2) {
        throw new Error("CSV file appears to be empty or missing data rows.")
      }

      const header = lines[0].split(",").map(h => h.trim().replace(/^["']|["']$/g, "").toLowerCase())
      
      // Identify column indexes
      let titleIdx = header.findIndex(h => h === "title" || h === "name" || h.includes("film") || h.includes("movie"))
      let yearIdx = header.findIndex(h => h === "year" || h.includes("release"))
      let ratingIdx = header.findIndex(h => h === "your rating" || h === "rating" || h.includes("score"))

      if (titleIdx === -1) titleIdx = 0 // default first column
      if (ratingIdx === -1) ratingIdx = header.length > 2 ? 2 : 1

      const results: ParsedMovieRow[] = []

      for (let i = 1; i < lines.length; i++) {
        // Simple CSV splitter handling basic quotes
        const line = lines[i]
        const cols = line.split(",").map(c => c.trim().replace(/^["']|["']$/g, ""))
        if (cols.length <= titleIdx) continue

        const title = cols[titleIdx]
        if (!title) continue

        const year = yearIdx !== -1 && cols[yearIdx] ? parseInt(cols[yearIdx], 10) : undefined
        let rawScore = ratingIdx !== -1 && cols[ratingIdx] ? parseFloat(cols[ratingIdx]) : 4.0

        // Scale to 1-5 (if 1-10 IMDb format)
        let score = 4
        if (rawScore > 5) {
          score = Math.min(5, Math.max(1, Math.round(rawScore / 2)))
        } else {
          score = Math.min(5, Math.max(1, Math.round(rawScore)))
        }

        results.push({
          title,
          year: isNaN(year || NaN) ? undefined : year,
          score
        })
      }

      if (results.length === 0) {
        throw new Error("Could not parse any valid movie rows from this CSV.")
      }

      setParsedRows(results)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error parsing CSV file")
      setParsedRows([])
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (content) parseCsvText(content)
    }
    reader.readAsText(file)
  }

  const handleApplyImport = () => {
    if (parsedRows.length === 0) return

    // Convert parsed rows into ratings items
    const now = new Date().toISOString()
    const ratingsToImport = parsedRows.map((row, idx) => ({
      movieId: `imported_${row.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${idx}`,
      score: row.score,
      date: now
    }))

    bulkImportRatings(ratingsToImport)
    setImportSuccess(true)

    setTimeout(() => {
      setImportSuccess(false)
      onClose()
    }, 1800)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0a0a0b] border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 scrollbar-none"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#C9A227] to-amber-500 flex items-center justify-center text-black font-extrabold shadow-lg shadow-[#C9A227]/20">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-serif text-white flex items-center gap-2">
              <span>Import Letterboxd / IMDb</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#C9A227]/20 text-[#C9A227] font-mono">
                CSV
              </span>
            </h2>
            <p className="text-xs text-gray-400">
              Upload your ratings export to instantly populate your Taste DNA profile.
            </p>
          </div>
        </div>

        {importSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white font-serif">
              {parsedRows.length} Movies Successfully Imported!
            </h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Your Taste DNA neural vector and profile strength have been updated in real-time.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Drag & Drop Box */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragActive(false)
                const file = e.dataTransfer.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = (event) => {
                    const content = event.target?.result as string
                    if (content) parseCsvText(content)
                  }
                  reader.readAsText(file)
                }
              }}
              className={`p-8 rounded-3xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center gap-3 cursor-pointer ${
                dragActive
                  ? "border-[#C9A227] bg-[#C9A227]/5"
                  : "border-white/10 hover:border-white/20 bg-white/[0.01]"
              }`}
            >
              <FileText className="w-10 h-10 text-[#C9A227] mb-1" />
              <div className="text-sm font-semibold text-white">
                Drag & Drop your ratings.csv here
              </div>
              <p className="text-xs text-gray-500">
                Supports standard export files from Letterboxd & IMDb
              </p>

              <label className="mt-2 inline-block">
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-gray-200 hover:text-white font-medium cursor-pointer transition-all border border-white/10">
                  Browse File
                </span>
              </label>
            </div>

            {/* Quick Sample CSV Test Button */}
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] text-gray-500">Don't have a CSV on hand?</span>
              <button
                onClick={() => parseCsvText(SAMPLE_CSV)}
                className="text-xs text-[#C9A227] hover:underline font-semibold cursor-pointer"
              >
                Load Sample Test Data (10 Classics)
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Parsed Preview Table */}
            {parsedRows.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-400">
                  <span>Parsed Movies ({parsedRows.length})</span>
                  <span className="text-[#C9A227]">
                    Avg Score: {(parsedRows.reduce((a, b) => a + b.score, 0) / parsedRows.length).toFixed(1)} / 5
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto rounded-2xl bg-black/40 border border-white/5 p-2 space-y-1 scrollbar-none">
                  {parsedRows.slice(0, 8).map((row, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] text-xs text-gray-300"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <Film className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                        <span className="font-medium text-white truncate">{row.title}</span>
                        {row.year && <span className="text-gray-500">({row.year})</span>}
                      </div>
                      <div className="flex items-center gap-1 font-mono text-[#C9A227] shrink-0 font-bold">
                        <Star className="w-3 h-3 fill-[#C9A227]" />
                        <span>{row.score}/5</span>
                      </div>
                    </div>
                  ))}
                  {parsedRows.length > 8 && (
                    <div className="text-center text-[11px] text-gray-500 py-1">
                      + {parsedRows.length - 8} more movies ready for import
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleApplyImport}
                  className="w-full py-5 bg-[#C9A227] hover:bg-[#B38F1E] text-black font-extrabold text-sm rounded-2xl shadow-xl shadow-[#C9A227]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Import {parsedRows.length} Movies to Taste DNA</span>
                </Button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}
