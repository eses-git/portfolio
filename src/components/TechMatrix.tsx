import { motion } from 'framer-motion'
import { Code2, Server, ShieldCheck, CheckCircle2, type LucideIcon } from 'lucide-react'
import { portfolioData } from '../data/portfolioData'

// Map icon string keys from portfolioData.ts to Lucide icon components
const iconMap: Record<string, LucideIcon> = {
  code: Code2,
  cloud: Server,
  shield: ShieldCheck,
}

export function TechMatrix() {
  return (
    <section id="capabilities" className="w-full px-6 py-20 bg-stone-50/50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col items-center gap-2 text-center">
<span className="inline-flex items-center border border-zinc-200/80 bg-white/70 px-3 py-1 backdrop-blur-md font-sans text-xs font-normal uppercase tracking-[0.25em] text-zinc-900 shadow-sm">            System Stack
          </span>
          <h2 className="font-sans text-3xl font-extralight tracking-tight text-zinc-950 sm:text-4xl md:text-5xl">
            Capabilities Matrix
          </h2>
          <p className="max-w-2xl font-sans text-base font-light leading-relaxed text-zinc-800 sm:text-lg">
            Core technologies and infrastructure layers powering scalable, high-availability web applications.
          </p>
        </div>

        {/* Matrix Grid Driven directly from portfolioData.ts */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {portfolioData.techMatrix.map((category, idx) => {
            const IconComponent = iconMap[category.icon] || Code2
            const number = String(idx + 1).padStart(2, '0')

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group flex flex-col justify-between border border-zinc-200/80 bg-white/90 p-8 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-amber-600/50 hover:shadow-md"
              >
                <div className="flex flex-col gap-6">
                  {/* Category Header: Number Badge + Title */}
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center border border-amber-600/30 bg-amber-50/50 text-amber-700">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <span className="font-sans text-xs font-semibold uppercase tracking-widest text-zinc-700">
                        {category.title}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-medium text-amber-700/80">
                      {number}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="font-sans text-sm font-light leading-relaxed text-zinc-800">
                    {category.description}
                  </p>
                </div>

                {/* Skill Items List */}
                <div className="mt-8 flex flex-col gap-2.5 border-t border-zinc-100 pt-6">
                  <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-700">
                    Technologies & Tools
                  </span>
                  <ul className="grid grid-cols-1 gap-2">
                    {category.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 border border-zinc-200/70 bg-stone-50/70 px-3 py-1.5 font-sans text-xs font-normal text-zinc-800 transition-colors hover:border-amber-600/50 hover:bg-white"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-amber-700" />
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TechMatrix