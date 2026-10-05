import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import GitHubIcon from './icons/GitHubIcon'
import { portfolioData } from '../data/portfolioData'

/** Tracks the profile-photo lifecycle so the frame can degrade gracefully. */
type ImageStatus = 'loading' | 'loaded' | 'error'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

/**
 * Hero
 *
 * Centered editorial masthead sitting on the interactive wave field: a sharp
 * amber status badge, slender minimal typography, a glassmorphic metadata card,
 * and unified action buttons.
 */
function Hero() {
  const { header, relocation, github } = portfolioData
  const [imageStatus, setImageStatus] = useState<ImageStatus>('loading')

  const badge = `PORTFOLIO / 2026  · FULL-STACK ARCHITECTURE`

  const metrics: readonly {
    label: string
    value: string
    valueClassName: string
  }[] = [
    {
      label: 'Availability',
      value: 'Available now',
      valueClassName: 'font-sans text-xl font-normal text-zinc-950 md:text-2xl',
    },
    {
      label: 'Nationality',
      value: relocation.nationality,
      valueClassName: 'font-sans text-sm font-light text-zinc-600 md:text-base',
    },
    {
      label: 'Languages',
      value: "Polish (native), Spanish (Fluent), English (Fluent)",
      valueClassName: 'font-sans text-sm font-light text-zinc-900 md:text-base',
    },
    {
      label: 'Work style',
      value: 'Remote or hybrid',
      valueClassName: 'font-sans text-sm font-light text-zinc-700 md:text-base',
    },
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-8 md:py-16 pt-24"
      id="hero"
    >
      {/* Scaled Status Badge */}
      <motion.span
        variants={itemVariants}
        className="inline-block rounded-none border border-amber-300 bg-amber-100/80 px-4 py-2 font-sans text-xs font-light uppercase tracking-[0.25em] text-amber-800 backdrop-blur-sm md:text-sm mt-10"
      >
        [ {badge} ]
      </motion.span>

      {/* Enlarged Core Typography Block */}
      <motion.div
        variants={itemVariants}
        className="mx-auto mt-8 max-w-5xl px-4 text-center"
      >
        <h1 className="font-sans text-5xl font-extralight tracking-tight text-zinc-950 sm:text-7xl md:text-8xl leading-none">
          {header.name}
        </h1>
        <p className="my-4 font-sans text-xs font-light uppercase tracking-[0.25em] text-amber-600 sm:text-sm md:text-base">
          {header.title.toUpperCase()}
        </p>
        <p className="mx-auto max-w-3xl font-sans text-base font-light text-zinc-800 sm:text-lg md:text-xl leading-relaxed">
          {header.headline}
        </p>
      </motion.div>

      {/* Glassmorphic Metadata & Photo Card */}
      <motion.div
        variants={itemVariants}
        className="mx-auto my-12 w-full max-w-4xl rounded-none border border-zinc-200/80 bg-white/90 p-8 text-left shadow-sm backdrop-blur-md"
      >
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
          {/* Scaled Photo Frame */}
          <div className="relative flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-none border border-zinc-300 bg-zinc-50 font-sans text-xs font-light text-zinc-500 md:h-48 md:w-48">
            {imageStatus !== 'error' ? (
              <img
                src={header.profileImage}
                alt={`Portrait of ${header.name}`}
                loading="lazy"
                decoding="async"
                onLoad={() => setImageStatus('loaded')}
                onError={() => setImageStatus('error')}
                className={`h-full w-full object-cover transition-opacity duration-500 ${
                  imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ) : null}

            {imageStatus === 'loading' ? (
              <span className="absolute inset-0 flex animate-pulse items-center justify-center bg-zinc-50 font-sans text-xs font-light text-zinc-500">
                LOADING…
              </span>
            ) : null}

            {imageStatus === 'error' ? (
              <span className="px-2 text-center font-sans text-xs font-light leading-relaxed text-zinc-500">
                ESTERA
                <br />
                BULKIEWICZ
              </span>
            ) : null}
          </div>

          {/* Scaled Metadata Grid */}
          <dl className="grid w-full grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="flex flex-col gap-1 border-b border-zinc-200/80 pb-3"
              >
                <dt className="font-sans text-xs font-light uppercase tracking-[0.25em] text-zinc-800">
                  {metric.label}
                </dt>
                <dd className={metric.valueClassName}>{metric.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </motion.div>

      {/* Prominent Action Buttons (Unified Weights & Styles) */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col items-center justify-center gap-4 sm:flex-row"
      >
        <a
          href="#case-studies"
          className="inline-flex items-center gap-3 rounded-none bg-zinc-950 px-8 py-4 font-sans text-xs font-medium uppercase tracking-wider text-white transition-all duration-300 hover:bg-zinc-800 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
        >
          View Case Studies
        </a>
        <a
          href={github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 rounded-none border border-zinc-300 bg-white/80 px-8 py-4 font-sans text-xs font-medium uppercase tracking-wider text-zinc-800 backdrop-blur-sm transition-all duration-300 hover:border-amber-600 hover:text-amber-700 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
        >
          <GitHubIcon className="h-5 w-5" />
          GitHub Profile
        </a>
      </motion.div>
    </motion.div>
  )
}

export default Hero