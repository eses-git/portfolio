import React, { useState } from 'react'
import GitHubIcon from './icons/GitHubIcon'
import { portfolioData } from '../data/portfolioData'
import { AnimatedBackgroundWrapper } from './background/golden'

function Footer() {
  const { header, relocation, github } = portfolioData
  const year = new Date().getFullYear()

  // Environment variables from Vite (.env)
  const web3FormsKey = import.meta.env.VITE_WEB3FORMS_KEY || ''
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER 
  const recipientEmail = import.meta.env.VITE_EMAIL

  // Message form state
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const defaultWhatsAppText = encodeURIComponent(
    'Hi Estera, I saw your portfolio and would like to discuss a potential project or opportunity.'
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Unfocus active input element to dismiss virtual keyboard
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: web3FormsKey,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `Portfolio Contact from ${formData.name}`,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitted(true)
        setFormData({ name: '', email: '', message: '' })
        // programmatically reset viewport scroll if iOS left it offset
        window.scrollTo({ top: window.scrollY, behavior: 'smooth' })
      } else {
        setErrorMessage('Something went wrong. Please try again or reach out on WhatsApp.')
      }
    } catch (err) {
      setErrorMessage('Network error. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- CHANGED CLASSNAMES ---
  // We changed 'text-xs' to 'text-base sm:text-xs'
  const inputClassName = "border border-zinc-200 bg-white px-3 py-2 font-sans text-base sm:text-xs text-zinc-900 focus:border-amber-600 focus:outline-none"
  const textareaClassName = "border border-zinc-200 bg-white px-3 py-2 font-sans text-base sm:text-xs text-zinc-900 focus:border-amber-600 focus:outline-none"

  return (
    <footer id="footer" className="w-full border-t border-zinc-200 bg-white">
      <AnimatedBackgroundWrapper className="w-full overflow-hidden py-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6">
          
          {/* Header & Quick Intro */}
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="inline-flex items-center border border-zinc-200/80 bg-white/80 px-3 py-1 font-sans text-xs font-normal uppercase tracking-[0.25em] text-zinc-900 shadow-sm backdrop-blur-md">
              Get In Touch
            </span>
            <h2 className="font-sans text-3xl font-light tracking-tight text-zinc-950 sm:text-4xl md:text-5xl">
              {header.name}
            </h2>
            <p className="max-w-2xl font-sans text-base font-light leading-relaxed text-zinc-600">
              {header.title} — {header.footerdesc}
            </p>
          </div>

          {/* Contact Form & WhatsApp Grid */}
          <div className="grid gap-8 md:grid-cols-5">
            
            {/* Direct Message Form */}
            <div className="flex flex-col gap-4 border border-zinc-200 bg-white/90 p-6 backdrop-blur-sm md:col-span-3">
              <h3 className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-zinc-800">
                Send a Direct Message
              </h3>
              
              {submitted ? (
                <div className="p-4 border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-normal">
                  Thank you! Your message has been sent directly to {recipientEmail}.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={inputClassName}
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={inputClassName}
                    />
                  </div>
                  <textarea
                    required
                    rows={3}
                    placeholder="Your Message..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={textareaClassName}
                  />

                  {errorMessage && (
                    <p className="font-sans text-xs text-red-600">{errorMessage}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-fit border border-zinc-900 bg-zinc-950 px-5 py-2 font-sans text-xs font-normal uppercase tracking-[0.15em] text-white transition-colors duration-200 hover:bg-amber-600 hover:border-amber-600 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Quick Connect & WhatsApp */}
            <div className="flex flex-col justify-between gap-4 border border-zinc-200 bg-white/90 p-6 backdrop-blur-sm md:col-span-2">
              <div className="flex flex-col gap-3">
                <h3 className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-zinc-800">
                  Instant Messaging
                </h3>
                <p className="font-sans text-xs font-light text-zinc-600 leading-relaxed">
                  Prefer instant communication? Connect directly on WhatsApp for real-time inquiries.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${defaultWhatsAppText}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-emerald-600 bg-emerald-600/10 px-4 py-2.5 font-sans text-xs font-normal uppercase tracking-[0.15em] text-emerald-800 transition-colors duration-200 hover:bg-emerald-600 hover:text-white"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  Chat on WhatsApp
                </a>

                <a
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-zinc-200 bg-white px-4 py-2 font-sans text-xs font-normal text-zinc-700 transition-colors duration-200 hover:text-amber-800 hover:border-amber-600"
                >
                  <GitHubIcon className="h-4 w-4" />
                  github.com/eses-git
                </a>
              </div>
            </div>

          </div>

        n

          {/* Bottom Bar */}
          <div className="flex flex-col gap-3 border-t border-zinc-200/80 pt-6 text-center font-sans text-xs font-light uppercase tracking-[0.25em] text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <span>
              © {year} {header.name}
            </span>
            <span>React · TypeScript · Vite · Tailwind CSS</span>
          </div>

        </div>
      </AnimatedBackgroundWrapper>
    </footer>
  )
}

export default Footer