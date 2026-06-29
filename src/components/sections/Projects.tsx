import { useEffect, useState, useRef } from 'react'
import { fetchProjects } from '../../services/api'
import type { Project } from '../../services/api'
import { ExternalLink, Layers } from 'lucide-react'

// 3D Tilt Card wrapper for the weightless anti-gravity visual effect
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transformStyle, setTransformStyle] = useState('')

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Control the maximum tilt angles (in degrees)
    const maxRotateX = 12
    const maxRotateY = 12

    const rotateX = ((centerY - y) / centerY) * maxRotateX
    const rotateY = ((x - centerX) / centerX) * maxRotateY

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`
    )
  }

  const handlePointerLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
  }

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        transform: transformStyle,
        transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
        transformStyle: 'preserve-3d',
      }}
      className={`glass-panel rounded-2xl overflow-hidden border-white/5 shadow-2xl ${className}`}
    >
      <div style={{ transform: 'translateZ(30px)' }} className="h-full flex flex-col">
        {children}
      </div>
    </div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    fetchProjects().then(setProjects)
  }, [])

  return (
    <section id="projects" className="relative py-20 px-6 md:px-12 lg:px-24 w-full bg-[#07070d] z-10">
      
      {/* Background radial accent glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-blue/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col mb-16 items-start">
          <h2 className="text-3xl md:text-5xl font-black text-white flex items-center gap-3">
            <span className="text-brand-blue">🚀</span> Featured Projects
          </h2>
          <div className="w-20 h-[3px] bg-brand-blue mt-3 rounded-full" />
        </div>

        {/* 3D Glassmorphism grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <TiltCard key={project.id} className="group min-h-[420px] flex flex-col">
              
              {/* Screenshot container */}
              <div className="relative h-48 w-full overflow-hidden bg-black/40">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/90 to-transparent" />
              </div>

              {/* Contents block */}
              <div className="p-6 flex flex-col flex-grow text-left space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-white group-hover:text-brand-blue transition-colors duration-300">
                    {project.title}
                  </h3>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed flex-grow">
                  {project.description}
                </p>

                {/* Tech tags list */}
                <div className="pt-4 flex flex-wrap gap-2 border-t border-white/5">
                  {project.tech.map((techItem) => (
                    <span
                      key={techItem}
                      className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-brand-green bg-brand-green/5 border border-brand-green/10 px-2 py-1 rounded-md"
                    >
                      <Layers size={10} />
                      {techItem}
                    </span>
                  ))}
                </div>
              </div>

            </TiltCard>
          ))}
        </div>

      </div>
    </section>
  )
}
