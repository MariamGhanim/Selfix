import { ADSTERRA_SOCIAL_BAR_SRC } from './adsterraConfig'

const SCRIPT_ATTR = 'data-adsterra-social-bar'
const FLOAT_ATTR = 'data-adsterra-float'

function isOurChrome(el) {
  if (!(el instanceof HTMLElement)) return true
  if (el.id === 'root') return true
  if (el.classList.contains('ambient-music-player')) return true
  if (el.classList.contains('journal-ad-sidebar')) return true
  if (el.hasAttribute('data-journal-ads')) return true
  return false
}

function isFixedLike(el) {
  const inline = el.getAttribute('style') || ''
  if (/position\s*:\s*fixed/i.test(inline)) return true
  try {
    return window.getComputedStyle(el).position === 'fixed'
  } catch {
    return false
  }
}

/** Tag Adsterra (and similar) body-level fixed hosts so CSS can keep them visible on desktop. */
function tagFloatHosts() {
  if (typeof document === 'undefined' || !document.body) return
  for (const el of document.body.children) {
    if (isOurChrome(el)) continue
    if (el.tagName !== 'DIV' && el.tagName !== 'ASIDE' && el.tagName !== 'IFRAME') continue
    if (!isFixedLike(el)) continue
    el.setAttribute(FLOAT_ATTR, '1')
  }
}

/**
 * Ensure the Adsterra Social Bar script is present exactly once.
 * Safe with StrictMode / HMR — no duplicate tags.
 */
export function ensureAdsterraSocialBar() {
  if (typeof document === 'undefined') return

  const existing = document.querySelector(`script[${SCRIPT_ATTR}]`)
  if (existing) {
    watchAdsterraSocialBarFloats()
    return
  }

  const already = Array.from(document.scripts).some(
    (s) => s.src && s.src.includes('fd13023e93fd3c0628c132081e0febde'),
  )
  if (already) {
    watchAdsterraSocialBarFloats()
    return
  }

  const script = document.createElement('script')
  script.setAttribute('data-cfasync', 'false')
  script.setAttribute(SCRIPT_ATTR, '1')
  script.src = ADSTERRA_SOCIAL_BAR_SRC
  document.body.appendChild(script)
  watchAdsterraSocialBarFloats()
}

let floatWatcherStarted = false

/** Observe body for Social Bar hosts; do not touch creative HTML inside. */
export function watchAdsterraSocialBarFloats() {
  if (typeof document === 'undefined' || !document.body || floatWatcherStarted) return
  floatWatcherStarted = true

  tagFloatHosts()
  const mo = new MutationObserver(() => tagFloatHosts())
  mo.observe(document.body, { childList: true, subtree: false })
  // Adsterra sometimes injects slightly after script load
  window.setTimeout(tagFloatHosts, 800)
  window.setTimeout(tagFloatHosts, 2500)
  window.setTimeout(tagFloatHosts, 5000)
}
