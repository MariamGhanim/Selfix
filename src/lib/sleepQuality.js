import {
  SLEEP_DISRUPTERS,
  SLEEP_DURATIONS,
  SLEEP_FRAGMENTATION,
  SLEEP_MORNING,
} from '../data/panelOptions'
import { sleepHoursBetween } from './timeParse'

/**
 * Sleep quality score (1–100).
 *
 * Duration is judged against ~90-minute cycles: 5 cycles ≈ 7.5h, 6 cycles ≈ 9h.
 * The restorative window is 7–9h. Under 7h accrues sleep debt. Past 9–10h, extra
 * time often brings sleep inertia rather than more recovery, so it cannot sit
 * at the top of the scale on its own.
 *
 * Continuity and morning inertia then scale that base. A solid 8h night that
 * was fragmented or groggy lands below Optimal. Disrupters are a light penalty
 * — context, not the whole night.
 *
 * Older logs only stored a duration chip plus freeform quality tags. Those tags
 * are read until the day is saved in the new model (`sleepModel: 2`).
 */

const LEGACY_HOURS = {
  lt4: 3.5,
  '4-5': 4.5,
  '6-7': 6.5,
  '7-8': 7.5,
  '8plus': 8.5,
}

const FRAGMENTATION_FACTOR = {
  solid: 1,
  mild_waking: 0.82,
  frequent_awakenings: 0.58,
}

const MORNING_FACTOR = {
  alert: 1,
  groggy: 0.78,
  exhausted: 0.55,
  aches: 0.6,
}

const DISRUPTER_IDS = new Set(SLEEP_DISRUPTERS.map((item) => item.id))

const BADGES = [
  { min: 85, id: 'optimal', label: 'Optimal', pixelLevel: 4 },
  { min: 70, id: 'good', label: 'Good', pixelLevel: 3 },
  { min: 50, id: 'fair', label: 'Fair', pixelLevel: 2 },
  { min: 0, id: 'needs_attention', label: 'Needs attention', pixelLevel: 1 },
]

export const SLEEP_LEVEL_FALLBACK_SCORE = { 1: 35, 2: 58, 3: 78, 4: 92 }

function roundHours(hours) {
  if (hours == null || !Number.isFinite(hours)) return null
  return Math.round(hours * 10) / 10
}

function lerp(from, to, t) {
  return from + (to - from) * Math.min(1, Math.max(0, t))
}

export function durationQualityScore(hours) {
  if (hours == null || !Number.isFinite(hours) || hours <= 0) return null
  const h = Math.min(hours, 16)

  if (h < 5) return Math.round(lerp(16, 46, h / 5))
  if (h < 7) return Math.round(lerp(52, 68, (h - 5) / 2))
  if (h < 7.5) return Math.round(lerp(88, 100, (h - 7) / 0.5))
  if (h <= 8.5) return 100
  if (h < 9) return Math.round(lerp(100, 84, (h - 8.5) / 0.5))
  if (h < 11) return Math.round(lerp(82, 66, (h - 9) / 2))
  if (h < 13) return Math.round(lerp(66, 46, (h - 11) / 2))
  return Math.max(28, Math.round(46 - (h - 13) * 4))
}

export function bandForHours(hours) {
  if (hours == null || !Number.isFinite(hours) || hours <= 0) return null
  if (hours < 5) return SLEEP_DURATIONS.find((band) => band.id === 'severe') || null
  if (hours < 7) return SLEEP_DURATIONS.find((band) => band.id === 'moderate') || null
  if (hours < 9) return SLEEP_DURATIONS.find((band) => band.id === 'optimal') || null
  return SLEEP_DURATIONS.find((band) => band.id === 'oversleep') || null
}

function badgeForScore(score) {
  if (score == null) return null
  return BADGES.find((badge) => score >= badge.min) || BADGES[BADGES.length - 1]
}

function asIdList(value) {
  if (!Array.isArray(value)) return []
  return value.filter((id) => typeof id === 'string' && DISRUPTER_IDS.has(id))
}

function inferFragmentation(panel) {
  const quality = Array.isArray(panel?.quality) ? panel.quality : []
  if (quality.includes('insomnia')) return 'frequent_awakenings'
  if (quality.includes('restless') || panel?.q1 === 'tossed') return 'mild_waking'
  if (quality.includes('deep') || panel?.q1 === 'light' || panel?.q3 === 'deep') return 'solid'
  return null
}

function inferMorning(panel) {
  const quality = Array.isArray(panel?.quality) ? panel.quality : []
  if (quality.includes('sore')) return 'aches'
  if (panel?.q2 === 'zombie' || panel?.q3 === 'nap') return 'exhausted'
  if (quality.includes('groggy') || panel?.q2 === 'fivemore') return 'groggy'
  if (panel?.q2 === 'ready') return 'alert'
  return null
}

function inferDisrupters(panel) {
  const quality = Array.isArray(panel?.quality) ? panel.quality : []
  const ids = []
  if (quality.includes('caffeine')) ids.push('caffeine')
  if (panel?.q1 === 'scrolling') ids.push('screens')
  return ids
}

function resolveDuration(panel) {
  const fromTimes = roundHours(sleepHoursBetween(panel?.sleepTime, panel?.wakeTime))
  const source = panel?.durationSource || null
  const numeric =
    typeof panel?.duration === 'number' && Number.isFinite(panel.duration) && panel.duration > 0
      ? roundHours(panel.duration)
      : null

  if (source === 'chip') {
    if (numeric != null) return { hours: numeric, source: 'chip' }
    if (fromTimes != null) return { hours: fromTimes, source: 'times' }
    return { hours: null, source: 'chip' }
  }

  if (source === 'times') {
    if (fromTimes != null) return { hours: fromTimes, source: 'times' }
    if (numeric != null) return { hours: numeric, source: 'times' }
    return { hours: null, source: 'times' }
  }

  if (source == null && fromTimes != null) return { hours: fromTimes, source: 'times' }
  if (numeric != null) return { hours: numeric, source: source || 'chip' }

  if (typeof panel?.duration === 'string' && LEGACY_HOURS[panel.duration] != null) {
    if (fromTimes != null) return { hours: fromTimes, source: 'times' }
    return { hours: LEGACY_HOURS[panel.duration], source: 'legacy' }
  }

  if (fromTimes != null) return { hours: fromTimes, source: 'times' }
  return { hours: null, source: null }
}

function knownId(list, id) {
  if (id == null) return null
  return list.some((item) => item.id === id) ? id : null
}

function effectiveSignals(panel) {
  const locked = panel?.sleepModel === 2
  const fragmentationLevel = locked
    ? knownId(SLEEP_FRAGMENTATION, panel?.fragmentationLevel)
    : knownId(SLEEP_FRAGMENTATION, panel?.fragmentationLevel) || inferFragmentation(panel)
  const morningInertia = locked
    ? knownId(SLEEP_MORNING, panel?.morningInertia)
    : knownId(SLEEP_MORNING, panel?.morningInertia) || inferMorning(panel)
  const sleepDisrupters = locked
    ? asIdList(panel?.sleepDisrupters)
    : asIdList(panel?.sleepDisrupters).length
      ? asIdList(panel.sleepDisrupters)
      : inferDisrupters(panel)

  return { fragmentationLevel, morningInertia, sleepDisrupters }
}

function formatHours(hours) {
  if (hours == null) return null
  return Number.isInteger(hours) ? String(hours) : hours.toFixed(1)
}

function buildSummary({ hours, fragmentationLevel, morningInertia, sleepDisrupters }) {
  const lead = []
  const tone = []
  const pretty = formatHours(hours)

  if (hours != null && hours >= 7 && hours < 9) {
    lead.push(`${pretty}h sits in the 7–9h window (about 5–6 sleep cycles)`)
  } else if (hours != null && hours < 5) {
    lead.push(`${pretty}h is severe sleep debt, well short of a full set of cycles`)
  } else if (hours != null && hours < 7) {
    lead.push(`${pretty}h builds moderate sleep debt`)
  } else if (hours != null) {
    lead.push(`${pretty}h is past 9h, where extra time often adds inertia`)
  }

  if (fragmentationLevel === 'frequent_awakenings') tone.push('frequent awakenings broke continuity')
  else if (fragmentationLevel === 'mild_waking') tone.push('brief wakings nicked continuity')

  if (morningInertia === 'groggy') tone.push('morning grogginess signaled sleep inertia')
  else if (morningInertia === 'exhausted') tone.push('waking exhausted means recovery fell short')
  else if (morningInertia === 'aches') tone.push('aches on waking point to poor recovery')
  else if (morningInertia === 'alert') tone.push('you woke alert')

  if (sleepDisrupters.length) {
    tone.push(`${sleepDisrupters.length} disrupter${sleepDisrupters.length === 1 ? '' : 's'} weighed in`)
  } else if (fragmentationLevel === 'solid') {
    tone.push('the night stayed uninterrupted')
  }

  const clauses = [...lead, ...tone].slice(0, 2)
  if (!clauses.length) return ''
  const [first, ...rest] = clauses
  const sentence = first.charAt(0).toUpperCase() + first.slice(1)
  return rest.length ? `${sentence}; ${rest.join('; ')}.` : `${sentence}.`
}

export function scoreSleep(panel) {
  const source = panel || {}
  const duration = resolveDuration(source)
  const signals = effectiveSignals(source)
  const band = bandForHours(duration.hours)
  const durationScore = durationQualityScore(duration.hours)
  const hasQualitative = signals.fragmentationLevel != null || signals.morningInertia != null

  const empty = {
    score: null,
    badge: null,
    badgeLabel: null,
    pixelLevel: null,
    durationHours: duration.hours,
    durationSource: duration.source,
    bandId: band?.id ?? null,
    fragmentationLevel: signals.fragmentationLevel,
    fragmentationLabel:
      SLEEP_FRAGMENTATION.find((item) => item.id === signals.fragmentationLevel)?.short || null,
    sleepDisrupters: signals.sleepDisrupters,
    morningInertia: signals.morningInertia,
    morningLabel: SLEEP_MORNING.find((item) => item.id === signals.morningInertia)?.short || null,
    summary: '',
  }

  if (durationScore == null && !hasQualitative) return empty

  let score = durationScore == null ? 70 : durationScore
  if (signals.fragmentationLevel) score *= FRAGMENTATION_FACTOR[signals.fragmentationLevel]
  if (signals.morningInertia) score *= MORNING_FACTOR[signals.morningInertia]
  score -= Math.min(18, signals.sleepDisrupters.length * 4)
  score = Math.max(1, Math.min(100, Math.round(score)))

  const badge = badgeForScore(score)

  return {
    ...empty,
    score,
    badge: badge.id,
    badgeLabel: badge.label,
    pixelLevel: badge.pixelLevel,
    summary: buildSummary({
      hours: duration.hours,
      fragmentationLevel: signals.fragmentationLevel,
      morningInertia: signals.morningInertia,
      sleepDisrupters: signals.sleepDisrupters,
    }),
  }
}

/** Merge an edit onto a sleep log and rescore. Locks legacy inference into explicit fields. */
export function projectSleepLog(panel, partial = {}) {
  const current = scoreSleep(panel)
  const draft = {
    ...panel,
    ...partial,
    sleepModel: 2,
    duration: partial.duration !== undefined ? partial.duration : current.durationHours,
    durationSource:
      partial.durationSource !== undefined ? partial.durationSource : current.durationSource,
    fragmentationLevel:
      partial.fragmentationLevel !== undefined
        ? partial.fragmentationLevel
        : current.fragmentationLevel,
    sleepDisrupters:
      partial.sleepDisrupters !== undefined ? partial.sleepDisrupters : current.sleepDisrupters,
    morningInertia:
      partial.morningInertia !== undefined ? partial.morningInertia : current.morningInertia,
  }
  return scoreSleep(draft)
}

/** Replace stored sleep pixels with the quality level when a log can be scored. */
export function overlaySleepQuality(pixelIndex, panelIndex) {
  if (!pixelIndex) return pixelIndex
  const panels = panelIndex?.sleep || {}
  const sleep = { ...(pixelIndex.sleep || {}) }
  for (const [key, panel] of Object.entries(panels)) {
    const scored = scoreSleep(panel)
    if (scored.pixelLevel != null) sleep[key] = scored.pixelLevel
  }
  pixelIndex.sleep = sleep
  return pixelIndex
}
