/**
 * Soft time parsing helpers for Selfix Life.
 * Storage format stays HTML-time compatible: "HH:MM" (24h).
 */

// Match am/pm even when glued to digits ("11pm", "230am") — \b fails between digit↔letter.
const AM_PM_RE = /(a\.?m\.?|p\.?m\.?)/i

/** @returns {{ hours24: number, minutes: number } | null} */
export function parseTimeInput(raw) {
  if (raw == null) return null
  let s = String(raw).trim().toLowerCase()
  if (!s) return null

  let meridiem = null
  const ampmMatch = s.match(AM_PM_RE)
  if (ampmMatch) {
    meridiem = ampmMatch[1].startsWith('p') ? 'pm' : 'am'
    s = s.replace(AM_PM_RE, ' ').trim()
  }

  s = s.replace(/[^\d:.]/g, '')
  if (!s) return null

  let hours
  let minutes = 0

  if (s.includes(':') || s.includes('.')) {
    const [hPart, mPart = '0'] = s.split(/[:.]/)
    hours = Number.parseInt(hPart, 10)
    minutes = Number.parseInt(mPart.padEnd(2, '0').slice(0, 2), 10)
  } else if (s.length <= 2) {
    hours = Number.parseInt(s, 10)
    minutes = 0
  } else if (s.length === 3) {
    hours = Number.parseInt(s.slice(0, 1), 10)
    minutes = Number.parseInt(s.slice(1), 10)
  } else {
    const digits = s.slice(0, 4)
    hours = Number.parseInt(digits.slice(0, digits.length - 2), 10)
    minutes = Number.parseInt(digits.slice(-2), 10)
  }

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null
  if (minutes < 0 || minutes > 59) return null

  if (meridiem) {
    if (hours < 1 || hours > 12) return null
    if (meridiem === 'am') {
      hours = hours === 12 ? 0 : hours
    } else {
      hours = hours === 12 ? 12 : hours + 12
    }
  } else if (hours < 0 || hours > 23) {
    return null
  }

  return { hours24: hours, minutes }
}

export function toStorageTime(hours24, minutes) {
  const h = ((hours24 % 24) + 24) % 24
  const m = ((minutes % 60) + 60) % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function formatDisplayTime(storage) {
  const parsed = parseTimeInput(storage)
  if (!parsed) return ''
  const { hours24, minutes } = parsed
  const am = hours24 < 12
  let h12 = hours24 % 12
  if (h12 === 0) h12 = 12
  return `${h12}:${String(minutes).padStart(2, '0')} ${am ? 'AM' : 'PM'}`
}

export function storageToParts(storage) {
  const parsed = parseTimeInput(storage)
  if (!parsed) return { hour12: 10, minutes: 0, isPm: true }
  const { hours24, minutes } = parsed
  const isPm = hours24 >= 12
  let hour12 = hours24 % 12
  if (hour12 === 0) hour12 = 12
  return { hour12, minutes, isPm }
}

export function partsToStorage(hour12, minutes, isPm) {
  let h = hour12 % 12
  if (isPm) h += 12
  return toStorageTime(h, minutes)
}

/** Sleep length in hours from bedtime → wake (supports overnight). */
export function sleepHoursBetween(sleepStorage, wakeStorage) {
  const sleep = parseTimeInput(sleepStorage)
  const wake = parseTimeInput(wakeStorage)
  if (!sleep || !wake) return null
  const sleepMins = sleep.hours24 * 60 + sleep.minutes
  const wakeMins = wake.hours24 * 60 + wake.minutes
  let diff = wakeMins - sleepMins
  if (diff <= 0) diff += 24 * 60
  return diff / 60
}

/** Map hours → Sleep duration pill id + pixel level. */
export function sleepDurationFromHours(hours) {
  if (hours == null || !Number.isFinite(hours)) return null
  if (hours < 4) return { id: 'lt4', level: 1 }
  if (hours < 6) return { id: '4-5', level: 1 }
  if (hours < 7) return { id: '6-7', level: 2 }
  if (hours < 8) return { id: '7-8', level: 3 }
  return { id: '8plus', level: 4 }
}
