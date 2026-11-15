import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { validatePassword, passwordsMatch } from '../../lib/password'
import AuthShell, {
  AuthAlert,
  AuthButton,
  AuthInput,
  AuthLinkButton,
} from './AuthShell'

const MODES = {
  login: {
    title: 'Welcome back',
    subtitle: 'Sign in to open your journal.',
  },
  signup: {
    title: 'Create your journal',
    subtitle: 'Begin a soft year of habits and notes.',
  },
  forgot: {
    title: 'Reset password',
    subtitle: 'We will email you a secure reset link.',
  },
}

export default function AuthPage() {
  const { signIn, signUp, resetPassword, configured } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  const switchMode = (next) => {
    setMode(next)
    setError('')
    setSuccess('')
    setFieldErrors({})
  }

  const validateForm = () => {
    const next = {}
    if (!email.trim()) next.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Enter a valid email address.'
    }

    if (mode === 'login') {
      if (!password) next.password = 'Password is required.'
    }

    if (mode === 'signup') {
      const pwdErr = validatePassword(password)
      if (pwdErr) next.password = pwdErr
      const matchErr = passwordsMatch(password, confirm)
      if (matchErr) next.confirm = matchErr
    }

    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!configured) {
      setError('Firebase is not configured. Add your VITE_FIREBASE_* keys to .env and restart.')
      return
    }
    if (!validateForm()) return

    setLoading(true)
    try {
      if (mode === 'login') {
        await signIn(email, password)
      } else if (mode === 'signup') {
        await signUp(email, password, confirm)
        setSuccess('Account created. Check your inbox to verify your email.')
      } else {
        await resetPassword(email)
        setSuccess('Password reset email sent. Check your inbox.')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const meta = MODES[mode]

  return (
    <AuthShell
      title={meta.title}
      subtitle={meta.subtitle}
      footer={
        mode === 'login' ? (
          <>
            <p>
              New here?{' '}
              <AuthLinkButton onClick={() => switchMode('signup')}>Create an account</AuthLinkButton>
            </p>
            <p className="mt-2 font-display text-[11px] font-medium tracking-wide text-[var(--ink-soft)]/85">
              Free to use · Your journal stays private.
            </p>
          </>
        ) : mode === 'signup' ? (
          <>
            Already have an account?{' '}
            <AuthLinkButton onClick={() => switchMode('login')}>Sign in</AuthLinkButton>
          </>
        ) : (
          <>
            Remembered it?{' '}
            <AuthLinkButton onClick={() => switchMode('login')}>Back to sign in</AuthLinkButton>
          </>
        )
      }
    >
      {!configured && (
        <AuthAlert>
          Firebase keys missing. Copy `.env.example` to `.env` and paste your project credentials.
        </AuthAlert>
      )}

      <AnimatePresence mode="wait">
        <motion.form
          key={mode}
          onSubmit={submit}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
        >
          {error && <AuthAlert>{error}</AuthAlert>}
          {success && <AuthAlert tone="success">{success}</AuthAlert>}

          <AuthInput
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            error={fieldErrors.email}
          />

          {mode !== 'forgot' && (
            <AuthInput
              label="Password"
              type="password"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 chars + special character"
              error={fieldErrors.password}
            />
          )}

          {mode === 'signup' && (
            <AuthInput
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter your password"
              error={fieldErrors.confirm}
            />
          )}

          {mode === 'login' && (
            <div className="mb-3 text-right text-xs">
              <AuthLinkButton onClick={() => switchMode('forgot')}>Forgot password?</AuthLinkButton>
            </div>
          )}

          <AuthButton type="submit" loading={loading}>
            {mode === 'login' && 'Sign in'}
            {mode === 'signup' && 'Create account'}
            {mode === 'forgot' && 'Send reset link'}
          </AuthButton>

          {(mode === 'login' || mode === 'signup') && (
            <p className="mt-3 text-center text-[10px] leading-relaxed tracking-wide text-[var(--ink-soft)]/80">
              By continuing, you agree to our{' '}
              <Link
                to="/terms"
                className="font-semibold text-[var(--ink-soft)] underline-offset-2 transition hover:text-[var(--accent-deep)] hover:underline"
              >
                Terms
              </Link>
              {' & '}
              <Link
                to="/privacy"
                className="font-semibold text-[var(--ink-soft)] underline-offset-2 transition hover:text-[var(--accent-deep)] hover:underline"
              >
                Privacy
              </Link>
            </p>
          )}

          {mode === 'signup' && (
            <p className="mt-3 text-center text-[11px] leading-relaxed text-[var(--ink-soft)]">
              We will send a verification email after you register. Your journal unlocks once your
              email is verified.
            </p>
          )}
        </motion.form>
      </AnimatePresence>
    </AuthShell>
  )
}
