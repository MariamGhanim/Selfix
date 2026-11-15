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
import {
  cellKey,
  defaultTrackerPrefs,
  normalizeTrackerPrefs,
  resolveActiveTrackers,
} from '../data/trackers'
import {
  DEFAULT_CUSTOM_CHECKLIST_LEVELS,
  DEFAULT_CUSTOM_GRID_LEVELS,
  DEFAULT_CUSTOM_NOTES_LEVELS,
  normalizeCustomLevels,
} from '../data/trackerIcons'
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
  trackerPrefs: defaultTrackerPrefs(),
}

function panelKey(trackerId, year, month, day) {
  return `${trackerId}:${cellKey(year, month, day)}`
}

function customPanelDefaults(trackerId, prefs) {
  const custom = prefs?.custom?.find((t) => t.id === trackerId)
  if (!custom) return {}
  if (custom.panel === 'checklist') return { items: [] }
  if (custom.panel === 'notes') return { note: '' }
  return { note: '' }
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
    trackerPrefs: normalizeTrackerPrefs(raw?.trackerPrefs),
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
  const stateRef = useRef(state)
  const readyRef = useRef(ready)
  const dirtyRef = useRef(false)

  stateRef.current = state
  readyRef.current = ready

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
      dirtyRef.current = false

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
        dirtyRef.current = false
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

    dirtyRef.current = true
    if (saveTimer.current) window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(async () => {
      try {
        await saveJournalToCloud(uid, stateRef.current)
        dirtyRef.current = false
        setSyncError('')
      } catch (err) {
        setSyncError(err.message || 'Could not save to Firebase.')
      }
    }, 250)

    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
    }
  }, [state, uid, emailVerified, ready])

  useEffect(() => {
    if (!uid || !emailVerified) return undefined

    const flush = () => {
      if (!readyRef.current || !dirtyRef.current) return
      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current)
        saveTimer.current = null
      }
      dirtyRef.current = false
      void saveJournalToCloud(uid, stateRef.current).catch(() => {})
    }

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush()
    }

    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('pagehide', flush)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [uid, emailVerified])

  const api = useMemo(() => {
    const year = state.profile?.year ?? new Date().getFullYear()
    const profile = {
      ...DEFAULT_PROFILE,
      ...state.profile,
    }

    const setTheme = (theme) =>
      setState((s) => ({
        ...s,
        theme: theme === 'midnight' ? 'midnight' : 'pinky',
      }))

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
      const sequence = [null, ...levels.map((l) => l.value)]
      const idx = sequence.findIndex((v) => v === current)
      const next = sequence[(idx + 1) % sequence.length]
      setPixel(trackerId, month, day, next)
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

    const noteKey = (trackerId, month, day) => `${trackerId}:${cellKey(year, month, day)}`

    const getDailyNote = (trackerId, month, day) => {
      if (!trackerId) return ''
      return state.dailyNotes?.[noteKey(trackerId, month, day)] ?? ''
    }

    const setDailyNote = (trackerId, month, day, text) => {
      if (!trackerId) return
      const key = noteKey(trackerId, month, day)
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
      const defaults =
        PANEL_DEFAULTS[trackerId] || customPanelDefaults(trackerId, state.trackerPrefs)
      const raw = state.panels?.[panelKey(trackerId, year, month, day)] || {}
      return { ...defaults, ...raw }
    }

    const setPanel = (trackerId, month, day, patch, pixelValue) => {
      const key = panelKey(trackerId, year, month, day)
      const pixelKey = `${trackerId}:${cellKey(year, month, day)}`
      setState((s) => {
        const defaults =
          PANEL_DEFAULTS[trackerId] || customPanelDefaults(trackerId, s.trackerPrefs)
        const prev = { ...defaults, ...(s.panels?.[key] || {}) }
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
      setState((s) => {
        const defaults =
          PANEL_DEFAULTS[trackerId] || customPanelDefaults(trackerId, s.trackerPrefs)
        const fresh = structuredClone
          ? structuredClone(defaults)
          : JSON.parse(JSON.stringify(defaults))
        const nextPanels = { ...s.panels, [key]: fresh }
        const pixelKey = `${trackerId}:${cellKey(year, month, day)}`
        const nextPixels = { ...s.pixels }
        delete nextPixels[pixelKey]
        return { ...s, panels: nextPanels, pixels: nextPixels }
      })
    }

    const trackerPrefs = normalizeTrackerPrefs(state.trackerPrefs)
    const activeTrackers = resolveActiveTrackers(trackerPrefs)

    const setTrackerHidden = (trackerId, hidden) =>
      setState((s) => {
        const prefs = normalizeTrackerPrefs(s.trackerPrefs)
        const nextHidden = new Set(prefs.hidden)
        if (hidden) nextHidden.add(trackerId)
        else nextHidden.delete(trackerId)
        const visibleCount = [...prefs.order].filter((id) => !nextHidden.has(id)).length
        if (visibleCount < 1) return s
        return {
          ...s,
          trackerPrefs: { ...prefs, hidden: [...nextHidden] },
        }
      })

    const moveTracker = (trackerId, direction) =>
      setState((s) => {
        const prefs = normalizeTrackerPrefs(s.trackerPrefs)
        const order = [...prefs.order]
        const idx = order.indexOf(trackerId)
        if (idx < 0) return s
        const swapWith = idx + direction
        if (swapWith < 0 || swapWith >= order.length) return s
        ;[order[idx], order[swapWith]] = [order[swapWith], order[idx]]
        return { ...s, trackerPrefs: { ...prefs, order } }
      })

    const addCustomTracker = ({ title, icon, tabColor, panel, levels: rawLevels }) => {
      const cleanTitle = String(title || '').trim()
      if (!cleanTitle) return null
      const id = `custom_${crypto.randomUUID().replace(/-/g, '').slice(0, 10)}`
      const type = panel || 'grid'
      let levels
      if (type === 'checklist') {
        levels = DEFAULT_CUSTOM_CHECKLIST_LEVELS
      } else if (type === 'notes') {
        levels = DEFAULT_CUSTOM_NOTES_LEVELS
      } else {
        levels = normalizeCustomLevels(rawLevels) || DEFAULT_CUSTOM_GRID_LEVELS
      }
      const tracker = {
        id,
        title: cleanTitle,
        tab: cleanTitle.slice(0, 10),
        subtitle: 'Custom page',
        icon: icon || 'Sparkles',
        tabColor: tabColor || '#b8a4e8',
        panel: type,
        custom: true,
        levels,
      }
      setState((s) => {
        const prefs = normalizeTrackerPrefs(s.trackerPrefs)
        return {
          ...s,
          trackerPrefs: {
            ...prefs,
            custom: [...prefs.custom, tracker],
            order: [...prefs.order, id],
          },
        }
      })
      return tracker
    }

    const removeCustomTracker = (trackerId) =>
      setState((s) => {
        const prefs = normalizeTrackerPrefs(s.trackerPrefs)
        if (!prefs.custom.some((t) => t.id === trackerId)) return s
        return {
          ...s,
          trackerPrefs: {
            order: prefs.order.filter((id) => id !== trackerId),
            hidden: prefs.hidden.filter((id) => id !== trackerId),
            custom: prefs.custom.filter((t) => t.id !== trackerId),
          },
        }
      })

    const resetTrackerPrefs = () =>
      setState((s) => ({ ...s, trackerPrefs: defaultTrackerPrefs() }))

    return {
      state,
      ready,
      syncing,
      syncError,
      retrySync,
      year,
      theme: state.theme === 'midnight' ? 'midnight' : 'pinky',
      profile,
      trackerPrefs,
      activeTrackers,
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
      setTrackerHidden,
      moveTracker,
      addCustomTracker,
      removeCustomTracker,
      resetTrackerPrefs,
    }
  }, [state, ready, syncing, syncError, retrySync])

  return <JournalContext.Provider value={api}>{children}</JournalContext.Provider>
}

export function useJournal() {
  const ctx = useContext(JournalContext)
  if (!ctx) throw new Error('useJournal must be used within JournalProvider')
  return ctx
}
