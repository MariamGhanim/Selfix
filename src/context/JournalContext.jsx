import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { PANEL_DEFAULTS } from '../data/panelOptions'
import { cellKey } from '../data/trackers'
import { useAuth } from './AuthContext'
import { loadJournalFromCloud, saveJournalToCloud } from '../lib/journalCloud'

const JournalContext = createContext(null)

const DEFAULT_PROFILE = {
  displayName: 'Selfix',
  year: new Date().getFullYear(),
}

const defaultState = {
  theme: 'pinky',
  profile: DEFAULT_PROFILE,
  pixels: {},
  dailyNotes: {},
  todos: {},
  panels: {},
  selectedLevel: {},
}

function panelKey(trackerId, year, month, day) {
  return `${trackerId}:${cellKey(year, month, day)}`
}

function normalizeState(raw) {
  return {
    ...defaultState,
    ...raw,
    profile: { ...DEFAULT_PROFILE, ...(raw?.profile || {}) },
    pixels: raw?.pixels || {},
    dailyNotes: raw?.dailyNotes || {},
    todos: raw?.todos || {},
    panels: raw?.panels || {},
    selectedLevel: raw?.selectedLevel || {},
  }
}

export function JournalProvider({ children }) {
  const { user, emailVerified } = useAuth()
  const uid = user?.uid || null
  const [state, setState] = useState(defaultState)
  const [ready, setReady] = useState(false)
  const [syncError, setSyncError] = useState('')
  const [syncing, setSyncing] = useState(false)
  const [retryTick, setRetryTick] = useState(0)
  const skipNextSave = useRef(true)
  const saveTimer = useRef(null)

  const retrySync = useCallback(() => {
    setRetryTick((n) => n + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function hydrate() {
      setReady(false)
      setSyncError('')
      setSyncing(true)
      skipNextSave.current = true

      if (!uid || !emailVerified) {
        setState(defaultState)
        setReady(false)
        setSyncing(false)
        return
      }

      try {
        const cloud = await loadJournalFromCloud(uid, defaultState)
        if (cancelled) return
        setState(normalizeState(cloud))
        skipNextSave.current = true
        setReady(true)
        setSyncError('')
      } catch (err) {
        if (cancelled) return
        setReady(false)
        setSyncError(err.message || 'Could not load journal from Firebase.')
      } finally {
        if (!cancelled) setSyncing(false)
      }
    }

    hydrate()
    return () => {
      cancelled = true
    }
  }, [uid, emailVerified, retryTick])

  useEffect(() => {
    if (!uid || !emailVerified || !ready) return undefined
    if (skipNextSave.current) {
      skipNextSave.current = false
      return undefined
    }

    if (saveTimer.current) window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(async () => {
      try {
        await saveJournalToCloud(uid, state)
        setSyncError('')
      } catch (err) {
        setSyncError(err.message || 'Could not save to Firebase.')
      }
    }, 500)

    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
    }
  }, [state, uid, emailVerified, ready])

  const api = useMemo(() => {
    const year = state.profile?.year ?? new Date().getFullYear()
    const profile = {
      ...DEFAULT_PROFILE,
      ...state.profile,
    }

    const setTheme = (theme) => setState((s) => ({ ...s, theme }))

    const setProfile = (patch) =>
      setState((s) => ({ ...s, profile: { ...s.profile, ...patch } }))

    const setYear = (nextYear) =>
      setState((s) => ({
        ...s,
        profile: { ...s.profile, year: nextYear },
      }))

    const getPixel = (trackerId, month, day) =>
      state.pixels?.[`${trackerId}:${cellKey(year, month, day)}`] ?? null

    const setPixel = (trackerId, month, day, value) => {
      const key = `${trackerId}:${cellKey(year, month, day)}`
      setState((s) => {
        const next = { ...s.pixels }
        if (value == null) delete next[key]
        else next[key] = value
        return { ...s, pixels: next }
      })
    }

    const cyclePixel = (trackerId, month, day, levels) => {
      const current = getPixel(trackerId, month, day)
      const idx = levels.findIndex((l) => l.value === current)
      const next = levels[(idx + 1) % levels.length]
      setPixel(trackerId, month, day, next.value)
    }

    const paintPixel = (trackerId, month, day, levels) => {
      const selected = state.selectedLevel?.[trackerId]
      if (selected != null) {
        const current = getPixel(trackerId, month, day)
        setPixel(trackerId, month, day, current === selected ? null : selected)
        return
      }
      cyclePixel(trackerId, month, day, levels)
    }

    const setSelectedLevel = (trackerId, value) =>
      setState((s) => ({
        ...s,
        selectedLevel: { ...s.selectedLevel, [trackerId]: value },
      }))

    const getDailyNote = (month, day) =>
      state.dailyNotes?.[cellKey(year, month, day)] ?? ''

    const setDailyNote = (month, day, text) => {
      const key = cellKey(year, month, day)
      setState((s) => ({
        ...s,
        dailyNotes: { ...s.dailyNotes, [key]: text },
      }))
    }

    const getTodos = (month, day) =>
      state.todos?.[cellKey(year, month, day)] ?? []

    const setTodos = (month, day, list, pixelValue) => {
      const key = cellKey(year, month, day)
      const pixelKey = `tasks:${key}`
      setState((s) => {
        const next = {
          ...s,
          todos: { ...s.todos, [key]: list },
        }
        if (pixelValue !== undefined) {
          const nextPixels = { ...s.pixels }
          if (pixelValue == null) delete nextPixels[pixelKey]
          else nextPixels[pixelKey] = pixelValue
          next.pixels = nextPixels
        }
        return next
      })
    }

    const getPanel = (trackerId, month, day) => {
      const defaults = PANEL_DEFAULTS[trackerId] || {}
      const raw = state.panels?.[panelKey(trackerId, year, month, day)] || {}
      return { ...defaults, ...raw }
    }

    const setPanel = (trackerId, month, day, patch, pixelValue) => {
      const key = panelKey(trackerId, year, month, day)
      const pixelKey = `${trackerId}:${cellKey(year, month, day)}`
      setState((s) => {
        const prev = { ...(PANEL_DEFAULTS[trackerId] || {}), ...(s.panels?.[key] || {}) }
        const next = {
          ...s,
          panels: {
            ...s.panels,
            [key]: { ...prev, ...patch },
          },
        }
        if (pixelValue !== undefined) {
          const nextPixels = { ...s.pixels }
          if (pixelValue == null) delete nextPixels[pixelKey]
          else nextPixels[pixelKey] = pixelValue
          next.pixels = nextPixels
        }
        return next
      })
    }

    const resetPanel = (trackerId, month, day) => {
      const key = panelKey(trackerId, year, month, day)
      const fresh = structuredClone
        ? structuredClone(PANEL_DEFAULTS[trackerId] || {})
        : JSON.parse(JSON.stringify(PANEL_DEFAULTS[trackerId] || {}))
      setState((s) => {
        const nextPanels = { ...s.panels, [key]: fresh }
        const pixelKey = `${trackerId}:${cellKey(year, month, day)}`
        const nextPixels = { ...s.pixels }
        delete nextPixels[pixelKey]
        return { ...s, panels: nextPanels, pixels: nextPixels }
      })
    }

    return {
      state,
      ready,
      syncing,
      syncError,
      retrySync,
      year,
      theme: state.theme || 'pinky',
      profile,
      setTheme,
      setProfile,
      setYear,
      getPixel,
      setPixel,
      paintPixel,
      setSelectedLevel,
      getDailyNote,
      setDailyNote,
      getTodos,
      setTodos,
      getPanel,
      setPanel,
      resetPanel,
    }
  }, [state, ready, syncing, syncError, retrySync])

  return <JournalContext.Provider value={api}>{children}</JournalContext.Provider>
}

export function useJournal() {
  const ctx = useContext(JournalContext)
  if (!ctx) throw new Error('useJournal must be used within JournalProvider')
  return ctx
}
