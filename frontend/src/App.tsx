import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainLayout } from "./components/layout/MainLayout"
import { LandingPage } from "./pages/LandingPage"
import { LoginPage } from "./pages/auth/LoginPage"
import { RegisterPage } from "./pages/auth/RegisterPage"
import { OnboardingPage } from "./pages/OnboardingPage"
import { DashboardPage } from "./pages/DashboardPage"
import { DiscoverPage } from "./pages/DiscoverPage"
import { MovieDetailsPage } from "./pages/MovieDetailsPage"
import { RecommendationsPage } from "./pages/RecommendationsPage"
import { WatchlistPage } from "./pages/WatchlistPage"
import { ProfilePage } from "./pages/ProfilePage"
import { TasteDnaPage } from "./pages/TasteDnaPage"
import { NotFoundPage } from "./pages/NotFoundPage"
import { AuthProvider } from "./context/AuthContext"
import { UserTasteProvider } from "./context/UserTasteContext"

function App() {
  return (
    <AuthProvider>
      <UserTasteProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/movie/:id" element={<MovieDetailsPage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/rate-queue" element={<WatchlistPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/taste-dna" element={<TasteDnaPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserTasteProvider>
    </AuthProvider>
  )
}

export default App
