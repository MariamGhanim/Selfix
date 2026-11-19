import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Search } from 'lucide-react'
import PublicNav from '../components/Legal/PublicNav'
import LegalFooter from '../components/Legal/LegalFooter'
import { SoftCard } from '../components/Legal/SiteLayout'
import usePageMeta from '../hooks/usePageMeta'
import { BLOG_CATEGORIES, getAllPosts } from '../data/blogPosts'

function formatDate(iso) {
  try {
    return new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

function categoryLabel(id) {
  return BLOG_CATEGORIES.find((c) => c.id === id)?.label || id
}

function postSearchText(post) {
  const parts = [post.title, post.description, ...(post.tags || []), post.category]
  for (const section of post.sections || []) {
    if (section.text) parts.push(section.text)
    if (section.items) parts.push(...section.items)
  }
  return parts.join(' ').toLowerCase()
}

export default function BlogIndexPage() {
  const posts = getAllPosts()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  usePageMeta({
    title: 'Journal Guides & Blog · Selfix Life',
    description:
      'Soft, practical guides on Year in Pixels, sleep tracking, mood awareness, habits, and calm journaling — from the Selfix Life team.',
    path: '/blog',
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'pinky')
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return posts.filter((post) => {
      if (category !== 'all' && post.category !== category) return false
      if (!q) return true
      return postSearchText(post).includes(q)
    })
  }, [posts, query, category])

  return (
    <div className="relative flex min-h-[100dvh] w-full max-w-full flex-col overflow-x-hidden overflow-y-auto">
      <div className="about-atmosphere pointer-events-none absolute inset-0 min-h-full" aria-hidden />

      <div className="relative z-10 px-4 py-4 sm:px-6 sm:py-5">
        <PublicNav homeLabel="Sign in" />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-4xl flex-1 px-4 pb-10 sm:px-6">
        <div className="book-shadow paper-texture overflow-hidden rounded-[28px] border border-[var(--page-edge)]">
          <header className="border-b border-[var(--page-edge)]/70 bg-[var(--accent-glow)]/50 px-6 py-6 sm:px-8 sm:py-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent-deep)]">
              Selfix Life journal guides
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-[var(--ink)] sm:text-3xl">
              Blog
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-soft)]">
              Calm reading on Year in Pixels, sleep, mood, habits, and finding a soft journaling
              space — written for real days, with sources you can check.
            </p>

            <label className="relative mt-5 block">
              <span className="sr-only">Search articles</span>
              <Search
                size={15}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-soft)]"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, topic, or keyword…"
                className="w-full rounded-2xl border border-[var(--page-edge)]/80 bg-[var(--surface)] py-2.5 pl-10 pr-3.5 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-soft)]/60 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/25"
              />
            </label>

            <div
              role="group"
              aria-label="Filter by category"
              className="mt-3.5 flex flex-wrap gap-1.5"
            >
              {BLOG_CATEGORIES.map((cat) => {
                const active = category === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
                      active
                        ? 'bg-[var(--accent-deep)] text-white shadow-sm'
                        : 'bg-[var(--surface)] text-[var(--ink-soft)] ring-1 ring-[var(--page-edge)]/55 hover:text-[var(--ink)]'
                    }`}
                  >
                    {cat.label}
                  </button>
                )
              })}
            </div>
          </header>

          <div className="space-y-4 px-6 py-7 sm:px-8 sm:py-8">
            <p className="text-[12px] font-semibold text-[var(--ink-soft)]">
              {filtered.length} {filtered.length === 1 ? 'guide' : 'guides'}
              {query.trim() || category !== 'all' ? ' matching your filters' : ''}
            </p>

            {filtered.length === 0 ? (
              <SoftCard>
                <p className="text-sm text-[var(--ink-soft)]">
                  No guides matched that search. Try a broader keyword, or switch back to All.
                </p>
              </SoftCard>
            ) : (
              filtered.map((post) => (
                <SoftCard key={post.slug} className="transition hover:bg-[var(--surface-strong)]">
                  <article>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--ink-soft)]">
                      {categoryLabel(post.category)} · {formatDate(post.date)} · {post.readMinutes}{' '}
                      min read
                    </p>
                    <h2 className="mt-1.5 font-display text-lg font-semibold text-[var(--ink)] sm:text-xl">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="transition hover:text-[var(--accent-deep)]"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                      {post.description}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-[var(--accent-glow)]/70 px-2.5 py-0.5 text-[10px] font-bold text-[var(--accent-deep)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-[12px] font-bold text-[var(--accent-deep)] transition hover:underline"
                      >
                        Read guide
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </article>
                </SoftCard>
              ))
            )}
          </div>
        </div>

        <div className="mt-4">
          <LegalFooter alwaysShow />
        </div>
      </main>
    </div>
  )
}
