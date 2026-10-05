import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { portfolioData } from '../data/portfolioData'

const listVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

/**
 * Experience
 *
 * The professional timeline as a stack of sharp white cards: an indexed
 * metadata column beside the narrative and highlights.
 */
export function Experience() {
  return (
    <section id="experience" className="w-full px-6 py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        {/* Section heading */}
        <div className="flex flex-col items-center gap-2 text-center">
        <span className="inline-flex items-center border border-zinc-200/80 bg-white/70 px-3 py-1 backdrop-blur-md font-sans text-xs font-normal uppercase tracking-[0.25em] text-zinc-900 shadow-sm">            Timeline
          </span>
          <h2 className="font-sans text-3xl font-extralight tracking-tight text-zinc-950 sm:text-4xl md:text-5xl">
            Experience
          </h2>
          <p className="max-w-2xl font-sans text-base font-light leading-relaxed text-zinc-800 sm:text-lg">
            Where I've worked and what I've built, from freelance client projects to engineering teams.
          </p>
        </div>

        <motion.ol
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="flex flex-col gap-6"
        >
          {portfolioData.experience.map((entry, index) => (
            <motion.li
              key={`${entry.company}-${entry.period}`}
              variants={rowVariants}
              className="group grid gap-6 border border-zinc-200/80 bg-white/90 p-8 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-amber-600/50 hover:shadow-md lg:grid-cols-12 lg:gap-10"
            >
              {/* Left Metadata Column */}
              <div className="flex flex-col gap-2.5 lg:col-span-4">
                <span className="font-sans text-xs font-medium uppercase tracking-[0.25em] text-amber-600">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-sans text-xl font-normal tracking-tight text-zinc-950 sm:text-2xl">
                  {entry.company}
                </h3>
                <p className="font-sans text-sm font-medium uppercase tracking-wider text-amber-700">
                  {entry.role}
                </p>
                <div className="mt-1 flex flex-col gap-1 border-t border-zinc-100 pt-3">
                  <p className="font-sans text-xs font-light uppercase tracking-[0.2em] text-zinc-700">
                    {entry.period}
                  </p>
                  <p className="font-sans text-xs font-light tracking-wide text-zinc-400">
                    {entry.location}
                  </p>
                </div>
              </div>

              {/* Right Content Column */}
              <div className="flex flex-col gap-4 lg:col-span-8 lg:border-l lg:border-zinc-100 lg:pl-8">
                <p className="text-pretty font-sans text-base font-light leading-relaxed text-zinc-700 sm:text-lg">
                  {entry.summary}
                </p>

                <ul className="flex flex-col gap-3 pt-2">
                  {entry.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-3 font-sans text-sm font-light leading-relaxed text-zinc-700 sm:text-base"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-none bg-amber-600"
                      />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  )
}

export default Experience