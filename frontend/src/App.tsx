import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainLayout } from "./components/layout/MainLayout"
import { AuthProvider } from "./context/AuthContext"
import { UserTasteProvider } from "./context/UserTasteContext"

// Lazy loaded page components
const LandingPage = lazy(() => import("./pages/LandingPage").then(m => ({ default: m.LandingPage })))
const LoginPage = lazy(() => import("./pages/auth/LoginPage").then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage").then(m => ({ default: m.RegisterPage })))
const OnboardingPage = lazy(() => import("./pages/OnboardingPage").then(m => ({ default: m.OnboardingPage })))
const DashboardPage = lazy(() => import("./pages/DashboardPage").then(m => ({ default: m.DashboardPage })))
const DiscoverPage = lazy(() => import("./pages/DiscoverPage").then(m => ({ default: m.DiscoverPage })))
const MovieDetailsPage = lazy(() => import("./pages/MovieDetailsPage").then(m => ({ default: m.MovieDetailsPage })))
const RecommendationsPage = lazy(() => import("./pages/RecommendationsPage").then(m => ({ default: m.RecommendationsPage })))
const WatchlistPage = lazy(() => import("./pages/WatchlistPage").then(m => ({ default: m.WatchlistPage })))
const ProfilePage = lazy(() => import("./pages/ProfilePage").then(m => ({ default: m.ProfilePage })))
const TasteDnaPage = lazy(() => import("./pages/TasteDnaPage").then(m => ({ default: m.TasteDnaPage })))
const AiResultsPage = lazy(() => import("./pages/AiResultsPage").then(m => ({ default: m.AiResultsPage })))
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })))

// Premium Page-wide Skeleton Fallback
function PageSkeleton() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#050505] text-white flex flex-col p-8 space-y-8 animate-pulse">
      <div className="h-10 w-1/4 bg-white/5 rounded-xl" />
      <div className="h-60 w-full bg-white/5 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-48 bg-white/5 rounded-2xl" />
        <div className="h-48 bg-white/5 rounded-2xl" />
        <div className="h-48 bg-white/5 rounded-2xl" />
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <UserTasteProvider>
        <BrowserRouter>
          <Suspense fallback={<PageSkeleton />}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/discover" element={<DiscoverPage />} />
                <Route path="/ai-results" element={<AiResultsPage />} />
                <Route path="/movie/:id" element={<MovieDetailsPage />} />
                <Route path="/recommendations" element={<RecommendationsPage />} />
                <Route path="/rate-queue" element={<WatchlistPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/taste-dna" element={<TasteDnaPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </UserTasteProvider>
    </AuthProvider>
  )
}

export default App

