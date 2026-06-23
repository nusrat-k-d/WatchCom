import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Target, Info } from "lucide-react"
import { useTaste } from "../../context/UserTasteContext"

export function ProfileCompletion() {
  const { metrics } = useTaste()
  
  return (
    <Card className="bg-[#0f0f0f] border-white/5 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-gold)]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
      <CardHeader className="pb-4 border-b border-white/5">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <Target className="h-4 w-4 text-[var(--color-gold)]" /> Profile Completion
          </CardTitle>
          <div className="text-2xl font-bold text-white">{metrics.profileStrength}<span className="text-sm text-[var(--color-gold)]">%</span></div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">
              <span>Movies Rated</span>
              <span className="text-white">{metrics.totalRated} / 20</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[var(--color-gold)]" style={{ width: `${Math.min(100, (metrics.totalRated / 20) * 100)}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">
              <span>Genres Explored</span>
              <span className="text-white">{metrics.ratedGenresCount} / 10</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[var(--color-gold)]" style={{ width: `${Math.min(100, (metrics.ratedGenresCount / 10) * 100)}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">
              <span>Decades Rated</span>
              <span className="text-white">{metrics.ratedDecadesCount} / 8</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[var(--color-gold)]" style={{ width: `${Math.min(100, (metrics.ratedDecadesCount / 8) * 100)}%` }} />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Recommendation Quality</div>
          <div className="text-sm font-bold text-green-400">{metrics.profileStrength > 50 ? "High" : "Low"}</div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-2">
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 text-[var(--color-gold)] shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm text-gray-300 font-medium">Actionable Insights</p>
              <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                {metrics.totalRated < 20 && <li>Rate {20 - metrics.totalRated} more movies to reach Peak Accuracy.</li>}
                {metrics.ratedGenresCount < 10 && <li>Explore {10 - metrics.ratedGenresCount} more genres to round out your profile.</li>}
                {metrics.totalRated >= 20 && metrics.ratedGenresCount >= 10 && <li>Your profile is highly optimized.</li>}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
