import { cellKey, TRACKERS } from '../data/trackers'
import { overlaySleepQuality } from './sleepQuality'
import { FOCUS_ENVIRONMENTS } from '../data/panelOptions'

export const INSIGHT_RANGES = [
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'yearly', label: 'Yearly' },
  { id: 'custom', label: 'Custom Range' },
]

export const INSIGHT_CATEGORIES = [
  {
    id: 'all',
    label: 'All Trackers',
    emoji: '✨',
  },
  {
    id: 'wellness',
    label: 'Wellness & Sleep',
    emoji: '🌿',
    habits: ['sleep', 'water', 'vitamins', 'teeth', 'shower', 'energy', 'fruits', 'sweets'],
  },
  {
    id: 'spiritual',
    label: 'Spiritual & Salah',
    emoji: '🤲',
    habits: ['salah'],
  },
  {
    id: 'productivity',
    label: 'Productivity & Focus',
    emoji: '🎯',
    habits: ['focus', 'workout', 'reading', 'rating', 'tasks', 'study', 'outings'],
  },
]

const HABIT_TRACKERS = [
  'sleep',
  'salah',
  'water',
  'teeth',
  'shower',
  'vitamins',
  'focus',
  'workout',
  'reading',
  'energy',
  'rating',
]

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function addDays(d, n) {
  const next = new Date(d)
  next.setDate(next.getDate() + n)
  return next
}

function formatShortRange(from, to) {
  return `${from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${to.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
}

function parsePixelKey(key) {
  const colon = key.indexOf(':')
  if (colon < 0) return null
  const trackerId = key.slice(0, colon)
  const parts = key.slice(colon + 1).split('-').map(Number)
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null
  return { trackerId, year: parts[0], month: parts[1], day: parts[2] }
}

function parseNoteKey(key) {
  const parts = String(key).split('-').map(Number)
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null
  return { year: parts[0], month: parts[1], day: parts[2] }
}

function parsePanelKey(key) {
  const colon = key.indexOf(':')
  if (colon < 0) return null
  const trackerId = key.slice(0, colon)
  const date = parseNoteKey(key.slice(colon + 1))
  if (!date) return null
  return { trackerId, ...date }
}

function dateInRange(year, month, day, from, to) {
  const t = new Date(year, month, day).getTime()
  return t >= from.getTime() && t <= to.getTime()
}

function trackerMeta(id) {
  return TRACKERS.find((t) => t.id === id) || { id, title: id, tab: id, tabColor: '#b8a4e8' }
}

function isLogged(value) {
  return value != null
}

function avg(vals) {
  const nums = vals.filter((v) => v != null && Number.isFinite(Number(v))).map(Number)
  if (!nums.length) return null
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10
}

function pct(n, d) {
  if (!d) return 0
  return Math.round((n / d) * 100)
}

function sleepIsGood(value) {
  return value === 3 || value === 4
}

function focusIsDeep(value) {
  return value === 2 || value === 3
}

function salahIsStrong(value) {
  return value === 5 || value === 6
}

function ratingIsGood(value) {
  return value === 4 || value === 5
}

function energyIsHigh(value) {
  return value === 3 || value === 4
}

export function getRangeBounds(rangeId, year, anchor = new Date(), customRange = null) {
  const today = startOfDay(new Date())
  const focus = startOfDay(anchor)
  const yearEnd = new Date(year, 11, 31)
  const yearStart = new Date(year, 0, 1)
  const inYear = focus > yearEnd ? yearEnd : focus < yearStart ? yearStart : focus
  const hardCap = today < yearEnd ? today : yearEnd

  if (rangeId === 'custom' && customRange?.from && customRange?.to) {
    let from = startOfDay(new Date(customRange.from))
    let to = startOfDay(new Date(customRange.to))
    if (to < from) [from, to] = [to, from]
    if (from < yearStart) from = yearStart
    if (to > hardCap) to = hardCap
    if (to < from) to = from
    return { from, to, label: formatShortRange(from, to) }
  }

  if (rangeId === 'yearly') {
    return {
      from: yearStart,
      to: hardCap < yearStart ? yearStart : hardCap,
      label: String(year),
    }
  }

  if (rangeId === 'monthly') {
    const from = new Date(inYear.getFullYear(), inYear.getMonth(), 1)
    const monthEnd = new Date(inYear.getFullYear(), inYear.getMonth() + 1, 0)
    const to = monthEnd > hardCap ? hardCap : monthEnd
    return {
      from: from < yearStart ? yearStart : from,
      to: to < from ? from : to,
      label: from.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    }
  }

  // Full Mon–Sun week — do not clip at today so charts keep all 7 day slots.
  const day = inYear.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const from = addDays(inYear, mondayOffset)
  const to = addDays(from, 6)
  return { from, to, label: formatShortRange(from, to) }
}

function previousBounds(bounds) {
  const spanDays = Math.max(
    1,
    Math.round((startOfDay(bounds.to) - startOfDay(bounds.from)) / 86_400_000) + 1,
  )
  const to = addDays(startOfDay(bounds.from), -1)
  const from = addDays(to, -(spanDays - 1))
  return { from, to, label: formatShortRange(from, to) }
}

export function enumerateDays(from, to) {
  const days = []
  let cursor = startOfDay(from)
  const end = startOfDay(to)
  while (cursor <= end) {
    days.push({
      year: cursor.getFullYear(),
      month: cursor.getMonth(),
      day: cursor.getDate(),
      date: new Date(cursor),
      key: cellKey(cursor.getFullYear(), cursor.getMonth(), cursor.getDate()),
      weekday: cursor.getDay(),
      label: cursor.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
      short: cursor.toLocaleDateString('en-US', { weekday: 'narrow' }),
      chartLabel: cursor.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
    })
    cursor = addDays(cursor, 1)
  }
  return days
}

function indexPixels(pixels, year, from, to) {
  const pixelIndex = {}
  for (const [key, value] of Object.entries(pixels || {})) {
    const parsed = parsePixelKey(key)
    if (!parsed) continue
    if (parsed.year !== year && !(parsed.year === from.getFullYear() || parsed.year === to.getFullYear())) {
      // allow custom ranges that might cross years lightly — still filter by date
    }
    if (!dateInRange(parsed.year, parsed.month, parsed.day, from, to)) continue
    const dk = cellKey(parsed.year, parsed.month, parsed.day)
    if (!pixelIndex[parsed.trackerId]) pixelIndex[parsed.trackerId] = {}
    pixelIndex[parsed.trackerId][dk] = value
  }
  return pixelIndex
}

function indexPanels(panels, from, to) {
  const panelIndex = {}
  for (const [key, value] of Object.entries(panels || {})) {
    const parsed = parsePanelKey(key)
    if (!parsed) continue
    if (!dateInRange(parsed.year, parsed.month, parsed.day, from, to)) continue
    const dk = cellKey(parsed.year, parsed.month, parsed.day)
    if (!panelIndex[parsed.trackerId]) panelIndex[parsed.trackerId] = {}
    panelIndex[parsed.trackerId][dk] = value
  }
  return panelIndex
}

function buildHabitStats(days, pixelIndex, habitIds = HABIT_TRACKERS) {
  return habitIds.map((id) => {
    const meta = trackerMeta(id)
    const series = days.map((d) => {
      const value = pixelIndex[id]?.[d.key]
      return { ...d, value, logged: isLogged(value) }
    })
    const logged = series.filter((s) => s.logged).length
    const rate = pct(logged, days.length)
    let streak = 0
    for (let i = series.length - 1; i >= 0; i -= 1) {
      if (!series[i].logged) break
      streak += 1
    }
    let bestStreak = 0
    let run = 0
    for (const s of series) {
      if (s.logged) {
        run += 1
        bestStreak = Math.max(bestStreak, run)
      } else run = 0
    }
    const values = series.map((s) => s.value).filter((v) => v != null)
    return {
      id,
      title: meta.tab || meta.title,
      color: meta.tabColor || '#b8a4e8',
      logged,
      total: days.length,
      rate,
      streak,
      bestStreak,
      avgValue: avg(values),
      series,
    }
  })
}

function buildWindowSnapshot(state, days, from, to) {
  const pixels = state?.pixels || {}
  const panels = state?.panels || {}
  const notes = state?.dailyNotes || {}
  const todos = state?.todos || {}
  const pixelIndex = indexPixels(pixels, from.getFullYear(), from, to)
  const panelIndex = indexPanels(panels, from, to)
  overlaySleepQuality(pixelIndex, panelIndex)
  const habitStats = buildHabitStats(days, pixelIndex)

  const moodSeries = days.map((d) => ({
    key: d.key,
    label: d.label,
    chartLabel: d.chartLabel,
    date: d.date,
    weekday: d.weekday,
    Mood: pixelIndex.rating?.[d.key] ?? null,
    Energy: pixelIndex.energy?.[d.key] ?? null,
    Sleep: pixelIndex.sleep?.[d.key] ?? null,
    rating: pixelIndex.rating?.[d.key] ?? null,
    energy: pixelIndex.energy?.[d.key] ?? null,
    sleep: pixelIndex.sleep?.[d.key] ?? null,
  }))

  const focusPanels = panelIndex.focus || {}
  let focusMinutes = 0
  const envCounts = {}
  const focusDaily = days.map((d) => {
    const panel = focusPanels[d.key]
    let mins = Number(panel?.minutes) || 0
    if (!mins) {
      const v = pixelIndex.focus?.[d.key]
      if (v === 1) mins = 45
      else if (v === 2) mins = 180
      else if (v === 3) mins = 300
    }
    focusMinutes += mins
    for (const env of panel?.environments || []) {
      envCounts[env] = (envCounts[env] || 0) + 1
    }
    return {
      key: d.key,
      chartLabel: d.chartLabel,
      weekday: d.weekday,
      hours: Math.round((mins / 60) * 10) / 10,
      minutes: mins,
    }
  })

  let tasksDone = 0
  let tasksTotal = 0
  for (const d of days) {
    const list = todos[d.key] || []
    tasksTotal += list.length
    tasksDone += list.filter((t) => t.done || t.completed).length
  }

  const overallRate = habitStats.length
    ? Math.round(habitStats.reduce((sum, h) => sum + h.rate, 0) / habitStats.length)
    : 0
  const bestStreak = Math.max(0, ...habitStats.map((h) => h.bestStreak), 0)
  const activeStreak = Math.max(0, ...habitStats.map((h) => h.streak), 0)

  const salahHabit = habitStats.find((h) => h.id === 'salah')
  const salahScore = salahHabit?.rate ?? 0
  const focusHours = Math.round((focusMinutes / 60) * 10) / 10
  const spiritualFocusIndex = Math.round(salahScore * 0.55 + Math.min(100, focusHours * 8) * 0.45)

  const vibeMood = avg(moodSeries.map((d) => d.Mood))
  const vibeEnergy = avg(moodSeries.map((d) => d.Energy))
  const vibeScore =
    vibeMood != null || vibeEnergy != null
      ? Math.round((((vibeMood ?? 0) / 5) * 0.6 + ((vibeEnergy ?? 0) / 4) * 0.4) * 50) / 10
      : null

  const peakMoodDays = moodSeries
    .filter((d) => d.Mood != null && d.Mood >= 4)
    .map((d) => d.label)
    .slice(-3)

  const variance =
    habitStats.length > 1
      ? habitStats.reduce((sum, h) => sum + Math.abs(h.rate - overallRate), 0) / habitStats.length
      : 0
  const consistencyLabel =
    overallRate >= 70 && variance < 22
      ? 'High Consistency'
      : overallRate >= 45
        ? 'Steady Rhythm'
        : overallRate > 0
          ? 'Building Momentum'
          : 'Getting Started'

  const weekdayFocus = WEEKDAY_LABELS.map((label, weekday) => {
    const subset = focusDaily.filter((d) => d.weekday === weekday)
    const hours = subset.reduce((sum, d) => sum + d.hours, 0)
    const avgHours = subset.length ? Math.round((hours / subset.length) * 10) / 10 : 0
    return { weekday, label, hours: Math.round(hours * 10) / 10, avgHours, samples: subset.length }
  })

  const archive = []
  for (const d of days) {
    const dayNotes = Object.entries(notes)
      .filter(([k, v]) => v?.trim() && (k === d.key || k.endsWith(`:${d.key}`)))
      .map(([, v]) => v.trim())
    const note = [...new Set(dayNotes)].join('\n')
    const highlight = (panelIndex.rating?.[d.key]?.highlight || '').trim()
    const reflection = (panelIndex.salah?.[d.key]?.reflection || '').trim()
    const taskList = todos[d.key] || []
    const habitsLogged = HABIT_TRACKERS.filter((id) => isLogged(pixelIndex[id]?.[d.key])).length
    if (!(note || highlight || reflection || taskList.length || habitsLogged)) continue
    archive.push({
      key: d.key,
      label: d.label,
      date: d.date,
      note,
      highlight,
      reflection,
      rating: pixelIndex.rating?.[d.key] ?? null,
      energy: pixelIndex.energy?.[d.key] ?? null,
      sleep: pixelIndex.sleep?.[d.key] ?? null,
      tasksDone: taskList.filter((t) => t.done || t.completed).length,
      tasksTotal: taskList.length,
      habitsLogged,
      preview: highlight || note || reflection || `${habitsLogged} habit${habitsLogged === 1 ? '' : 's'} logged`,
    })
  }
  archive.reverse()

  const calendarDays = days.map((d) => {
    const entry = archive.find((a) => a.key === d.key) || null
    const activityCount = HABIT_TRACKERS.filter((id) => isLogged(pixelIndex[id]?.[d.key])).length
    return {
      key: d.key,
      day: d.day,
      weekday: d.weekday,
      label: d.label,
      short: d.short,
      date: d.date,
      activityCount,
      hasEntry: Boolean(entry),
      entry,
    }
  })

  return {
    days,
    pixelIndex,
    habitStats,
    moodSeries,
    focus: {
      minutes: focusMinutes,
      hours: focusHours,
      daily: focusDaily,
      loggedDays: days.filter((d) => isLogged(pixelIndex.focus?.[d.key])).length,
      environments: Object.entries(envCounts)
        .map(([id, count]) => {
          const meta = FOCUS_ENVIRONMENTS.find((e) => e.id === id)
          return {
            id,
            label: meta?.label || id,
            emoji: meta?.emoji || '📍',
            count,
          }
        })
        .sort((a, b) => b.count - a.count),
    },
    tasks: {
      done: tasksDone,
      total: tasksTotal,
      rate: pct(tasksDone, tasksTotal),
    },
    overview: {
      overallRate,
      bestStreak,
      activeStreak,
      consistencyLabel,
      spiritualFocusIndex,
      vibeScore,
      vibeMood,
      vibeEnergy,
      peakMoodDays,
      salahScore,
      variance: Math.round(variance),
    },
    weekdayFocus,
    archive,
    calendarDays,
  }
}

function deltaPct(current, previous) {
  if (previous == null || previous === 0) {
    if (current > 0) return 100
    return 0
  }
  return Math.round(((current - previous) / Math.abs(previous)) * 100)
}

function buildSmartMatrix({ days, pixelIndex, moodSeries, habitStats, rangeId }) {
  const cards = []
  const periodWord = rangeId === 'weekly' ? 'week' : rangeId === 'monthly' ? 'month' : 'period'

  const goodSleep = days.filter((d) => sleepIsGood(pixelIndex.sleep?.[d.key]))
  const weakSleep = days.filter(
    (d) => isLogged(pixelIndex.sleep?.[d.key]) && !sleepIsGood(pixelIndex.sleep?.[d.key]),
  )
  if (goodSleep.length >= 2 && weakSleep.length >= 1) {
    const morningSalahBoost = goodSleep.filter((d) => {
      const salah = pixelIndex.salah?.[d.key]
      return salahIsStrong(salah) || (salah >= 4 && salah <= 6)
    })
    const focusOnGood =
      goodSleep.filter((d) => focusIsDeep(pixelIndex.focus?.[d.key])).length / goodSleep.length
    const focusOnWeak =
      weakSleep.filter((d) => focusIsDeep(pixelIndex.focus?.[d.key])).length / Math.max(1, weakSleep.length)
    const lift = Math.round((focusOnGood - focusOnWeak) * 100)
    if (lift > 8) {
      cards.push({
        id: 'sleep-salah-focus',
        emoji: '🧠',
        tone: 'mint',
        title: 'Pattern detected',
        message: `Your focus output is about ${lift}% stronger on days with good or optimal sleep quality${morningSalahBoost.length ? ' — especially when morning prayers stay on track' : ''}.`,
      })
    }
  }

  const lowEnergy = moodSeries.filter((d) => d.Energy != null && d.Energy <= 2)
  if (lowEnergy.length >= 2) {
    const dryShare =
      lowEnergy.filter((d) => {
        const w = pixelIndex.water?.[d.key]
        return w != null && w < 3
      }).length / lowEnergy.length
    if (dryShare >= 0.4) {
      cards.push({
        id: 'energy-water',
        emoji: '💧',
        tone: 'sky',
        title: 'Energy dip alert',
        message: `Your lowest energy days often line up with lighter hydration — about ${Math.round(dryShare * 100)}% of low-energy days logged under 3 cups.`,
      })
    }
  }

  const weekend = days.filter((d) => d.weekday === 0 || d.weekday === 6)
  const weekday = days.filter((d) => d.weekday !== 0 && d.weekday !== 6)
  if (weekend.length && weekday.length) {
    const wSalah = weekend.filter((d) => salahIsStrong(pixelIndex.salah?.[d.key])).length / weekend.length
    const dSalah = weekday.filter((d) => salahIsStrong(pixelIndex.salah?.[d.key])).length / weekday.length
    if (wSalah > dSalah + 0.15) {
      cards.push({
        id: 'salah-weekend',
        emoji: '🤲',
        tone: 'lilac',
        title: 'Spiritual rhythm',
        message:
          'Prayer consistency peaks on weekends. Borrowing a bit of that softness into weekday mornings could lift your Spiritual Index.',
      })
    }
  }

  const paired = moodSeries.filter((d) => d.Mood != null && d.Energy != null)
  if (paired.length >= 4) {
    const highE = paired.filter((d) => energyIsHigh(d.Energy))
    const lowE = paired.filter((d) => !energyIsHigh(d.Energy))
    if (highE.length >= 2 && lowE.length >= 1) {
      const hi = highE.filter((d) => ratingIsGood(d.Mood)).length / highE.length
      const lo = lowE.filter((d) => ratingIsGood(d.Mood)).length / lowE.length
      const lift = Math.round((hi - lo) * 100)
      if (lift > 10) {
        cards.push({
          id: 'energy-mood',
          emoji: '⚡',
          tone: 'gold',
          title: 'Vibe correlation',
          message: `Higher-energy days rate as “good or amazing” about ${lift}% more often. Guarding rest is protecting joy.`,
        })
      }
    }
  }

  const top = [...habitStats].sort((a, b) => b.rate - a.rate)[0]
  if (top && top.rate >= 35) {
    cards.push({
      id: 'anchor-habit',
      emoji: '✨',
      tone: 'rose',
      title: `${top.title} is your anchor`,
      message: `Logged on ${top.rate}% of days this ${periodWord}${top.streak ? ` · current streak ${top.streak} day${top.streak === 1 ? '' : 's'}` : ''}.`,
    })
  }

  return cards.slice(0, 4)
}

export function buildInsights(state, rangeId = 'weekly', year, anchor = new Date(), customRange = null) {
  const y = year ?? state?.profile?.year ?? new Date().getFullYear()
  const bounds = getRangeBounds(rangeId, y, anchor, customRange)
  const days = enumerateDays(bounds.from, bounds.to)
  const current = buildWindowSnapshot(state, days, bounds.from, bounds.to)

  const prevBounds = previousBounds(bounds)
  const prevDays = enumerateDays(prevBounds.from, prevBounds.to)
  const previous = buildWindowSnapshot(state, prevDays, prevBounds.from, prevBounds.to)

  const insights = buildSmartMatrix({
    days,
    pixelIndex: current.pixelIndex,
    moodSeries: current.moodSeries,
    habitStats: current.habitStats,
    rangeId,
  })

  return {
    rangeId,
    bounds,
    prevBounds,
    days: current.days,
    habitStats: current.habitStats,
    chartHabits: current.habitStats.filter((h) =>
      ['sleep', 'salah', 'water', 'teeth', 'shower', 'focus', 'workout', 'reading'].includes(h.id),
    ),
    moodSeries: current.moodSeries,
    calendarDays: current.calendarDays,
    archive: current.archive,
    focus: current.focus,
    tasks: current.tasks,
    weekdayFocus: current.weekdayFocus,
    insights,
    overview: {
      ...current.overview,
      successDelta: deltaPct(current.overview.overallRate, previous.overview.overallRate),
      streakDelta: current.overview.activeStreak - previous.overview.activeStreak,
      vibeDelta:
        current.overview.vibeScore != null && previous.overview.vibeScore != null
          ? Math.round((current.overview.vibeScore - previous.overview.vibeScore) * 10) / 10
          : null,
      focusDelta: Math.round((current.focus.hours - previous.focus.hours) * 10) / 10,
      spiritualDelta: current.overview.spiritualFocusIndex - previous.overview.spiritualFocusIndex,
      previousRate: previous.overview.overallRate,
    },
    averages: {
      rating: current.overview.vibeMood,
      energy: current.overview.vibeEnergy,
      sleep: avg(current.moodSeries.map((d) => d.Sleep)),
    },
  }
}

export function shiftArchiveAnchor(rangeId, year, currentAnchor, direction) {
  const d = new Date(currentAnchor)
  if (rangeId === 'yearly' || rangeId === 'custom') return d
  if (rangeId === 'monthly') {
    d.setMonth(d.getMonth() + direction)
    return d
  }
  d.setDate(d.getDate() + direction * 7)
  return d
}

export function filterHabitsByCategory(habitStats, categoryId) {
  const cat = INSIGHT_CATEGORIES.find((c) => c.id === categoryId)
  if (!cat || cat.id === 'all' || !cat.habits) return habitStats
  return habitStats.filter((h) => cat.habits.includes(h.id))
}

export function buildExportReport(data, categoryLabel = 'All Trackers') {
  const lines = [
    'Selfix Life Analytics Report',
    `Period: ${data.bounds.label}`,
    `Category: ${categoryLabel}`,
    '',
    '=== Executive Summary ===',
    `Overall Success Index: ${data.overview.overallRate}% (${data.overview.successDelta >= 0 ? '+' : ''}${data.overview.successDelta}% vs previous)`,
    `Active Streak: ${data.overview.activeStreak}d (best ${data.overview.bestStreak}d)`,
    `Consistency: ${data.overview.consistencyLabel}`,
    `Spiritual & Focus Index: ${data.overview.spiritualFocusIndex}`,
    `Average Vibe: ${data.overview.vibeScore ?? '—'} / 5`,
    `Focus Hours: ${data.focus.hours}h`,
    `Tasks: ${data.tasks.done}/${data.tasks.total} (${data.tasks.rate}%)`,
    '',
    '=== Habit Completion ===',
    ...data.habitStats.map(
      (h) => `${h.title}: ${h.rate}% (${h.logged}/${h.total}) · streak ${h.streak}d · best ${h.bestStreak}d`,
    ),
    '',
    '=== Smart Connections ===',
    ...(data.insights.length
      ? data.insights.map((c) => `- ${c.title}: ${c.message}`)
      : ['- Not enough overlapping data yet for causal patterns.']),
    '',
    '=== Looking Back (highlights) ===',
    ...(data.archive.length
      ? data.archive.slice(0, 20).map((e) => `- ${e.label}: ${e.preview}`)
      : ['- No journal entries in this window.']),
    '',
    `Generated ${new Date().toLocaleString('en-US')}`,
  ]
  return lines.join('\n')
}
