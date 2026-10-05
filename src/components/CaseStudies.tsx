import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Check, Cloud, Cpu, ExternalLink, Layers, Pause, Play } from 'lucide-react'
import GitHubIcon from './icons/GitHubIcon'
import { portfolioData } from '../data/portfolioData'
import type { CaseStudyAccent } from '../data/portfolioData'

/** The three deep-dive views available for each project. */
type TabId = 'overview' | 'architecture' | 'highlights'

/** Tab metadata. */
const tabs: readonly { id: TabId; label: string; icon: typeof Layers }[] = [
  { id: 'overview', label: 'Overview', icon: Layers },
  { id: 'architecture', label: 'Architecture & Cloud Stack', icon: Cloud },
  { id: 'highlights', label: 'Key Engineering Highlights', icon: Cpu },
]

/** Per-project accent tokens. */
const accentStyles: Record<
  CaseStudyAccent,
  {
    readonly badge: string
    readonly frame: string
    readonly text: string
    readonly dot: string
    readonly chip: string
    readonly activeTab: string
  }
> = {
  amber: {
    badge: 'border-amber-300 bg-amber-100/80 text-amber-800',
    frame: 'hover:border-amber-600',
    text: 'text-amber-600',
    dot: 'bg-amber-600',
    chip: 'border-zinc-300 bg-stone-50 text-zinc-700 hover:border-amber-600',
    activeTab: 'border-amber-600 text-amber-600',
  },
  bronze: {
    badge: 'border-amber-300 bg-amber-100/80 text-amber-800',
    frame: 'hover:border-amber-700',
    text: 'text-amber-700',
    dot: 'bg-amber-700',
    chip: 'border-zinc-300 bg-stone-50 text-zinc-700 hover:border-amber-700',
    activeTab: 'border-amber-700 text-amber-700',
  },
}

const INITIAL_TIME_SECONDS = 10

/**
 * CaseStudies
 *
 * Featured-work carousel section with live 10s countdown, interactive hover pause,
 * glassmorphic styling, and Light Minimal Sans typography hierarchy.
 */
function CaseStudies() {
  const { caseStudies } = portfolioData
  const [activeProjectId, setActiveProjectId] = useState(caseStudies[0].id)
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [isPaused, setIsPaused] = useState(false)
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_SECONDS)

  const activeIndex = caseStudies.findIndex((entry) => entry.id === activeProjectId)
  const project = caseStudies[activeIndex] ?? caseStudies[0]
  const styles = accentStyles[project.accent]

  const goToNextProject = useCallback(() => {
    const nextIndex = (activeIndex + 1) % caseStudies.length
    setActiveProjectId(caseStudies[nextIndex].id)
    setActiveTab('overview')
    setTimeLeft(INITIAL_TIME_SECONDS)
  }, [activeIndex, caseStudies])

  // Handles 1-second countdown ticks when not paused
  useEffect(() => {
    if (isPaused) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          goToNextProject()
          return INITIAL_TIME_SECONDS
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPaused, goToNextProject])

  const handleManualSelect = (id: string) => {
    setActiveProjectId(id)
    setActiveTab('overview')
    setTimeLeft(INITIAL_TIME_SECONDS)
  }

  return (
    <section id="case-studies" className="w-full px-6 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        {/* Section Heading */}
        <div className="flex flex-col items-center gap-2 text-center">
<span className="inline-flex items-center border border-zinc-200/80 bg-white/70 px-3 py-1 backdrop-blur-md font-sans text-xs font-normal uppercase tracking-[0.25em] text-zinc-900 shadow-sm">            Featured Work
          </span>
          <h2 className="font-sans text-3xl font-extralight tracking-tight text-zinc-950 sm:text-4xl md:text-5xl">
            Case Studies
          </h2>
          <p className="max-w-2xl font-sans text-base font-light leading-relaxed text-zinc-800 sm:text-lg">
            Production builds tracing the full engineering lifecycle — from interactive UI
            architecture to secure cloud deployment.
          </p>
        </div>

        {/* Project Carousel Controls & Switcher */}
        <div className="flex flex-col items-center gap-4">
          <div
            role="group"
            aria-label="Select a case study"
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {caseStudies.map((entry) => {
              const isActive = entry.id === project.id
              return (
                <button
                  key={entry.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => handleManualSelect(entry.id)}
                  className={`rounded-none border px-5 py-2 font-sans text-xs font-light uppercase tracking-[0.25em] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 ${
                    isActive
                      ? 'border-amber-600 bg-amber-600 text-white shadow-sm'
                      : 'border-zinc-300/80 bg-white/90 text-zinc-600 backdrop-blur-sm hover:border-amber-600 hover:text-amber-600'
                  }`}
                >
                  {entry.name}
                </button>
              )
            })}
          </div>

          {/* Pause / Play Indicator Bar with Live Countdown */}
          <div className="flex items-center gap-3 font-sans text-[11px] font-light uppercase tracking-widest text-zinc-400">
            <span>[ Slide {activeIndex + 1} / {caseStudies.length} ]</span>
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="inline-flex items-center gap-1.5 border border-zinc-200 bg-white/80 px-2.5 py-1 text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900"
              title={isPaused ? 'Resume auto-rotation' : 'Pause auto-rotation'}
            >
              {isPaused ? (
                <>
                  <Play className="h-3 w-3 text-amber-600" />
                  <span>Paused ({timeLeft}s)</span>
                </>
              ) : (
                <>
                  <Pause className="h-3 w-3 text-zinc-700" />
                  <span>Auto ({timeLeft}s)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Glassmorphic Project Detail Card */}
        <motion.article
          key={project.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className={`rounded-none border border-zinc-200/80 bg-white/90 shadow-sm backdrop-blur-md transition-colors duration-300 ${styles.frame}`}
        >
          <header className="flex flex-col gap-5 border-b border-zinc-200/80 p-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-3">
              <span
                className={`inline-flex w-fit items-center gap-2 rounded-none border px-3 py-1 font-sans text-xs font-light uppercase tracking-[0.25em] ${styles.badge}`}
              >
                {project.subtitle}
              </span>
              <h3 className="font-sans text-2xl font-light tracking-tight text-zinc-950 sm:text-3xl md:text-4xl">
                {project.name}
              </h3>
              <p
                className={`font-sans text-xs font-light uppercase tracking-[0.25em] ${styles.text}`}
              >
                {project.role}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-none border border-amber-600 bg-white/90 px-6 py-3 font-sans text-xs font-medium uppercase tracking-wider text-amber-600 transition-all duration-300 hover:bg-amber-50 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                >
                  <ExternalLink className="h-4 w-4" />
                  Visit live site
                </a>
              ) : null}

              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-none border border-zinc-950 bg-zinc-950 px-6 py-3 font-sans text-xs font-medium uppercase tracking-wider text-white transition-all duration-300 hover:bg-zinc-800 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                >
                  <GitHubIcon className="h-4 w-4" />
                  View repository
                </a>
              ) : null}
            </div>
          </header>

          {/* Tabs Navigation */}
          <div
            role="tablist"
            aria-label={`${project.name} details`}
            className="flex flex-wrap gap-x-8 border-b border-zinc-200/80 px-6"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = tab.id === activeTab
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`tab-${project.id}-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${project.id}-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 whitespace-nowrap rounded-none border-b-2 py-4 font-sans text-xs font-light uppercase tracking-[0.25em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 ${
                    isActive
                      ? styles.activeTab
                      : 'border-transparent text-zinc-700 hover:text-zinc-950'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab Panel Content */}
          <div
            role="tabpanel"
            id={`panel-${project.id}-${activeTab}`}
            aria-labelledby={`tab-${project.id}-${activeTab}`}
            className="p-6"
          >
            <motion.div
              key={`${project.id}-${activeTab}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex flex-col gap-6"
            >
              {activeTab === 'overview' ? (
                <p className="max-w-3xl text-pretty font-sans text-base font-light leading-relaxed text-zinc-800 sm:text-lg">
                  {project.summary}
                </p>
              ) : null}

              {activeTab === 'architecture' ? (
                <>
                  <ul className="flex flex-col gap-3">
                    {project.architecture.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 font-sans text-sm font-light text-zinc-800 sm:text-base"
                      >
                        <span
                          aria-hidden="true"
                          className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-none ${styles.dot}`}
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col gap-3">
                    <h4 className="font-sans text-xs font-light uppercase tracking-[0.25em] text-zinc-700">
                      Stack
                    </h4>
                    <ul className="flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <li
                          key={tech}
                          className={`rounded-none border px-3 py-1 font-sans text-xs font-light transition-colors duration-300 ${styles.chip}`}
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : null}

              {activeTab === 'highlights' ? (
                <ul className="flex flex-col gap-3">
                  {project.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-3 font-sans text-sm font-light text-zinc-800 sm:text-base"
                    >
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${styles.text}`}
                        aria-hidden="true"
                      />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </motion.div>
          </div>
        </motion.article>
      </div>
    </section>
  )
}

export default CaseStudies