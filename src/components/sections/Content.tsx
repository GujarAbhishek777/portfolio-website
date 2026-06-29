import { motion } from 'framer-motion'
import { Github, Linkedin, MessageSquare, Twitter, ArrowUpRight, Play } from 'lucide-react'

export default function Content() {
  const nodes = [
    {
      id: 'linkedin',
      name: 'LinkedIn Network',
      role: 'Professional Updates',
      icon: Linkedin,
      color: '#0077b5',
      href: 'https://linkedin.com/in/abhishek-gujar-89a225192/',
      floatDelay: 0,
      glowColor: 'rgba(0, 119, 181, 0.4)',
    },
    {
      id: 'github',
      name: 'GitHub Hub',
      role: 'Open Source Code',
      icon: Github,
      color: '#ffffff',
      href: 'https://github.com/GujarAbhishek777',
      floatDelay: 1.5,
      glowColor: 'rgba(255, 255, 255, 0.2)',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Sync',
      role: 'Instant Chat',
      icon: MessageSquare,
      color: '#25d366',
      href: 'https://wa.me/+917039114160',
      floatDelay: 3,
      glowColor: 'rgba(37, 211, 102, 0.4)',
    },
    {
      id: 'twitter',
      name: 'X Platform',
      role: 'Tech Thoughts',
      icon: Twitter,
      color: '#1da1f2',
      href: 'https://x.com/GUJARABHISHEK21',
      floatDelay: 4.5,
      glowColor: 'rgba(29, 161, 242, 0.4)',
    },
  ]

  return (
    <section id="content" className="relative py-20 px-6 md:px-12 lg:px-24 w-full bg-dark-bg z-10 overflow-hidden">
      
      {/* Background glowing gradients */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[350px] h-[350px] bg-brand-purple/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Headline Copy */}
          <div className="lg:col-span-5 text-left space-y-6">
            <div className="flex flex-col">
              <h2 className="text-3xl md:text-5xl font-black text-white flex items-center gap-3">
                <span className="text-brand-pink">⚡</span> Content & Socials
              </h2>
              <div className="w-20 h-[3px] bg-brand-pink mt-3 rounded-full" />
            </div>
            <p className="text-gray-300 text-lg">
              Connecting with developers globally to discuss software architecture, performance tuning, and cloud computing.
            </p>
            <p className="text-gray-400 text-sm">
              I share hands-on code scripts, system optimization plans, and career experiences across networks. Feel free to explore my source hubs or connect directly for collabs.
            </p>

            <div className="inline-flex items-center gap-2 text-xs font-mono text-brand-pink uppercase tracking-widest bg-brand-pink/5 px-4 py-2 rounded-xl border border-brand-pink/10">
              <Play size={12} className="animate-ping" />
              Click any node to explore
            </div>
          </div>

          {/* Social Nodes Field */}
          <div className="lg:col-span-7 relative min-h-[360px] md:min-h-[440px] flex items-center justify-center">
            
            {/* Visual background orbits helper */}
            <div className="absolute w-[240px] h-[240px] md:w-[320px] md:h-[320px] rounded-full border border-dashed border-white/5 animate-[spin_50s_linear_infinite]" />
            <div className="absolute w-[140px] h-[140px] md:w-[180px] md:h-[180px] rounded-full border border-dotted border-white/5 animate-[spin_30s_linear_infinite_reverse]" />

            {/* Orbiting / Floating glowing social nodes grid */}
            <div className="grid grid-cols-2 gap-6 md:gap-8 z-10 w-full max-w-lg">
              {nodes.map((node) => {
                const Icon = node.icon
                return (
                  <motion.a
                    key={node.id}
                    href={node.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    animate={{
                      y: [0, -12, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: node.floatDelay,
                    }}
                    style={{
                      boxShadow: `0 4px 30px rgba(0,0,0,0.4), 0 0 15px ${node.glowColor}`,
                    }}
                    className="glass-panel p-6 rounded-2xl border-white/5 hover:border-white/20 transition-all duration-300 text-left flex flex-col justify-between h-40 group cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div
                        style={{ backgroundColor: `${node.color}15`, color: node.color }}
                        className="p-3.5 rounded-xl border border-white/10"
                      >
                        <Icon size={22} />
                      </div>
                      <ArrowUpRight size={16} className="text-gray-500 group-hover:text-white transition-colors duration-200" />
                    </div>

                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-brand-pink transition-colors duration-200">
                        {node.name}
                      </h3>
                      <p className="text-xs font-mono text-gray-500 mt-1">{node.role}</p>
                    </div>
                  </motion.a>
                )
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
