import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { JournalProvider, useJournal } from './context/JournalContext'
import AuthPage from './components/Auth/AuthPage'
import GuestBanner from './components/Auth/GuestBanner'
import VerifyEmailBanner from './components/Auth/VerifyEmailBanner'
import SyncErrorScreen from './components/Auth/SyncErrorScreen'
import Book from './components/Book/Book'
import AmbientMusicPlayer from './components/AmbientMusicPlayer'
import AboutPage from './pages/AboutPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import ContactPage from './pages/ContactPage'
import BlogIndexPage from './pages/BlogIndexPage'
import BlogPostPage from './pages/BlogPostPage'
import SiteAdSidebars from './components/Ads/SiteAdSidebars'

function LoadingScreen({ label = 'Opening Selfix Life…' }) {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center overflow-auto px-4">
      <div className="rounded-full bg-[var(--surface)] px-5 py-2.5 text-sm font-bold text-[var(--ink-soft)] shadow-md">
        {label}
      </div>
    </div>
  )
}

function Gate() {
  const { user, loading, emailVerified, configured, isGuest } = useAuth()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'pinky')
  }, [])

  if (!configured && !isGuest) return <AuthPage />
  if (loading) return <LoadingScreen />
  if (user && !emailVerified) return <VerifyEmailBanner />
  if (user && emailVerified) {
    return (
      <JournalProvider>
        <ThemedApp />
      </JournalProvider>
    )
  }
  if (isGuest) {
    return (
      <JournalProvider>
        <ThemedApp />
      </JournalProvider>
    )
  }

  return <AuthPage />
}

function ThemedApp() {
  const { theme, ready, syncing, syncError, retrySync, isGuest } = useJournal()

  useEffect(() => {
    const safeTheme = theme === 'midnight' ? 'midnight' : 'pinky'
    document.documentElement.setAttribute('data-theme', safeTheme)
  }, [theme])

  if (syncError && !ready) {
    return <SyncErrorScreen message={syncError} onRetry={retrySync} busy={syncing} />
  }

  if (!ready || syncing) {
    return <LoadingScreen label="Loading…" />
  }

  return (
    <main className="h-[100dvh] min-h-[100dvh] w-full max-w-full min-w-0 overflow-x-hidden overflow-y-auto">
      {isGuest && <GuestBanner />}
      {syncError && (
        <div className="absolute left-1/2 top-2 z-[60] max-w-[90vw] -translate-x-1/2 truncate rounded-full bg-[#fde8ee] px-3 py-1 text-[10px] font-bold text-[#b8385c] shadow">
          Firebase save issue — {syncError}
        </div>
      )}
      <Book />
      <AmbientMusicPlayer />
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Global desktop sidebars — journal, blog, about, etc. */}
        <SiteAdSidebars />
        <Routes>
          <Route path="/" element={<Gate />} />
          <Route path="/blog" element={<BlogIndexPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
