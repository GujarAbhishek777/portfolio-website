import { useState, useEffect } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'

interface NavbarProps {
  activeSection: string
  onNavClick: (sectionId: string) => void
}

export default function Navbar({ activeSection, onNavClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navItems = [
    { id: 'hero', name: 'Home' },
    { id: 'about', name: 'About' },
    { id: 'projects', name: 'Projects' },
    { id: 'certificates', name: 'Certificates' },
    { id: 'content', name: 'Content' },
    { id: 'contact', name: 'Contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'py-4 bg-dark-bg/85 backdrop-blur-md border-b border-dark-border'
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => onNavClick('hero')}
          className="text-xl md:text-2xl font-black tracking-tighter text-white hover:text-brand-blue transition-colors duration-300 flex items-center gap-1 cursor-pointer"
        >
          ScaleWith<span className="text-brand-blue">Abhi</span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavClick(item.id)}
              className={`text-sm font-medium tracking-wide uppercase transition-all duration-300 relative py-1 cursor-pointer ${
                activeSection === item.id
                  ? 'text-brand-blue font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.name}
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-blue shadow-[0_0_8px_#00f2fe] rounded-full" />
              )}
            </button>
          ))}

          {/* Call-to-action button */}
          <a
            href="https://linkedin.com/in/abhishek-gujar-89a225192/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono uppercase tracking-widest text-brand-green rounded-lg glass-panel-interactive border-brand-green/30"
          >
            LinkedIn
            <ArrowUpRight size={12} />
          </a>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-white focus:outline-none cursor-pointer"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-dark-bg/95 backdrop-blur-lg border-b border-dark-border py-6 px-8 flex flex-col gap-6 md:hidden">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavClick(item.id)
                setIsOpen(false)
              }}
              className={`text-left text-lg font-medium tracking-wide uppercase transition-all py-2 border-b border-white/5 cursor-pointer ${
                activeSection === item.id ? 'text-brand-blue' : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.name}
            </button>
          ))}
          <a
            href="https://linkedin.com/in/abhishek-gujar-89a225192/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center px-4 py-3 text-sm font-mono uppercase tracking-widest text-brand-green rounded-lg glass-panel text-brand-green/80 mt-2 block"
          >
            LinkedIn
          </a>
        </div>
      )}
    </nav>
  )
}
