import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Search, ChevronUp, ChevronDown } from 'lucide-react'

interface NavItem {
  label: string
  href: string
}

const navItems: NavItem[] = [
  { label: 'Pillars', href: '#pillars' },
  { label: 'Case Studies', href: '#case-studies' },
  { label: 'Tech Stack', href: '#capabilities' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#footer' },
]

export function Header() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Search States
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [matches, setMatches] = useState<Element[]>([])
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const activeHighlightedEl = useRef<Element | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      setLastScrollY(currentScrollY)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY <= 50) {
        setIsVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [lastScrollY])

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [searchOpen])

  // Clear visual highlights
  const clearHighlights = () => {
    if (activeHighlightedEl.current) {
      activeHighlightedEl.current.classList.remove('bg-amber-200/80', 'ring-2', 'ring-amber-500')
      activeHighlightedEl.current = null
    }
  }

  // Scroll to a specific match index and highlight it
  const navigateToMatch = (index: number, foundMatches: Element[] = matches) => {
    if (foundMatches.length === 0) return

    clearHighlights()

    const targetEl = foundMatches[index]
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      targetEl.classList.add('bg-amber-200/80', 'ring-2', 'ring-amber-500', 'transition-all', 'duration-300', 'rounded-sm')
      activeHighlightedEl.current = targetEl
    }
  }

  // Update matches array whenever search query changes
  const handleInputChange = (value: string) => {
    setSearchQuery(value)
    clearHighlights()

    if (!value.trim()) {
      setMatches([])
      setCurrentMatchIndex(0)
      return
    }

    const query = value.toLowerCase().trim()
    const mainContent = document.querySelector('main') || document.body
    const textElements = Array.from(
      mainContent.querySelectorAll('p, h1, h2, h3, h4, li, span, button, a')
    )

    // Filter all elements containing the search query
    const found = textElements.filter((el) =>
      el.textContent?.toLowerCase().includes(query)
    )

    setMatches(found)
    setCurrentMatchIndex(0)

    if (found.length > 0) {
      navigateToMatch(0, found)
    }
  }

  // Next Match (Cycle forward)
  const handleNextMatch = () => {
    if (matches.length === 0) return
    const nextIdx = (currentMatchIndex + 1) % matches.length
    setCurrentMatchIndex(nextIdx)
    navigateToMatch(nextIdx)
  }

  // Previous Match (Cycle backward)
  const handlePrevMatch = () => {
    if (matches.length === 0) return
    const prevIdx = (currentMatchIndex - 1 + matches.length) % matches.length
    setCurrentMatchIndex(prevIdx)
    navigateToMatch(prevIdx)
  }

  const handleCloseSearch = () => {
    setSearchOpen(false)
    setSearchQuery('')
    setMatches([])
    setCurrentMatchIndex(0)
    clearHighlights()
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    const targetElement = document.querySelector(href)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 right-0 z-50 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-md transition-colors"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Logo / Name */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className={`font-sans text-sm font-normal uppercase tracking-[0.2em] text-zinc-950 transition-colors hover:text-amber-700 ${
              searchOpen ? 'hidden sm:block' : 'block'
            }`}
          >
            Estera Bulkiewicz
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="font-sans text-xs font-light uppercase tracking-[0.2em] text-zinc-700 transition-colors hover:text-amber-700"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Search Bar + Navigation Controls */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: matches.length > 0 ? 280 : 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="flex items-center gap-1.5 overflow-hidden border-b border-zinc-400 bg-transparent py-1"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Search page..."
                      value={searchQuery}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          if (e.shiftKey) handlePrevMatch()
                          else handleNextMatch()
                        }
                      }}
                      className="w-full bg-transparent px-1 font-sans text-xs font-light text-zinc-900 outline-none placeholder:text-zinc-400"
                    />

                    {/* Match Counter Badge (e.g. 1/4) */}
                    {matches.length > 0 && (
                      <span className="shrink-0 font-sans text-[10px] font-medium text-zinc-500">
                        {currentMatchIndex + 1}/{matches.length}
                      </span>
                    )}

                    {/* Next / Prev Arrow Buttons */}
                    {matches.length > 0 && (
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={handlePrevMatch}
                          className="p-0.5 text-zinc-500 hover:text-zinc-900"
                          title="Previous match (Shift+Enter)"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextMatch}
                          className="p-0.5 text-zinc-500 hover:text-zinc-900"
                          title="Next match (Enter)"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleCloseSearch}
                      className="p-0.5 text-zinc-500 hover:text-zinc-900"
                      aria-label="Close search"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {!searchOpen && (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="flex h-9 w-9 items-center justify-center text-zinc-700 transition-colors hover:text-amber-700"
                  aria-label="Open search"
                >
                  <Search className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen)
                if (searchOpen) handleCloseSearch()
              }}
              className="flex h-10 w-10 items-center justify-center text-zinc-800 transition-colors hover:text-amber-700 md:hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 border-b border-zinc-200 bg-white/95 px-6 py-6 backdrop-blur-lg md:hidden"
          >
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="font-sans text-sm font-light uppercase tracking-[0.2em] text-zinc-800 transition-colors hover:text-amber-700"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header