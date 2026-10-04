import { useState, useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import HeroCanvas from './components/canvas/HeroCanvas'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Projects from './components/sections/Projects'
import Certificates from './components/sections/Certificates'
import Content from './components/sections/Content'
import Contact from './components/sections/Contact'

export default function App() {
  const [activeSection, setActiveSection] = useState('hero')

  // Smooth scroll helper matching IDs
  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(sectionId)
    }
  }

  // Active Section Scroll Spy utilizing IntersectionObserver
  useEffect(() => {
    const sections = ['hero', 'about', 'projects', 'certificates', 'content', 'contact']
    
    const observerOptions = {
      root: null,
      rootMargin: '-35% 0px -35% 0px', // Triggers when section occupies middle region of screen
      threshold: 0,
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id)
        if (el) observer.unobserve(el)
      })
    }
  }, [])

  return (
    <div className="relative min-h-screen text-white bg-dark-bg selection:bg-brand-blue/30 selection:text-white">
      {/* Sticky Header Nav */}
      <Navbar activeSection={activeSection} onNavClick={handleNavClick} />

      {/* Hero Container housing the interactive 3D Canvas */}
      <div id="hero" className="relative w-full min-h-screen flex items-center justify-center">
        {/* Full-screen R3F interactive backdrop */}
        <HeroCanvas />
        {/* Responsive layout overlay */}
        <Hero 
          onExploreProjects={() => handleNavClick('projects')} 
          onContactClick={() => handleNavClick('contact')} 
        />
      </div>

      {/* Main content grid flow */}
      <main className="w-full relative">
        <About />
        <Projects />
        <Certificates />
        <Content />
        <Contact />
      </main>

      {/* Sleek Dark Mode Footer */}
      <footer className="w-full bg-[#050508] border-t border-white/5 py-8 text-center text-xs text-gray-500 font-mono">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 ScaleWithAbhi. Engineered for high performance & scalability.</p>
          <div className="flex gap-6">
            <a href="https://github.com/GujarAbhishek777" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue transition-colors">GitHub</a>
            <a href="https://linkedin.com/in/abhishek-gujar-89a225192/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-purple transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
