import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainLayout } from "./components/layout/MainLayout"
import { UserTasteProvider } from "./context/UserTasteContext"

// Lazy loaded page components
const TrendingPage = lazy(() => import("./pages/TrendingPage").then(m => ({ default: m.TrendingPage })))
const DiscoverPage = lazy(() => import("./pages/DiscoverPage").then(m => ({ default: m.DiscoverPage })))
const MovieDetailsPage = lazy(() => import("./pages/MovieDetailsPage").then(m => ({ default: m.MovieDetailsPage })))
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
    <UserTasteProvider>
      <BrowserRouter>
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<DiscoverPage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/trending" element={<TrendingPage />} />
              <Route path="/ai-results" element={<AiResultsPage />} />
              <Route path="/movie/:id" element={<MovieDetailsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </UserTasteProvider>
  )
}

export default App

