import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Award, ExternalLink, GraduationCap, Languages, Pause, Play } from 'lucide-react'
import { portfolioData } from '../data/portfolioData'
import type { CertificationAccent } from '../data/portfolioData'

/** Per-certificate accent tokens, mirroring the case-study palette. */
const accentStyles: Record<
  CertificationAccent,
  { readonly badge: string; readonly frame: string; readonly text: string }
> = {
  amber: {
    badge: 'border-amber-300 bg-amber-100/80 text-amber-800',
    frame: 'hover:border-amber-600',
    text: 'text-amber-600',
  },
  bronze: {
    badge: 'border-amber-300 bg-amber-100/80 text-amber-800',
    frame: 'hover:border-amber-700',
    text: 'text-amber-700',
  },
  emerald: {
    badge: 'border-emerald-300 bg-emerald-100/80 text-emerald-800',
    frame: 'hover:border-emerald-600',
    text: 'text-emerald-600',
  },
}

const INITIAL_TIME_SECONDS = 10

type ImageStatus = 'loading' | 'loaded' | 'error'

/**
 * A single certificate preview frame with a graceful loading/error fallback,
 * matching the Hero photo-frame degradation pattern.
 */
function CertificatePreview({
  image,
  title,
  issuer,
  alt,
}: {
  readonly image?: string
  readonly title: string
  readonly issuer: string
  readonly alt: string
}) {
  const [status, setStatus] = useState<ImageStatus>(image ? 'loading' : 'error')

  return (
    <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-none border border-zinc-200 bg-white">
      {status !== 'error' && image ? (
        <img
          src={image}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`h-full w-full object-contain transition-opacity duration-500 ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : null}

      {status === 'loading' ? (
        <span className="absolute inset-0 flex animate-pulse items-center justify-center bg-zinc-50 font-sans text-xs font-light uppercase tracking-[0.25em] text-zinc-400">
          Loading…
        </span>
      ) : null}

      {status === 'error' ? (
        <div className="flex flex-col items-center gap-3 px-6 text-center">
          <Award className="h-8 w-8 text-amber-600" aria-hidden="true" />
          <span className="font-sans text-lg font-light text-zinc-900">{title}</span>
          <span className="font-sans text-xs font-light uppercase tracking-[0.25em] text-zinc-500">
            {issuer}
          </span>
        </div>
      ) : null}
    </div>
  )
}

/**
 * Certifications
 *
 * Professional credentials carousel with the same auto-advance countdown,
 * interactive hover-pause, and manual selector behaviour as the Case Studies
 * section, using the shared glassmorphic light-minimal design system.
 */
function Certifications() {
  const { certifications, education, languages } = portfolioData
  const [activeCertId, setActiveCertId] = useState(certifications[0].id)
  const [isPaused, setIsPaused] = useState(false)
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_SECONDS)

  const activeIndex = certifications.findIndex((entry) => entry.id === activeCertId)
  const cert = certifications[activeIndex] ?? certifications[0]
  const styles = accentStyles[cert.accent]

  const goToNextCert = useCallback(() => {
    const nextIndex = (activeIndex + 1) % certifications.length
    setActiveCertId(certifications[nextIndex].id)
    setTimeLeft(INITIAL_TIME_SECONDS)
  }, [activeIndex, certifications])

  useEffect(() => {
    if (isPaused) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          goToNextCert()
          return INITIAL_TIME_SECONDS
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPaused, goToNextCert])

  const handleManualSelect = (id: string) => {
    setActiveCertId(id)
    setTimeLeft(INITIAL_TIME_SECONDS)
  }

  return (
    <section id="certifications" className="w-full px-6 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        {/* Section Heading */}
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="inline-flex items-center border border-zinc-200/80 bg-white/70 px-3 py-1 backdrop-blur-md font-sans text-xs font-normal uppercase tracking-[0.25em] text-zinc-900 shadow-sm">
            Credentials
          </span>
          <h2 className="font-sans text-3xl font-extralight tracking-tight text-zinc-950 sm:text-4xl md:text-5xl">
            Certifications & Education
          </h2>
          <p className="max-w-2xl font-sans text-base font-light leading-relaxed text-zinc-800 sm:text-lg">
            Verified certificates, formal education, and language proficiency — from freeCodeCamp and Cisco
            Networking Academy to technical schooling in Poland.
          </p>
        </div>

        {/* Certification Carousel Controls & Switcher */}
        <div className="flex flex-col items-center gap-4">
          <div
            role="group"
            aria-label="Select a certification"
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {certifications.map((entry) => {
              const isActive = entry.id === cert.id
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
                  {entry.shortLabel ?? entry.issuer}
                </button>
              )
            })}
          </div>

          {/* Pause / Play Indicator Bar with Live Countdown */}
          <div className="flex items-center gap-3 font-sans text-[11px] font-light uppercase tracking-widest text-zinc-400">
            <span>
              [ Slide {activeIndex + 1} / {certifications.length} ]
            </span>
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

        {/* Glassmorphic Certificate Detail Card */}
        <motion.article
          key={cert.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className={`rounded-none border border-zinc-200/80 bg-white/90 shadow-sm backdrop-blur-md transition-colors duration-300 ${styles.frame}`}
        >
          <header className="flex flex-col gap-5 border-b border-zinc-200/80 p-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-3">
              <span
                className={`inline-flex w-fit items-center gap-2 rounded-none border px-3 py-1 font-sans text-xs font-light uppercase tracking-[0.25em] ${styles.badge}`}
              >
                <Award className="h-3.5 w-3.5" aria-hidden="true" />
                {cert.issuer}
              </span>
              <h3 className="font-sans text-2xl font-light tracking-tight text-zinc-950 sm:text-3xl md:text-4xl">
                {cert.title}
              </h3>
              {cert.date ? (
                <p className={`font-sans text-xs font-light uppercase tracking-[0.25em] ${styles.text}`}>
                  Completed {cert.date}
                </p>
              ) : null}
            </div>

            {cert.verificationUrl ? (
              <a
                href={cert.verificationUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-none border border-amber-600 bg-white/90 px-6 py-3 font-sans text-xs font-medium uppercase tracking-wider text-amber-600 transition-all duration-300 hover:bg-amber-50 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
              >
                <ExternalLink className="h-4 w-4" />
                Verify certificate
              </a>
            ) : null}
          </header>

          <div className="grid md:grid-cols-5">
            {/* Certificate Preview */}
            <div className="p-6 md:col-span-3">
              <CertificatePreview
                image={cert.image}
                title={cert.title}
                issuer={cert.issuer}
                alt={`${cert.title} certificate`}
              />
            </div>

            {/* Certificate Metadata */}
            <div className="flex flex-col gap-5 border-t border-zinc-200/80 p-6 md:col-span-2 md:border-l md:border-t-0">
              <div className="flex flex-col gap-2">
                <h4 className="font-sans text-xs font-light uppercase tracking-[0.25em] text-zinc-700">
                  Issued by
                </h4>
                <p className="font-sans text-base font-light text-zinc-900">{cert.issuer}</p>
              </div>
              {cert.date ? (
                <div className="flex flex-col gap-2">
                  <h4 className="font-sans text-xs font-light uppercase tracking-[0.25em] text-zinc-700">
                    Completed
                  </h4>
                  <p className="font-sans text-base font-light text-zinc-900">{cert.date}</p>
                </div>
              ) : null}
              <div className="flex flex-col gap-2">
                <h4 className="font-sans text-xs font-light uppercase tracking-[0.25em] text-zinc-700">
                  Verification
                </h4>
                {cert.verificationUrl ? (
                  <a
                    href={cert.verificationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`break-all font-sans text-sm font-light underline-offset-4 transition-colors hover:underline ${styles.text}`}
                  >
                    {cert.verificationUrl}
                  </a>
                ) : (
                  <p className="font-sans text-sm font-light text-zinc-600">
                    Verification available directly from {cert.issuer}.
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.article>

        {/* Education & Languages */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Formal education */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col gap-6 border border-zinc-200/80 bg-white/90 p-8 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-amber-600/50 hover:shadow-md"
          >
            <div className="flex items-center gap-4 border-b border-zinc-100 pb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-amber-600/30 bg-amber-50/50 text-amber-700">
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-zinc-700">
                Education
              </h3>
            </div>

            <ul className="flex flex-col gap-6">
              {education.map((entry) => (
                <li
                  key={`${entry.institution}-${entry.period}`}
                  className="flex flex-col gap-1.5"
                >
                  <span className="font-sans text-lg font-light tracking-tight text-zinc-950">
                    {entry.credential}
                  </span>
                  <span className="font-sans text-sm font-light leading-relaxed text-zinc-700">
                    {entry.institution}
                  </span>
                  <span className="font-sans text-xs font-light uppercase tracking-[0.2em] text-zinc-500">
                    {entry.location} · {entry.period}
                  </span>
                </li>
              ))}
            </ul>
          </motion.article>

          {/* Language proficiency */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
            className="flex flex-col gap-6 border border-zinc-200/80 bg-white/90 p-8 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-amber-600/50 hover:shadow-md"
          >
            <div className="flex items-center gap-4 border-b border-zinc-100 pb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-amber-600/30 bg-amber-50/50 text-amber-700">
                <Languages className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-zinc-700">
                Languages
              </h3>
            </div>

            <ul className="flex flex-wrap gap-2">
              {languages.map((language) => (
                <li
                  key={language.name}
                  className="flex items-center gap-2 border border-zinc-300/80 bg-stone-50/90 px-3 py-1 font-sans text-xs font-normal text-zinc-900 transition-colors hover:border-amber-600"
                >
                  <span>{language.name}</span>
                  <span className="text-zinc-500">({language.level})</span>
                </li>
              ))}
            </ul>
          </motion.article>
        </div>
      </div>
    </section>
  )
}

export default Certifications

