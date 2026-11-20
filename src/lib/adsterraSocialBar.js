import { ADSTERRA_SOCIAL_BAR_SRC } from './adsterraConfig'

const SCRIPT_ATTR = 'data-adsterra-social-bar'

/**
 * Ensure the Adsterra Social Bar script is present exactly once.
 * Safe with StrictMode / HMR — no duplicate tags.
 */
export function ensureAdsterraSocialBar() {
  if (typeof document === 'undefined') return

  const existing = document.querySelector(`script[${SCRIPT_ATTR}]`)
  if (existing) return

  const already = Array.from(document.scripts).some(
    (s) => s.src && s.src.includes('fd13023e93fd3c0628c132081e0febde'),
  )
  if (already) return

  const script = document.createElement('script')
  script.setAttribute('data-cfasync', 'false')
  script.setAttribute(SCRIPT_ATTR, '1')
  script.src = ADSTERRA_SOCIAL_BAR_SRC
  document.body.appendChild(script)
}
