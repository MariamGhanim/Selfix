import { useState } from 'react'
import { MailWarning, RefreshCw } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function VerifyEmailBanner() {
  const { user, resendVerification, refreshUser, logOut } = useAuth()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const resend = async () => {
    setBusy(true)
    setError('')
    setMessage('')
    try {
      await resendVerification()
      setMessage('Verification email sent. Check your inbox and spam folder.')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const check = async () => {
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const next = await refreshUser()
      if (next?.emailVerified) setMessage('Email verified — unlocking your journal…')
      else setError('Still waiting for verification. Open the link in your email, then try again.')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center overflow-auto px-4 py-6">
      <div className="book-shadow paper-texture w-full max-w-lg rounded-[28px] border border-[var(--page-edge)] px-6 py-8 text-center sm:px-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-glow)] text-[var(--accent-deep)]">
          <MailWarning size={28} />
        </div>
        <p className="font-display text-2xl font-semibold text-[var(--accent-deep)]">Selfix Life</p>
        <h1 className="mt-2 font-display text-xl font-semibold text-[var(--ink)]">
          Verify your email
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
          We sent a verification link to{' '}
          <span className="font-bold text-[var(--ink)]">{user?.email}</span>. Confirm your email
          to unlock your journal.
        </p>

        {message && (
          <p className="mt-3 rounded-2xl bg-[#e8f5e9] px-3 py-2 text-xs font-semibold text-[#2e7d4f]">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-3 rounded-2xl bg-[#fde8ee] px-3 py-2 text-xs font-semibold text-[#b8385c]">
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            disabled={busy}
            onClick={resend}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-[var(--page-edge)] bg-[var(--surface)] px-4 py-2.5 text-sm font-bold text-[var(--ink)] disabled:opacity-60"
          >
            <RefreshCw size={14} />
            Resend verification email
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={check}
            className="inline-flex flex-1 items-center justify-center rounded-2xl bg-[var(--accent-deep)] px-4 py-2.5 text-sm font-bold text-white shadow-md disabled:opacity-60"
          >
            I verified — refresh
          </button>
        </div>

        <button
          type="button"
          onClick={() => logOut()}
          className="mt-4 text-xs font-bold text-[var(--ink-soft)] underline-offset-2 hover:underline"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
