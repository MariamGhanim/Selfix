import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import { decryptJournalFromCloud, encryptJournalForCloud } from './noteCrypto'

const SYNC_TIMEOUT_MS = 10000

export function journalDocRef(uid) {
  if (!db) throw new Error('Firestore is not initialized. Check your Firebase .env keys.')
  return doc(db, 'users', uid, 'data', 'journal')
}

function withTimeout(promise, ms, label) {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(
        new Error(
          `${label} timed out. Create a Cloud Firestore database for project selfix-1211 in Firebase Console, then try again.`,
        ),
      )
    }, ms)
    promise
      .then((value) => {
        window.clearTimeout(timer)
        resolve(value)
      })
      .catch((err) => {
        window.clearTimeout(timer)
        reject(err)
      })
  })
}

function mapFirestoreError(err) {
  const code = err?.code || ''
  if (code === 'permission-denied') {
    return new Error(
      'Firestore permission denied. Deploy firestore.rules so users can read/write only their own users/{uid} data.',
    )
  }
  if (code === 'unavailable' || code === 'deadline-exceeded') {
    return new Error('Firestore is temporarily unavailable. Check your connection and try again.')
  }
  if (err?.message?.includes('timed out')) return err
  return new Error(err?.message || 'Could not reach Firestore.')
}

function sanitizeForFirestore(value) {
  return JSON.parse(JSON.stringify(value))
}

export async function loadJournalFromCloud(uid, defaults) {
  try {
    const snap = await withTimeout(getDoc(journalDocRef(uid)), SYNC_TIMEOUT_MS, 'Loading journal')
    if (snap.exists()) {
      const data = snap.data()
      const { updatedAt: _u, createdAt: _c, ...journal } = data
      const merged = {
        ...defaults,
        ...journal,
        profile: { ...defaults.profile, ...(journal.profile || {}) },
      }
      return decryptJournalFromCloud(merged, uid)
    }

    const seed = sanitizeForFirestore(defaults)
    const encryptedSeed = sanitizeForFirestore(encryptJournalForCloud(seed, uid))
    await withTimeout(
      setDoc(journalDocRef(uid), {
        ...encryptedSeed,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }),
      SYNC_TIMEOUT_MS,
      'Creating journal',
    )
    return seed
  } catch (err) {
    throw mapFirestoreError(err)
  }
}

export async function saveJournalToCloud(uid, state) {
  try {
    const encrypted = encryptJournalForCloud(state, uid)
    const clean = sanitizeForFirestore(encrypted)
    await withTimeout(
      setDoc(journalDocRef(uid), {
        ...clean,
        updatedAt: serverTimestamp(),
      }),
      SYNC_TIMEOUT_MS,
      'Saving journal',
    )
  } catch (err) {
    throw mapFirestoreError(err)
  }
}
