import CryptoJS from 'crypto-js'

/** Versioned ciphertext prefix so we can detect encrypted vs legacy plaintext. */
export const NOTE_ENC_PREFIX = 'sfex1:'

const PANEL_TEXT_KEYS = ['note', 'reflection', 'highlight', 'book', 'withWho']

export function buildNoteSecret(uid) {
  // Kept only in memory for AES. Never log this value or the env var.
  const appSecret = import.meta.env.VITE_NOTE_ENCRYPTION_SECRET || 'selfix-local-dev-key'
  return `${uid || 'anon'}::${appSecret}`
}

export function isEncryptedNote(value) {
  return typeof value === 'string' && value.startsWith(NOTE_ENC_PREFIX)
}

export function encryptText(plain, secret) {
  if (plain == null) return plain
  const text = String(plain)
  if (!text) return text
  if (isEncryptedNote(text)) return text
  return NOTE_ENC_PREFIX + CryptoJS.AES.encrypt(text, secret).toString()
}

export function decryptText(value, secret) {
  if (value == null) return value
  const text = String(value)
  if (!text) return text
  if (!isEncryptedNote(text)) return text
  try {
    const bytes = CryptoJS.AES.decrypt(text.slice(NOTE_ENC_PREFIX.length), secret)
    const decoded = bytes.toString(CryptoJS.enc.Utf8)
    return decoded || text
  } catch {
    return text
  }
}

function mapStringRecord(record, mapper) {
  if (!record || typeof record !== 'object') return record || {}
  const next = {}
  for (const [key, value] of Object.entries(record)) {
    next[key] = typeof value === 'string' ? mapper(value) : value
  }
  return next
}

function mapPanels(panels, mapper) {
  if (!panels || typeof panels !== 'object') return panels || {}
  const next = {}
  for (const [key, panel] of Object.entries(panels)) {
    if (!panel || typeof panel !== 'object') {
      next[key] = panel
      continue
    }
    const copy = { ...panel }
    for (const field of PANEL_TEXT_KEYS) {
      if (typeof copy[field] === 'string' && copy[field]) {
        copy[field] = mapper(copy[field])
      }
    }
    next[key] = copy
  }
  return next
}

function mapTodos(todos, mapper) {
  if (!todos || typeof todos !== 'object') return todos || {}
  const next = {}
  for (const [key, list] of Object.entries(todos)) {
    if (!Array.isArray(list)) {
      next[key] = list
      continue
    }
    next[key] = list.map((item) => {
      if (!item || typeof item !== 'object') return item
      const copy = { ...item }
      if (typeof copy.text === 'string' && copy.text) copy.text = mapper(copy.text)
      if (typeof copy.title === 'string' && copy.title) copy.title = mapper(copy.title)
      return copy
    })
  }
  return next
}

/** Encrypt private journal fields before writing to Firestore. */
export function encryptJournalForCloud(state, uid) {
  const secret = buildNoteSecret(uid)
  const enc = (v) => encryptText(v, secret)
  return {
    ...state,
    dailyNotes: mapStringRecord(state.dailyNotes, enc),
    panels: mapPanels(state.panels, enc),
    todos: mapTodos(state.todos, enc),
  }
}

/** Decrypt private journal fields after loading from Firestore. */
export function decryptJournalFromCloud(state, uid) {
  const secret = buildNoteSecret(uid)
  const dec = (v) => decryptText(v, secret)
  return {
    ...state,
    dailyNotes: mapStringRecord(state.dailyNotes, dec),
    panels: mapPanels(state.panels, dec),
    todos: mapTodos(state.todos, dec),
  }
}
