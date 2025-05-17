import React, { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Menu items and toggle
  const menuItems = [
    { label: 'Home', to: '#home' },
    { label: 'Education', to: '#education' },
    { label: 'Experience', to: '#experience' },
    { label: 'Skills', to: '#skills' },
    { label: 'Projects', to: '#project' },
    { label: 'About', to: '#about' },
    { label: 'Contact', to: '#contact' },
  ];
  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = e => {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        buttonRef.current && !buttonRef.current.contains(e.target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Detect scroll to apply blur background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={
        `fixed top-0 left-0 w-full z-50 transition-all duration-300 ` +
        (scrolled
          ? 'bg-black/50 backdrop-blur-md shadow-md'
          : 'bg-transparent')
      }
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Branding */}
        <a href="#" className="text-white text-2xl font-semibold hover:text-orange-500 transition-colors">
          Anshul Patel
        </a>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8">
          {menuItems.map(item => (
            <li key={item.label} className="relative group">
              <a
                href={item.to}
                className="text-white text-lg font-medium hover:text-orange-400 transition-colors"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 block h-0.5 w-0 bg-orange-400 group-hover:w-full transition-all duration-300" />
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger */}
        <button
          ref={buttonRef}
          onClick={toggleMobileMenu}
          className="md:hidden text-white focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={
          `md:hidden bg-black/40 backdrop-blur-sm overflow-hidden transition-all duration-500 ` +
          (mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0')
        }
      >
        <ul className="flex flex-col px-4 py-4 space-y-2">
          {menuItems.map(item => (
            <li key={item.label}>
              <a
                href={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-white text-lg font-medium py-2 px-4 rounded hover:bg-black/20 hover:scale-105 transition-transform transition-colors duration-200"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}