import { motion } from 'framer-motion'
import { Code2, Network, CheckCircle2 } from 'lucide-react'
import { portfolioData } from '../data/portfolioData'

const pillarIcons = {
  'frontend-engineering': Code2,
  'solution-architecture': Network,
}

export function Pillars() {
  return (
    <section id="pillars" className="w-full px-6 py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col items-center gap-2 text-center">
<span className="inline-flex items-center border border-zinc-200/80 bg-white/70 px-3 py-1 backdrop-blur-md font-sans text-xs font-normal uppercase tracking-[0.25em] text-zinc-900 shadow-sm">            Core Expertise
          </span>
          <h2 className="font-sans text-3xl font-extralight tracking-tight text-zinc-950 sm:text-4xl md:text-5xl">
            Engineering Pillars
          </h2>
          <p className="max-w-2xl font-sans text-base font-light leading-relaxed text-zinc-800 sm:text-lg">
            From sub-second user interfaces to cloud infrastructure: two disciplines, one end-to-end perspective.
          </p>
        </div>

        {/* Pillars Cards Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {portfolioData.pillars.map((pillar, idx) => {
            const IconComponent = pillarIcons[pillar.id] || Code2

            return (
              <motion.article
                key={pillar.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group flex flex-col justify-between border border-zinc-200/80 bg-white/90 p-8 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-amber-600/50 hover:shadow-md"
              >
                <div className="flex flex-col gap-6">
                  {/* Icon + Title */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center border border-amber-600/30 bg-amber-50/50 text-amber-700">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="font-sans text-2xl font-light tracking-tight text-zinc-950">
                      {pillar.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="font-sans text-base font-light leading-relaxed text-zinc-800">
                    {pillar.description}
                  </p>
                </div>

                {/* Skills Chips */}
                <div className="mt-8 flex flex-col gap-3 border-t border-zinc-100 pt-6">
                  <span className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-zinc-700">
                    Key Competencies
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {pillar.skills.map((skill) => (
                      <span
                        key={skill}
                        className="flex items-center gap-1.5 border border-zinc-300/80 bg-stone-50/90 px-3 py-1 font-sans text-xs font-normal text-zinc-900 transition-colors hover:border-amber-600 hover:text-amber-800"
                      >
                        <CheckCircle2 className="h-3 w-3 text-amber-700" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Pillars