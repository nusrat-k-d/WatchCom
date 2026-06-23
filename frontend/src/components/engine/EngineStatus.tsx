import { Card, CardContent } from "../ui/card"
import { Activity, ShieldCheck, Zap, Database } from "lucide-react"
import { useTaste } from "../../context/UserTasteContext"

export function EngineStatus() {
  const { metrics } = useTaste()

  return (
    <Card className="bg-[#0f0f0f] border-white/5 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
          <div className="bg-white/5 p-2 rounded-lg">
            <Activity className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Recommendation Engine</h3>
            <p className="text-xs text-green-400 font-medium tracking-wider uppercase">Online & Processing</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/40 border border-white/5 rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">
              <ShieldCheck className="h-3 w-3" /> Profile Strength
            </div>
            <div className="text-xl font-bold text-white">{metrics.profileStrength}%</div>
          </div>
          
          <div className="bg-black/40 border border-white/5 rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">
              <Zap className="h-3 w-3 text-[var(--color-gold)]" /> Confidence
            </div>
            <div className="text-xl font-bold text-[var(--color-gold)]">{metrics.confidence}%</div>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">
              <Database className="h-3 w-3" /> Data Quality
            </div>
            <div className="text-xl font-bold text-white">{metrics.totalRated > 10 ? "Optimal" : "Learning"}</div>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">
              <Target className="h-3 w-3" /> Reliability
            </div>
            <div className="text-xl font-bold text-white">{metrics.confidence > 70 ? "High" : "Building"}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Target(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}
