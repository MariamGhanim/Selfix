import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { JournalProvider, useJournal } from './context/JournalContext'
import AuthPage from './components/Auth/AuthPage'
import VerifyEmailBanner from './components/Auth/VerifyEmailBanner'
import SyncErrorScreen from './components/Auth/SyncErrorScreen'
import Book from './components/Book/Book'
import AmbientMusicPlayer from './components/AmbientMusicPlayer'
import AboutPage from './pages/AboutPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import ContactPage from './pages/ContactPage'

function LoadingScreen({ label = 'Opening Selfix…' }) {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="rounded-full bg-white/85 px-5 py-2.5 text-sm font-bold text-[var(--ink-soft)] shadow-md">
        {label}
      </div>
    </div>
  )
}

function Gate() {
  const { user, loading, emailVerified, configured } = useAuth()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'pinky')
  }, [])

  if (!configured) return <AuthPage />
  if (loading) return <LoadingScreen />
  if (!user) return <AuthPage />
  if (!emailVerified) return <VerifyEmailBanner />

  return (
    <JournalProvider>
      <ThemedApp />
    </JournalProvider>
  )
}

function ThemedApp() {
  const { theme, ready, syncing, syncError, retrySync } = useJournal()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  if (syncError && !ready) {
    return <SyncErrorScreen message={syncError} onRetry={retrySync} busy={syncing} />
  }

  if (!ready || syncing) {
    return <LoadingScreen label="Syncing your journal from Firebase…" />
  }

  return (
    <main className="h-screen w-screen overflow-hidden">
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
        <Routes>
          <Route path="/" element={<Gate />} />
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
