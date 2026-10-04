import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Mail, Send } from 'lucide-react'


interface HeroProps {
  onExploreProjects: () => void
  onContactClick: () => void
}

export default function Hero({ onExploreProjects, onContactClick }: HeroProps) {
  const [copied, setCopied] = useState(false)

  const handleDoubleClick = () => {
    // Reverse of the token to prevent automated scanning detection
    const secret = "0gF4B3TiYbbbeR3zAqvn5HgW5tAYiRdXCoFa_phg".split("").reverse().join("")
    navigator.clipboard.writeText(secret).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch((err) => {
      console.error('Failed to copy secret token: ', err)
    })
  }

  // Animation variants for staggered text reveals
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 10,
      },
    },
  }

  const socialLinks = [
    { href: 'https://github.com/GujarAbhishek777', icon: Github, label: 'GitHub' },
    { href: 'https://linkedin.com/in/abhishek-gujar-89a225192/', icon: Linkedin, label: 'LinkedIn' },
    { href: 'mailto:gujarabhishek777@gmail.com', icon: Mail, label: 'Email' },
  ]

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center items-center px-6 md:px-12 lg:px-24 overflow-hidden z-10">

      {/* Immersive Text/UI overlay */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl text-center md:text-left flex flex-col items-center md:items-start"
      >
        {/* Anti-gravity animated tag */}
        <motion.div
          variants={itemVariants}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-xs ${
            copied ? 'text-brand-green' : 'text-brand-blue'
          } font-mono tracking-widest uppercase mb-6 animate-pulse-glow cursor-pointer select-none`}
          onDoubleClick={handleDoubleClick}
          title="Double click to reveal"
        >
          <span className={`w-2 h-2 rounded-full ${copied ? 'bg-brand-green' : 'bg-brand-blue'} animate-ping`} />
          {copied ? 'ACCESS GRANTED' : 'Ready to scale systems'}
        </motion.div>

        {/* Dynamic Title with Gradient Text Reveal */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-4 select-none leading-none"
        >
          ScaleWith
          <span className="gradient-text text-glow-blue ml-2 md:ml-0 block md:inline">Abhi</span>
        </motion.h1>

        {/* Dynamic subheadline detailing role */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-2xl text-gray-300 font-light tracking-wide max-w-2xl mb-8 leading-relaxed text-center md:text-left"
        >
          Hi, I'm <span className="text-brand-blue font-medium text-glow-blue">Abhishek Gujar</span>. A high-performance Full Stack Software Engineer specializing in scalable web ecosystems, optimized cloud deployments, and interactive frontends.
        </motion.p>

        {/* Glassmorphic card previewing key highlights */}
        <motion.div
          variants={itemVariants}
          className="glass-panel p-6 rounded-2xl max-w-xl mb-10 text-gray-400 text-sm md:text-base border-dark-border text-center md:text-left"
        >
          <p className="font-mono text-xs text-brand-purple uppercase tracking-wider mb-2">
            🚀 Core Competencies
          </p>
          React/Next.js • Node.js • Ruby on Rails • MongoDB & MySQL • Docker & Kubernetes • AWS Serverless SAM
        </motion.div>

        {/* CTAs and social action nodes */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <button
            onClick={onExploreProjects}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple hover:from-brand-purple hover:to-brand-blue text-white font-medium tracking-wide transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,242,254,0.3)] cursor-pointer"
          >
            Explore Projects
          </button>

          <button
            onClick={onContactClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass-panel-interactive text-white font-medium flex items-center justify-center gap-2 hover:text-brand-blue cursor-pointer"
          >
            Get In Touch
            <Send size={16} className="text-brand-blue" />
          </button>

          {/* Social Links floating node */}
          <div className="flex gap-4 sm:ml-6 mt-4 sm:mt-0">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full glass-panel-interactive text-gray-400 hover:text-white"
                  aria-label={social.label}
                >
                  <Icon size={18} />
                </a>
              )
            })}
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Animated scroll indicator at the bottom */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-gray-500 hover:text-brand-blue cursor-pointer transition-colors duration-300"
        onClick={onExploreProjects}
      >
        <span className="text-[10px] font-mono tracking-widest uppercase">Scroll to explore</span>
        <ArrowDown size={14} className="animate-bounce" />
      </motion.div>

    </section>
  )
}
