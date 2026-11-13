import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { KeyRound, LogOut, Mail, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { AuthAlert, AuthButton, AuthInput } from '../Auth/AuthShell'

export default function SettingsModal({ open, onClose }) {
  const { user, changePassword, logOut } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [nextPassword, setNextPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    if (!open) return
    setCurrentPassword('')
    setNextPassword('')
    setConfirm('')
    setError('')
    setSuccess('')
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const submitPassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await changePassword(currentPassword, nextPassword, confirm)
      setSuccess('Password updated successfully.')
      setCurrentPassword('')
      setNextPassword('')
      setConfirm('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logOut()
      onClose()
    } catch (err) {
      setError(err.message)
      setLoggingOut(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="Close settings backdrop"
        className="absolute inset-0 bg-[#5c3d4a]/35 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Account settings"
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="book-shadow paper-texture relative z-10 w-full max-w-md overflow-hidden rounded-[28px] border border-[var(--page-edge)]"
      >
        <div className="flex items-center justify-between border-b border-[var(--page-edge)]/70 px-5 py-4">
          <div>
            <p className="font-display text-lg font-semibold text-[var(--ink)]">Account settings</p>
            <p className="text-[11px] text-[var(--ink-soft)]">Manage your Selfix profile securely</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-[var(--ink-soft)] hover:bg-[var(--accent-glow)]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="mb-4 flex items-start gap-3 rounded-2xl bg-[var(--surface)] px-3.5 py-3">
            <div className="mt-0.5 rounded-full bg-[var(--accent-glow)] p-2 text-[var(--accent-deep)]">
              <Mail size={15} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--ink-soft)]">
                Registered email
              </p>
              <p className="truncate text-sm font-bold text-[var(--ink)]">{user?.email}</p>
              <p className="mt-0.5 text-[11px] text-[var(--ink-soft)]">
                {user?.emailVerified ? 'Email verified' : 'Email not verified yet'}
              </p>
            </div>
          </div>

          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-[var(--ink-soft)]">
            <KeyRound size={12} />
            Change password
          </div>

          {error && <AuthAlert>{error}</AuthAlert>}
          {success && <AuthAlert tone="success">{success}</AuthAlert>}

          <form onSubmit={submitPassword}>
            <AuthInput
              label="Current password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Confirm your current password"
            />
            <AuthInput
              label="New password"
              type="password"
              autoComplete="new-password"
              value={nextPassword}
              onChange={(e) => setNextPassword(e.target.value)}
              placeholder="Min. 8 chars + special character"
            />
            <AuthInput
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter new password"
            />
            <AuthButton type="submit" loading={loading}>
              Update password
            </AuthButton>
          </form>

          <div className="my-4 h-px bg-[var(--page-edge)]/80" />

          <AuthButton
            variant="secondary"
            loading={loggingOut}
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut size={14} />
            Log out
          </AuthButton>
        </div>
      </motion.div>
    </div>,
    document.body,
  )
}
