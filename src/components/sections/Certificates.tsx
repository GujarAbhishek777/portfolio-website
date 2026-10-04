import { useEffect, useState, useRef } from 'react'
import { fetchCertificates } from '../../services/api'
import type { Certificate } from '../../services/api'
import { Award, Maximize2, X, CheckCircle2, Layers, Calendar, ExternalLink } from 'lucide-react'

// 3D Tilt Card wrapper for the interactive anti-gravity effect
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

    const maxRotateX = 10
    const maxRotateY = 10

    const rotateX = ((centerY - y) / centerY) * maxRotateX
    const rotateY = ((x - centerX) / centerX) * maxRotateY

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
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
        transition: 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)',
        transformStyle: 'preserve-3d',
      }}
      className={`glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl ${className}`}
    >
      <div style={{ transform: 'translateZ(25px)' }} className="h-full flex flex-col">
        {children}
      </div>
    </div>
  )
}

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null)

  useEffect(() => {
    fetchCertificates().then(setCertificates)
  }, [])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedCert) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedCert])

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCert(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <section id="certificates" className="relative py-24 px-6 md:px-12 lg:px-24 w-full bg-[#05050b] z-10">
      
      {/* Background radial accent glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-purple/10 rounded-full filter blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-brand-blue/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col mb-16 items-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-xs font-mono uppercase tracking-widest mb-3">
            <Award size={14} /> Professional Qualifications
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white flex items-center gap-3">
            Certifications & Mastery
          </h2>
          <p className="text-gray-400 text-sm md:text-base mt-2 max-w-2xl text-left">
            Industry-recognized certifications validating core computer science concepts, advanced software engineering practices, and modern web development stack.
          </p>
          <div className="w-20 h-[3px] bg-gradient-to-r from-brand-blue to-brand-purple mt-4 rounded-full" />
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {certificates.map((cert) => (
            <TiltCard key={cert.id} className="group min-h-[460px] flex flex-col bg-[#0b0c16]/80 backdrop-blur-xl hover:border-brand-blue/40 transition-colors duration-300">
              
              {/* Certificate Image Banner */}
              <div 
                className="relative h-56 w-full overflow-hidden bg-black/60 cursor-pointer group/img"
                onClick={() => setSelectedCert(cert)}
              >
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover/img:scale-105 opacity-90 group-hover/img:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c16] via-[#0b0c16]/30 to-transparent" />
                
                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-brand-blue/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/80 text-white text-xs font-mono font-medium border border-white/20 shadow-lg">
                    <Maximize2 size={14} className="text-brand-blue" /> Click to View Certificate
                  </span>
                </div>

                {/* Badge top right */}
                {cert.issueDate && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-gray-300 flex items-center gap-1.5">
                    <Calendar size={12} className="text-brand-blue" />
                    {cert.issueDate}
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow text-left space-y-4">
                {/* Title & Issuer */}
                <div>
                  <div className="text-xs font-mono text-brand-purple uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-brand-blue" />
                    {cert.issuer}
                  </div>
                  <h3 
                    onClick={() => setSelectedCert(cert)}
                    className="text-2xl font-bold text-white group-hover:text-brand-blue transition-colors duration-300 cursor-pointer flex items-center justify-between"
                  >
                    <span>{cert.title}</span>
                    <Maximize2 size={16} className="text-gray-500 group-hover:text-brand-blue transition-colors" />
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm leading-relaxed">
                  {cert.description}
                </p>

                {/* Specification Box */}
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-xs text-gray-400 space-y-1">
                  <span className="text-brand-blue font-mono font-semibold block uppercase tracking-wider text-[10px]">
                    Specification & Core Focus:
                  </span>
                  <p className="text-gray-300 leading-snug">
                    {cert.specification}
                  </p>
                </div>

                {/* Skills/Tags List */}
                <div className="pt-4 flex flex-wrap gap-2 border-t border-white/5 mt-auto">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 text-[11px] font-mono tracking-wide text-brand-blue bg-brand-blue/10 border border-brand-blue/20 px-2.5 py-1 rounded-md"
                    >
                      <Layers size={10} />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </TiltCard>
          ))}
        </div>

      </div>

      {/* Modal Lightbox for High-Res Certificate Viewing */}
      {selectedCert && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedCert(null)}
        >
          <div 
            className="relative max-w-5xl w-full bg-[#0b0c16] border border-white/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#07070d]">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Award className="text-brand-blue" size={20} />
                  {selectedCert.title}
                </h3>
                <p className="text-xs font-mono text-gray-400">
                  Issued by {selectedCert.issuer}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a 
                  href={selectedCert.image} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink size={14} /> Full Image
                </a>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Image Container */}
            <div className="p-4 overflow-auto flex items-center justify-center bg-black/80 max-h-[75vh]">
              <img
                src={selectedCert.image}
                alt={selectedCert.title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-xl"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#07070d] border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-gray-400">
              <div className="text-left">
                <span className="font-semibold text-white">Specification: </span>
                {selectedCert.specification}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedCert.skills.map((skill) => (
                  <span key={skill} className="px-2 py-0.5 rounded bg-brand-purple/20 text-brand-purple text-[10px] font-mono border border-brand-purple/30">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  )
}
