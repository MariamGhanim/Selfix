import { CloudOff, RefreshCw } from 'lucide-react'

export default function SyncErrorScreen({ message, onRetry, busy }) {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center overflow-auto px-4 py-6">
      <div className="book-shadow paper-texture w-full max-w-full rounded-[1.5rem] border border-[var(--page-edge)] px-4 py-6 text-center sm:max-w-lg sm:rounded-[28px] sm:px-8 sm:py-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-glow)] text-[var(--accent-deep)]">
          <CloudOff size={28} />
        </div>
        <p className="font-display text-2xl font-semibold text-[var(--accent-deep)]">Selfix Life</p>
        <h1 className="mt-2 font-display text-xl font-semibold text-[var(--ink)]">
          Cloud sync needed
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
          Your journal opens from Firebase only. Finish Firestore setup, then retry.
        </p>

        {message && (
          <p className="mt-3 rounded-2xl bg-[#fde8ee] px-3 py-2 text-left text-xs font-semibold text-[#b8385c]">
            {message}
          </p>
        )}

        <ol className="mt-4 space-y-1.5 rounded-2xl bg-[var(--surface)] px-4 py-3 text-left text-[11px] leading-relaxed text-[var(--ink)]">
          <li>
            1. Open Firebase Console → project <strong>selfix-1211</strong>
          </li>
          <li>2. Go to <strong>Build → Firestore Database → Create database</strong></li>
          <li>3. Start in production mode, then publish the rules from <code>firestore.rules</code></li>
          <li>4. Come back here and tap Retry</li>
        </ol>

        <button
          type="button"
          disabled={busy}
          onClick={onRetry}
          className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-2xl bg-[var(--accent-deep)] px-4 py-2.5 text-sm font-bold text-white shadow-md disabled:opacity-60"
        >
          <RefreshCw size={14} />
          {busy ? 'Connecting…' : 'Retry Firebase sync'}
        </button>
      </div>
    </div>
  )
}
