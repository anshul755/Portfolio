import { useState, useEffect, useRef } from "react"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeHash, setActiveHash] = useState(() => window.location.hash || '#home')
  const menuRef = useRef(null)
  const buttonRef = useRef(null)

  const menuItems = [
    { label: "Home", to: "#home" },
    { label: "Education", to: "#education" },
    { label: "Experience", to: "#experience" },
    { label: "Skills", to: "#skills" },
    { label: "Projects", to: "#project" },
    { label: "About", to: "#about" },
    { label: "Contact", to: "#contact" },
  ]

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev)

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Navbar background on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Update hash on URL change (clicks)
  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash || '#home')
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Scroll spy: update activeHash based on scroll position
  useEffect(() => {
    const sections = menuItems.map(item => document.querySelector(item.to))
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6, // 60% of section visible
    }

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveHash(`#${entry.target.id}`)
          // Update URL hash without scrolling
          window.history.replaceState(null, '', `#${entry.target.id}`)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)
    sections.forEach(sec => sec && observer.observe(sec))

    return () => {
      sections.forEach(sec => sec && observer.unobserve(sec))
    }
  }, [menuItems])

  return (
    <nav
      className={
        `fixed top-0 left-0 w-full z-50 transition-all duration-300 ` +
        (scrolled ? "bg-black/60 backdrop-blur-lg shadow-xl border-b border-orange-500/20" : "bg-transparent")
      }
    >
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center flex-shrink-0">
            <a
              href="#home"
              className="text-white text-xl lg:text-2xl font-semibold tracking-wide hover:text-orange-400 transition-colors duration-300"
            >
              Anshul Patel
            </a>
          </div>

          <div className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8 bg-black/20 backdrop-blur-sm rounded-full px-8 py-3 border border-orange-500/20">
              <div className="w-6 h-6 flex-shrink-0">
                <img
                  src="/Logo.png"
                  alt="Logo"
                  className="w-6 h-6 object-contain brightness-0.8 invert-1"
                />
              </div>
              <ul className="flex items-center space-x-8">
                {menuItems.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.to}
                      className={`relative text-base font-medium transition-all duration-300 py-2 px-3 rounded-lg group ${
                        item.to === activeHash ? "text-orange-400" : "text-white hover:text-orange-400"
                      }`}
                    >
                      <span className="relative z-10">{item.label}</span>
                      <span className="absolute inset-0 bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
                      <span
                        className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-orange-400 transition-all duration-300 ${
                          item.to === activeHash ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      ></span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            ref={buttonRef}
            onClick={toggleMobileMenu}
            className="lg:hidden text-white focus:outline-none hover:text-orange-400 transition-colors duration-300 p-2"
          >
            <div className="w-6 h-6 relative">
              <span
                className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                  mobileMenuOpen ? "rotate-45 top-2.5" : "top-1"
                }`}
              />
              <span
                className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 top-2.5 ${
                  mobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                  mobileMenuOpen ? "-rotate-45 top-2.5" : "top-4"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      <div
        ref={menuRef}
        className={`lg:hidden bg-black/80 backdrop-blur-md border-t border-orange-500/20 transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-6 space-y-1">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-lg font-medium py-3 px-4 rounded-lg transition-all duration-300 ${
                item.to === activeHash
                  ? "text-orange-400 bg-orange-500/10"
                  : "text-white hover:text-orange-400 hover:bg-orange-500/10"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span>{item.label}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
