import { Settings, LogOut, Star, Dna, Target, Clock, Activity } from "lucide-react"
import { motion } from "framer-motion"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { MOCK_MOVIES } from "../lib/mock-data"
import { useAuth } from "../context/AuthContext"
import { ProfileCompletion } from "../components/profile/ProfileCompletion"
import { LazyImage } from "../components/ui/LazyImage"

export function ProfilePage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  
  const recentRatings = [
    { movie: MOCK_MOVIES[0], rating: 5, date: "2 hours ago" },
    { movie: MOCK_MOVIES[3], rating: 4, date: "1 week ago" },
    { movie: MOCK_MOVIES[5], rating: 4, date: "2 weeks ago" },
  ]

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl pb-24">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar / Identity */}
        <div className="w-full lg:w-1/3 space-y-6">
          <Card className="bg-[#0f0f0f] border-white/5 text-center pt-8 shadow-2xl">
            <div className="mx-auto h-28 w-28 rounded-full bg-gradient-to-tr from-[var(--color-gold)] to-purple-600 p-1 mb-4">
              <div className="h-full w-full rounded-full bg-[#111] flex items-center justify-center">
                <Dna className="h-12 w-12 text-[var(--color-gold)]" />
              </div>
            </div>
            <CardHeader className="pt-0 pb-2">
              <CardTitle className="text-3xl font-serif">Alex Cinephile</CardTitle>
              <p className="text-[var(--color-text-secondary)] text-sm">Taste Vector ID: #8492-A</p>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="mb-4">
                <ProfileCompletion />
              </div>

              <Link to="/taste-dna">
                <Button className="w-full bg-[var(--color-gold)] hover:bg-[#b5952f] text-black font-bold">
                  <Dna className="mr-2 h-4 w-4" /> Full Taste DNA Report
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start border-white/10 hover:bg-white/5 text-gray-300">
                <Settings className="mr-2 h-4 w-4" /> Recommendation Settings
              </Button>
              <button onClick={() => { logout(); navigate("/"); }} className="w-full flex items-center justify-start rounded-md text-sm font-medium h-10 px-4 py-2 border border-white/10 hover:bg-white/5 text-red-500 hover:text-red-400">
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </button>
            </CardContent>
          </Card>

          <Card className="bg-[#0f0f0f] border-white/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Target className="h-5 w-5 text-[var(--color-gold)]" /> Affinity Core</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Primary Genre</span>
                <span className="font-bold text-white">Sci-Fi (92%)</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Top Director</span>
                <span className="font-bold text-white">Christopher Nolan</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Favorite Decade</span>
                <span className="font-bold text-white">2010s</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-2/3 space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Activity className="text-[var(--color-gold)]" /> Engine Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="bg-[#0f0f0f] border-white/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs uppercase tracking-wider text-gray-500">Movies Rated</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-white">197</p>
                  <p className="text-xs text-green-400 mt-1">+12 this month</p>
                </CardContent>
              </Card>
              <Card className="bg-[#0f0f0f] border-white/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs uppercase tracking-wider text-gray-500">Avg Rating Given</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-white flex items-baseline gap-1">3.8 <Star className="h-4 w-4 text-[var(--color-gold)] fill-[var(--color-gold)]" /></p>
                  <p className="text-xs text-gray-400 mt-1">Slightly critical</p>
                </CardContent>
              </Card>
              <Card className="bg-[#0f0f0f] border-white/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs uppercase tracking-wider text-gray-500">Discovery Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-[var(--color-gold)]">High</p>
                  <p className="text-xs text-gray-400 mt-1">Explores hidden gems</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Clock className="text-[var(--color-gold)]" /> Recent Ratings</h2>
            <div className="space-y-4">
              {recentRatings.map((activity, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="bg-[#0f0f0f] border-white/5 hover:border-white/20 transition-all">
                    <CardContent className="p-4 flex flex-col md:flex-row items-center gap-6">
                      <div className="h-24 w-16 shrink-0 rounded-md overflow-hidden shadow-lg border border-white/10">
                        <LazyImage src={activity.movie.posterUrl} alt={activity.movie.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="font-bold text-xl mb-1 hover:text-[var(--color-gold)] cursor-pointer">{activity.movie.title}</h3>
                        <div className="text-sm text-gray-400 mb-2">
                          {activity.movie.year} • {activity.movie.director}
                        </div>
                        <div className="text-xs text-gray-500">
                          {activity.date}
                        </div>
                      </div>
                      <div className="shrink-0 flex flex-col items-center gap-2 bg-black/40 px-6 py-4 rounded-xl border border-white/5">
                        <span className="text-xs uppercase tracking-wider font-bold text-gray-400">You Rated</span>
                        <div className="flex items-center gap-1 text-[var(--color-gold)]">
                          {activity.rating} <Star className="h-5 w-5 fill-current" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button variant="outline" className="border-white/10 hover:bg-white/5">View All Ratings</Button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}
