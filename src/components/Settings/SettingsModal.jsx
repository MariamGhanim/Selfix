import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
  Mail,
  Plus,
  Settings2,
  Trash2,
  X,
} from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useJournal } from '../../context/JournalContext'
import { resolveManagedTrackers } from '../../data/trackers'
import {
  CUSTOM_TRACKER_TYPES,
  GRID_LEVEL_PRESETS,
  LEVEL_COLOR_SWATCHES,
  TRACKER_COLOR_OPTIONS,
  TRACKER_ICON_OPTIONS,
  clonePresetLevels,
  nextLevelColor,
} from '../../data/trackerIcons'
import { AuthAlert, AuthButton, AuthInput } from '../Auth/AuthShell'

const MAX_CUSTOM_LEVELS = 8
const MIN_CUSTOM_LEVELS = 2

function IconPreview({ name, size = 14 }) {
  const Icon = LucideIcons[name] || LucideIcons.Sparkles
  return <Icon size={size} />
}

function LevelColorPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {LEVEL_COLOR_SWATCHES.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={`h-5 w-5 rounded-full transition ${
            value?.toLowerCase() === color.toLowerCase()
              ? 'ring-2 ring-[var(--ink)] ring-offset-1'
              : 'hover:scale-110'
          }`}
          style={{ background: color }}
          aria-label={`Color ${color}`}
        />
      ))}
      <label
        className="relative ml-0.5 flex h-5 w-5 cursor-pointer overflow-hidden rounded-full ring-1 ring-[var(--page-edge)]"
        title="Custom color"
      >
        <span
          className="pointer-events-none absolute inset-0"
          style={{ background: value || '#cccccc' }}
        />
        <input
          type="color"
          value={HEX_OR_FALLBACK(value)}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-label="Pick custom color"
        />
      </label>
    </div>
  )
}

function HEX_OR_FALLBACK(value) {
  const v = String(value || '').trim()
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v
  if (/^#[0-9a-fA-F]{3}$/.test(v)) {
    return `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`
  }
  return '#64b5f6'
}

export default function SettingsModal({ open, onClose }) {
  const { user, changePassword, logOut, isGuest, exitGuestMode } = useAuth()
  const {
    trackerPrefs,
    setTrackerHidden,
    moveTracker,
    addCustomTracker,
    removeCustomTracker,
    resetTrackerPrefs,
  } = useJournal()

  const [tab, setTab] = useState('pages')
  const [currentPassword, setCurrentPassword] = useState('')
  const [nextPassword, setNextPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('Sparkles')
  const [newColor, setNewColor] = useState(TRACKER_COLOR_OPTIONS[0])
  const [newType, setNewType] = useState('grid')
  const [levelPreset, setLevelPreset] = useState('custom')
  const [levelsDraft, setLevelsDraft] = useState(() => clonePresetLevels('custom'))
  const [createError, setCreateError] = useState('')

  const managed = useMemo(() => resolveManagedTrackers(trackerPrefs), [trackerPrefs])

  const resetCreateForm = () => {
    setNewName('')
    setNewIcon('Sparkles')
    setNewColor(TRACKER_COLOR_OPTIONS[0])
    setNewType('grid')
    setLevelPreset('custom')
    setLevelsDraft(clonePresetLevels('custom'))
    setCreateError('')
  }

  useEffect(() => {
    if (!open) return
    setCurrentPassword('')
    setNextPassword('')
    setConfirm('')
    setError('')
    setSuccess('')
    setTab('pages')
    resetCreateForm()
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

  const applyLevelPreset = (presetId) => {
    setLevelPreset(presetId)
    setLevelsDraft(clonePresetLevels(presetId))
  }

  const updateLevel = (index, patch) => {
    setLevelPreset('custom')
    setLevelsDraft((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)))
  }

  const addLevel = () => {
    setLevelsDraft((prev) => {
      if (prev.length >= MAX_CUSTOM_LEVELS) return prev
      const nextValue = Math.max(0, ...prev.map((l) => Number(l.value) || 0)) + 1
      return [
        ...prev,
        {
          value: nextValue,
          label: `Level ${prev.length + 1}`,
          color: nextLevelColor(prev.map((l) => l.color)),
        },
      ]
    })
    setLevelPreset('custom')
  }

  const removeLevel = (index) => {
    setLevelsDraft((prev) => {
      if (prev.length <= MIN_CUSTOM_LEVELS) return prev
      return prev.filter((_, i) => i !== index)
    })
    setLevelPreset('custom')
  }

  const createPage = (e) => {
    e.preventDefault()
    setCreateError('')
    if (!String(newName || '').trim()) {
      setCreateError('Give your page a soft name first.')
      return
    }
    if (newType === 'grid') {
      const blank = levelsDraft.some((l) => !String(l.label || '').trim())
      if (blank) {
        setCreateError('Give every rating level a label.')
        return
      }
      if (levelsDraft.length < MIN_CUSTOM_LEVELS) {
        setCreateError('Add at least two rating levels for the grid.')
        return
      }
    }
    const created = addCustomTracker({
      title: newName,
      icon: newIcon,
      tabColor: newColor,
      panel: newType,
      levels: newType === 'grid' ? levelsDraft : undefined,
    })
    if (!created) {
      setCreateError('Could not create that page. Try again.')
      return
    }
    resetCreateForm()
  }

  return createPortal(
    <div
      data-selfix-portal="1"
      className="fixed inset-0 z-[80] flex items-end justify-center px-0 py-0 sm:items-center sm:px-4 sm:py-6 pt-[max(0px,env(safe-area-inset-top))] pb-0 sm:pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      <button
        type="button"
        aria-label="Close settings backdrop"
        className="absolute inset-0 bg-[#5c3d4a]/35 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
        className="settings-sheet book-shadow paper-texture relative z-10 flex max-h-[min(92dvh,calc(100dvh-env(safe-area-inset-top)-0.5rem))] w-full max-w-full flex-col overflow-hidden rounded-t-[1.75rem] border border-b-0 border-[var(--page-edge)] sm:max-h-[min(88vh,calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-1.5rem))] sm:max-w-lg sm:rounded-[28px] sm:border"
      >
        <div className="flex shrink-0 flex-col items-stretch border-b border-[var(--page-edge)]/70 px-4 pt-2.5 pb-3 sm:px-5 sm:pt-4 sm:pb-4">
          <div className="mx-auto mb-2 h-1.5 w-11 rounded-full bg-[var(--page-edge)] sm:hidden" aria-hidden />
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-display text-lg font-semibold text-[var(--ink)]">Settings</p>
              <p className="text-[11px] text-[var(--ink-soft)]">
                Customize pages & keep your Selfix Life cozy
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--ink-soft)] hover:bg-[var(--accent-glow)]"
              aria-label="Close settings"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex shrink-0 gap-1 border-b border-[var(--page-edge)]/50 px-4 pt-3">
          {[
            { id: 'pages', label: 'Pages', icon: Settings2 },
            { id: 'account', label: 'Account', icon: Mail },
          ].map((item) => {
            const active = tab === item.id
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-t-2xl px-3 py-2.5 text-sm font-semibold transition sm:min-h-0 sm:py-2 sm:text-[12px] ${
                  active
                    ? 'bg-[var(--accent-glow)] text-[var(--accent-deep)]'
                    : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                <Icon size={13} />
                {item.label}
              </button>
            )
          })}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-5 sm:pb-4">
          <AnimatePresence mode="wait">
            {tab === 'pages' ? (
              <motion.div
                key="pages"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="space-y-5"
              >
                <section>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="font-display text-sm font-semibold text-[var(--ink)]">
                      Manage trackers
                    </p>
                    <button
                      type="button"
                      onClick={resetTrackerPrefs}
                      className="text-[10px] font-semibold text-[var(--ink-soft)] underline-offset-2 hover:text-[var(--accent-deep)] hover:underline"
                    >
                      Reset order
                    </button>
                  </div>
                  <p className="mb-3 text-[11px] text-[var(--ink-soft)]">
                    Show, hide, or reorder pages in your top tab bar.
                  </p>
                  <ul className="space-y-1.5">
                    {managed.map((tracker) => (
                      <li
                        key={tracker.id}
                        className="flex items-center gap-2 rounded-2xl bg-[var(--surface)] px-2.5 py-2 shadow-sm ring-1 ring-[var(--page-edge)]/45"
                      >
                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                          style={{ background: tracker.tabColor }}
                        >
                          <IconPreview name={tracker.icon} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12px] font-semibold text-[var(--ink)]">
                            {tracker.title}
                          </p>
                          <p className="truncate text-[10px] text-[var(--ink-soft)]">
                            {tracker.isCustom ? 'Custom page' : tracker.tab}
                          </p>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            aria-label={`Move ${tracker.title} up`}
                            onClick={() => moveTracker(tracker.id, -1)}
                            className="rounded-full p-1 text-[var(--ink-soft)] hover:bg-[var(--accent-glow)] hover:text-[var(--ink)]"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Move ${tracker.title} down`}
                            onClick={() => moveTracker(tracker.id, 1)}
                            className="rounded-full p-1 text-[var(--ink-soft)] hover:bg-[var(--accent-glow)] hover:text-[var(--ink)]"
                          >
                            <ChevronDown size={14} />
                          </button>
                          <button
                            type="button"
                            aria-label={tracker.enabled ? 'Hide page' : 'Show page'}
                            onClick={() => setTrackerHidden(tracker.id, tracker.enabled)}
                            className={`rounded-full p-1.5 ${
                              tracker.enabled
                                ? 'text-[var(--accent-deep)]'
                                : 'text-[var(--ink-soft)] opacity-70'
                            }`}
                          >
                            {tracker.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                          {tracker.isCustom && (
                            <button
                              type="button"
                              aria-label={`Delete ${tracker.title}`}
                              onClick={() => removeCustomTracker(tracker.id)}
                              className="rounded-full p-1.5 text-[var(--ink-soft)] hover:text-[#c04068]"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="quote-banner rounded-[1.35rem] px-3.5 py-3.5 ring-1 ring-[var(--accent-soft)]/50">
                  <p className="mb-1 font-display text-sm font-semibold text-[var(--ink)]">
                    Add a custom page
                  </p>
                  <p className="mb-3 text-[11px] text-[var(--ink-soft)]">
                    Create a new tracker that appears instantly in your journal tabs.
                  </p>
                  <form onSubmit={createPage} className="space-y-3">
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[var(--ink-soft)]">
                        Page name
                      </label>
                      <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="e.g. Skincare, Skateboarding…"
                        className="min-h-11 w-full rounded-2xl border-0 bg-[var(--surface)] px-3 py-3 text-base outline-none ring-1 ring-[var(--page-edge)]/60 focus:ring-2 focus:ring-[var(--accent)]/35"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-[var(--ink-soft)]">
                        Icon
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {TRACKER_ICON_OPTIONS.map((icon) => (
                          <button
                            key={icon}
                            type="button"
                            onClick={() => setNewIcon(icon)}
                            className={`flex h-11 w-11 items-center justify-center rounded-full transition sm:h-8 sm:w-8 ${
                              newIcon === icon
                                ? 'bg-[var(--accent-deep)] text-white shadow-sm'
                                : 'bg-[var(--surface)] text-[var(--ink-soft)] ring-1 ring-[var(--page-edge)]/50'
                            }`}
                            aria-label={icon}
                          >
                            <IconPreview name={icon} size={14} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-[var(--ink-soft)]">
                        Accent color
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {TRACKER_COLOR_OPTIONS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setNewColor(color)}
                            className={`h-7 w-7 rounded-full transition ${
                              newColor === color ? 'ring-2 ring-[var(--ink)] ring-offset-2' : ''
                            }`}
                            style={{ background: color }}
                            aria-label={color}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-[var(--ink-soft)]">
                        Tracker type
                      </label>
                      <div className="space-y-1.5">
                        {CUSTOM_TRACKER_TYPES.map((type) => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setNewType(type.id)}
                            className={`flex w-full flex-col rounded-2xl px-3 py-2 text-left transition ${
                              newType === type.id
                                ? 'bg-[var(--accent-deep)] text-white shadow-sm'
                                : 'bg-[var(--surface)] text-[var(--ink)] ring-1 ring-[var(--page-edge)]/55'
                            }`}
                          >
                            <span className="text-[12px] font-semibold">{type.label}</span>
                            <span
                              className={`text-[10px] ${
                                newType === type.id ? 'text-white/80' : 'text-[var(--ink-soft)]'
                              }`}
                            >
                              {type.hint}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {newType === 'grid' && (
                      <div className="space-y-2.5 rounded-2xl bg-[var(--surface)] px-3 py-3 ring-1 ring-[var(--page-edge)]/55">
                        <div>
                          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-[var(--ink-soft)]">
                            Level preset
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {GRID_LEVEL_PRESETS.map((preset) => (
                              <button
                                key={preset.id}
                                type="button"
                                onClick={() => applyLevelPreset(preset.id)}
                                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                                  levelPreset === preset.id
                                    ? 'bg-[var(--accent-deep)] text-white shadow-sm'
                                    : 'bg-[var(--paper)] text-[var(--ink-soft)] ring-1 ring-[var(--page-edge)]/60 hover:text-[var(--ink)]'
                                }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="mb-1.5 flex items-center justify-between gap-2">
                            <label className="text-[10px] font-bold uppercase tracking-wide text-[var(--ink-soft)]">
                              Rating levels
                            </label>
                            <span className="text-[10px] text-[var(--ink-soft)]">
                              {levelsDraft.length}/{MAX_CUSTOM_LEVELS}
                            </span>
                          </div>
                          <p className="mb-2 text-[10px] leading-snug text-[var(--ink-soft)]">
                            Name each state and pick a distinct color for the year grid.
                          </p>
                          <ul className="space-y-2">
                            {levelsDraft.map((level, index) => (
                              <li
                                key={`${level.value}-${index}`}
                                className="rounded-2xl bg-[var(--paper)] px-2.5 py-2 ring-1 ring-[var(--page-edge)]/45"
                              >
                                <div className="mb-1.5 flex items-center gap-2">
                                  <span
                                    className="h-3.5 w-3.5 shrink-0 rounded-full shadow-sm ring-1 ring-black/5"
                                    style={{ background: level.color }}
                                    aria-hidden
                                  />
                                  <input
                                    value={level.label}
                                    onChange={(e) => updateLevel(index, { label: e.target.value })}
                                    placeholder={`Level ${index + 1} label`}
                                    className="min-h-11 min-w-0 flex-1 rounded-xl border-0 bg-[var(--surface)] px-2.5 py-2.5 text-base font-semibold text-[var(--ink)] outline-none ring-1 ring-[var(--page-edge)]/50 focus:ring-2 focus:ring-[var(--accent)]/35 sm:min-h-0 sm:py-1.5 sm:text-[12px]"
                                  />
                                  <button
                                    type="button"
                                    aria-label={`Remove level ${index + 1}`}
                                    disabled={levelsDraft.length <= MIN_CUSTOM_LEVELS}
                                    onClick={() => removeLevel(index)}
                                    className="rounded-full p-1.5 text-[var(--ink-soft)] transition enabled:hover:text-[#c04068] disabled:cursor-not-allowed disabled:opacity-35"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                                <LevelColorPicker
                                  value={level.color}
                                  onChange={(color) => updateLevel(index, { color })}
                                />
                              </li>
                            ))}
                          </ul>
                          <button
                            type="button"
                            onClick={addLevel}
                            disabled={levelsDraft.length >= MAX_CUSTOM_LEVELS}
                            className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold text-[var(--accent-deep)] ring-1 ring-[var(--accent-soft)]/70 transition enabled:hover:bg-[var(--accent-glow)] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Plus size={13} />
                            Add level
                          </button>
                        </div>
                      </div>
                    )}

                    {createError && <AuthAlert>{createError}</AuthAlert>}

                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[var(--accent-deep)] px-4 py-2.5 text-sm font-semibold text-white shadow-md"
                    >
                      <Plus size={15} />
                      Create page
                    </button>
                  </form>
                </section>
              </motion.div>
            ) : (
              <motion.div
                key="account"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
              >
                {isGuest ? (
                  <>
                    <div className="mb-4 rounded-2xl bg-[var(--accent-glow)]/60 px-3.5 py-3 ring-1 ring-[var(--page-edge)]/45">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--accent-deep)]">
                        Guest mode
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--ink)]">
                        You are exploring Selfix Life without an account. Entries stay in this
                        browser for now. Sign in to save your journal to the cloud and sync across
                        devices.
                      </p>
                    </div>
                    <AuthButton
                      type="button"
                      onClick={() => {
                        exitGuestMode()
                        onClose()
                      }}
                    >
                      Sign In to Save
                    </AuthButton>
                    <div className="my-4 h-px bg-[var(--page-edge)]/80" />
                    <AuthButton
                      variant="secondary"
                      loading={loggingOut}
                      onClick={handleLogout}
                      className="gap-2"
                    >
                      <LogOut size={14} />
                      Exit guest mode
                    </AuthButton>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>,
    document.body,
  )
}
