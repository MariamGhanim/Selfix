import { useEffect } from 'react'

const DEFAULT_TITLE =
  'Selfix Life · Year in Pixels Journal — Track Sleep, Mood, Habits & Daily Notes'

function ensureMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * Sets document title + description / Open Graph / Twitter / canonical for public pages.
 */
export default function usePageMeta({
  title,
  description,
  path,
  type = 'website',
}) {
  useEffect(() => {
    const url = `https://www.myselfix.me${path}`
    document.title = title
    ensureMeta('name', 'description', description)
    ensureMeta('property', 'og:title', title)
    ensureMeta('property', 'og:description', description)
    ensureMeta('property', 'og:url', url)
    ensureMeta('property', 'og:type', type)
    ensureMeta('name', 'twitter:title', title)
    ensureMeta('name', 'twitter:description', description)

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)

    return () => {
      document.title = DEFAULT_TITLE
    }
  }, [title, description, path, type])
}
