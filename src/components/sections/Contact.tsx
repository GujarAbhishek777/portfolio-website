import React, { useState, useEffect, useRef } from 'react'
import { submitContactForm } from '../../services/api'
import { Send, CheckCircle2, AlertCircle, Phone, Mail, MapPin } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Subtle 2D Canvas Particle System Background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', handleResize)

    // Particle representation
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number

      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.size = Math.random() * 2 + 0.5
        this.speedX = Math.random() * 0.4 - 0.2
        this.speedY = Math.random() * 0.4 - 0.2
        this.opacity = Math.random() * 0.5 + 0.1
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Bounce/Wrap boundaries
        if (this.x < 0 || this.x > width) this.speedX *= -1
        if (this.y < 0 || this.y > height) this.speedY *= -1
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = `rgba(0, 242, 254, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const particles: Particle[] = []
    const particleCount = Math.min(Math.floor((width * height) / 15000), 60)
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      particles.forEach((p) => {
        p.update()
        p.draw()
      });
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', message: 'All form fields are required.' })
      return
    }

    setLoading(true)
    setStatus({ type: null, message: '' })

    try {
      const response = await submitContactForm(formData)
      if (response.success) {
        setStatus({ type: 'success', message: response.message })
        setFormData({ name: '', email: '', message: '' })
        
        // Trigger celebratory confetti on successful contact submit
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f2fe', '#9b51e0', '#00f5d4'],
        })
      } else {
        setStatus({ type: 'error', message: response.message })
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="relative py-20 px-6 md:px-12 lg:px-24 w-full bg-[#07070d] z-10 overflow-hidden">
      
      {/* Particle Canvas layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col mb-16 items-start">
          <h2 className="text-3xl md:text-5xl font-black text-white flex items-center gap-3">
            <span className="text-brand-green">📞</span> Contact Me
          </h2>
          <div className="w-20 h-[3px] bg-brand-green mt-3 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch text-left">
          
          {/* Quick info panels */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Let's discuss scaling your systems</h3>
              <p className="text-gray-400">
                I am open to engineering roles, tech advisory, and full-stack projects. Leave a message, and I'll get back to you shortly.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl glass-panel text-brand-green border-brand-green/20">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500">Location</h4>
                  <p className="text-white font-medium text-sm">Mumbai, India</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl glass-panel text-brand-blue border-brand-blue/20">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500">Personal Email</h4>
                  <a href="mailto:gujarabhishek777@gmail.com" className="text-white hover:text-brand-blue transition-colors text-sm font-medium">
                    gujarabhishek777@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl glass-panel text-brand-purple border-brand-purple/20">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500">Call / Chat</h4>
                  <a href="https://wa.me/+917039114160" target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-purple transition-colors text-sm font-medium">
                    +91 7039114160
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl border-white/5 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="name" className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Abhishek Gujar"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/30 transition-all font-sans"
                    required
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label htmlFor="email" className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@domain.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/30 transition-all font-sans"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="message" className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                  Your Message
                  </label>
                <textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Hey, let's discuss full stack opportunities..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/30 transition-all font-sans resize-none"
                  required
                />
              </div>

              {/* Status Indicator Alerts */}
              {status.type && (
                <div
                  className={`flex items-start gap-3 p-4 rounded-xl text-sm ${
                    status.type === 'success'
                      ? 'bg-brand-green/10 text-brand-green border border-brand-green/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span>{status.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-green to-brand-blue hover:from-brand-blue hover:to-brand-green text-black font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {loading ? 'Sending...' : 'Send Message'}
                <Send size={16} />
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  )
}
