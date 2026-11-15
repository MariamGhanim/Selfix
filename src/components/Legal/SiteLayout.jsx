import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import LegalFooter from './LegalFooter'

export default function SiteLayout({ title, subtitle, children }) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'pinky')
    document.title = `${title} · Selfix Life`
    return () => {
      document.title = 'Selfix Life · Year in Pixels Journal'
    }
  }, [title])

  return (
    <div className="flex min-h-[100dvh] w-full max-w-full flex-col overflow-x-hidden overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
      <header className="mx-auto mb-4 flex w-full max-w-4xl shrink-0 flex-wrap items-center justify-between gap-3">
        <Link
          to="/"
          className="rounded-full bg-[var(--surface)] px-3.5 py-1.5 text-xs font-bold shadow-md backdrop-blur transition hover:bg-[var(--surface-strong)]"
        >
          <span className="font-display text-[var(--accent-deep)]">Selfix Life</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--page-edge)] bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-[var(--ink-soft)] shadow-sm transition hover:bg-[var(--surface-strong)] hover:text-[var(--ink)]"
        >
          <ArrowLeft size={13} />
          Back to Journal
        </Link>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 pb-6">
        <div className="book-shadow paper-texture overflow-hidden rounded-[28px] border border-[var(--page-edge)]">
          <div className="border-b border-[var(--page-edge)]/70 bg-[var(--accent-glow)]/50 px-6 py-6 sm:px-8 sm:py-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent-deep)]">
              Selfix Life
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-[var(--ink)] sm:text-3xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-soft)]">
                {subtitle}
              </p>
            )}
          </div>
          <div className="space-y-8 px-6 py-7 sm:px-8 sm:py-8">{children}</div>
        </div>
      </main>

      <div className="mx-auto w-full max-w-4xl">
        <LegalFooter />
      </div>
    </div>
  )
}

export function Section({ title, children }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-semibold text-[var(--ink)] sm:text-xl">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-[var(--ink)]">{children}</div>
    </section>
  )
}

export function SoftCard({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-[var(--page-edge)] bg-[var(--surface)] px-4 py-4 shadow-sm sm:px-5 ${className}`}
    >
      {children}
    </div>
  )
}
