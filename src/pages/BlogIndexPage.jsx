import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Search, Sparkles } from 'lucide-react'
import PublicNav from '../components/Legal/PublicNav'
import LegalFooter from '../components/Legal/LegalFooter'
import usePageMeta from '../hooks/usePageMeta'
import { BLOG_CATEGORIES, getAllPosts } from '../data/blogPosts'

const CATEGORY_ACCENT = {
  mood: {
    gradient:
      'linear-gradient(135deg, #f8d4de 0%, #e8d4f5 48%, #d4e8f8 100%)',
    blob: '#e8a0b4',
  },
  sleep: {
    gradient:
      'linear-gradient(135deg, #d8eef8 0%, #c8e8dc 48%, #d4d4f0 100%)',
    blob: '#8ec5f0',
  },
  habits: {
    gradient:
      'linear-gradient(135deg, #f8e4c8 0%, #f0dcc0 48%, #d8e8c8 100%)',
    blob: '#f0d06a',
  },
  journaling: {
    gradient:
      'linear-gradient(135deg, #f5d8e4 0%, #e8d8f0 48%, #f0e4d0 100%)',
    blob: '#d4c2ef',
  },
}

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

function TagPills({ tags, limit = 3 }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.slice(0, limit).map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-[var(--accent-glow)]/60 px-2.5 py-0.5 text-[10px] font-bold text-[var(--accent-deep)]"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

function FeaturedCard({ post }) {
  const accent = CATEGORY_ACCENT[post.category] || CATEGORY_ACCENT.journaling

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group relative block overflow-hidden rounded-3xl border border-[var(--page-edge)]/70 bg-[var(--surface)]/70 shadow-[0_12px_40px_rgba(160,110,125,0.1)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(160,110,125,0.14)]"
    >
      <div className="grid md:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col justify-center px-6 py-7 sm:px-8 sm:py-9 lg:px-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-deep)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              <Sparkles size={11} />
              Featured
            </span>
            <span className="rounded-full bg-[var(--accent-glow)]/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--accent-deep)]">
              {categoryLabel(post.category)}
            </span>
          </div>
          <h2 className="mt-4 font-display text-2xl font-semibold leading-snug tracking-tight text-[var(--ink)] transition group-hover:text-[var(--accent-deep)] sm:text-3xl lg:text-[2.1rem]">
            {post.title}
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--ink-soft)]">
            {post.description}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-[12px] font-semibold text-[var(--ink-soft)]">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} />
              {post.readMinutes} min read
            </span>
            <span className="opacity-40">·</span>
            <span>{formatDate(post.date)}</span>
            <span className="ml-auto inline-flex items-center gap-1 font-bold text-[var(--accent-deep)]">
              Read article
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </span>
          </div>
        </div>

        <div
          className="relative hidden min-h-[220px] overflow-hidden md:block"
          style={{ background: accent.gradient }}
          aria-hidden
        >
          <div
            className="absolute -right-8 -top-10 h-40 w-40 rounded-full opacity-50 blur-2xl"
            style={{ background: accent.blob }}
          />
          <div
            className="absolute -bottom-12 left-6 h-36 w-36 rounded-full opacity-40 blur-2xl"
            style={{ background: '#fff6' }}
          />
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="grid w-full max-w-[200px] grid-cols-7 gap-1.5">
              {Array.from({ length: 28 }).map((_, i) => {
                const colors = [
                  '#f2b8c6',
                  '#f5c9a8',
                  '#f0d89a',
                  '#b8dfc8',
                  '#b7d7f0',
                  '#d4c2ef',
                  'rgba(255,255,255,0.45)',
                ]
                return (
                  <span
                    key={i}
                    className="aspect-square rounded-md shadow-sm"
                    style={{
                      background: colors[(i * 3 + post.slug.length) % colors.length],
                      opacity: 0.85 + ((i % 5) * 0.03),
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

function ArticleCard({ post }) {
  const accent = CATEGORY_ACCENT[post.category] || CATEGORY_ACCENT.journaling

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--page-edge)]/65 bg-white/75 shadow-[0_8px_28px_rgba(160,110,125,0.07)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/35 hover:shadow-[0_14px_36px_rgba(160,110,125,0.12)]"
    >
      <div
        className="relative h-28 overflow-hidden sm:h-32"
        style={{ background: accent.gradient }}
        aria-hidden
      >
        <div
          className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-45 blur-xl"
          style={{ background: accent.blob }}
        />
        <div className="absolute bottom-3 left-4">
          <span className="rounded-full bg-white/75 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--accent-deep)] backdrop-blur-sm">
            {categoryLabel(post.category)}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-5 py-5">
        <p className="text-[11px] font-semibold text-[var(--ink-soft)]">
          {formatDate(post.date)} · {post.readMinutes} min
        </p>
        <h2 className="mt-2 font-display text-lg font-semibold leading-snug text-[var(--ink)] transition group-hover:text-[var(--accent-deep)] sm:text-xl">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--ink-soft)]">
          {post.description}
        </p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <TagPills tags={post.tags} />
          <span className="inline-flex shrink-0 items-center gap-1 text-[12px] font-bold text-[var(--accent-deep)]">
            Read
            <ArrowRight
              size={13}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  )
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

  const showFeatured = !query.trim() && category === 'all' && filtered.length > 0
  const featured = showFeatured ? filtered[0] : null
  const gridPosts = showFeatured ? filtered.slice(1) : filtered

  return (
    <div className="relative flex min-h-[100dvh] w-full max-w-full flex-col overflow-x-hidden overflow-y-auto">
      <div className="about-atmosphere pointer-events-none absolute inset-0 min-h-full" aria-hidden />

      <div className="relative z-10 px-4 py-4 sm:px-6 sm:py-5">
        <PublicNav homeLabel="Sign in" />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 pb-12 sm:px-6">
        <header className="mb-8 max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent-deep)]">
            Selfix Life journal guides
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
            Blog
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-soft)] sm:text-base">
            Calm reading on Year in Pixels, sleep, mood, and gentle habits — written for real days,
            with sources you can check.
          </p>
        </header>

        <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-[var(--page-edge)]/60 bg-white/70 p-3 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:gap-4 sm:p-3.5">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search articles</span>
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-soft)]"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search guides…"
              className="w-full rounded-xl border border-[var(--page-edge)]/70 bg-[var(--surface)]/90 py-2.5 pl-10 pr-3.5 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-soft)]/55 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
            />
          </label>
          <div
            role="group"
            aria-label="Filter by category"
            className="flex flex-wrap gap-1.5 sm:justify-end"
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
                      : 'bg-[var(--surface)] text-[var(--ink-soft)] ring-1 ring-[var(--page-edge)]/50 hover:text-[var(--ink)]'
                  }`}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>

        {featured && (
          <div className="mb-8">
            <FeaturedCard post={featured} />
          </div>
        )}

        <p className="mb-4 text-[12px] font-semibold text-[var(--ink-soft)]">
          {filtered.length} {filtered.length === 1 ? 'guide' : 'guides'}
          {query.trim() || category !== 'all' ? ' matching your filters' : ''}
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-[var(--page-edge)]/60 bg-white/70 px-5 py-8 text-center backdrop-blur-sm">
            <p className="text-sm text-[var(--ink-soft)]">
              No guides matched that search. Try a broader keyword, or switch back to All.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {gridPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        )}

        <div className="mt-10">
          <LegalFooter alwaysShow />
        </div>
      </main>
    </div>
  )
}
