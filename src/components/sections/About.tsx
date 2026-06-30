import { useEffect, useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchExperience, fetchEducation, fetchSkills } from '../../services/api'
import type { Experience, Education, SkillGroup } from '../../services/api'
import { Briefcase, GraduationCap, Layers, Sparkles, CheckCircle2 } from 'lucide-react'

// Orbiting node inside R3F
interface NodeProps {
  angle: number
  radius: number
  speed: number
  label: string
  color: string
  rotation: [number, number, number]
  activeSkill: string
  onSelectSkill: (label: string) => void
}

function OrbitingNode({
  angle,
  radius,
  speed,
  label,
  color,
  rotation,
  activeSkill,
  onSelectSkill,
}: NodeProps) {
  const nodeRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const timeRef = useRef(0)

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'default'
    return () => {
      document.body.style.cursor = 'default'
    }
  }, [hovered])

  useFrame((state, delta) => {
    // Stop orbiting when hovered or when active
    if (!hovered && activeSkill !== label) {
      timeRef.current += delta
    }
    const currentAngle = angle + timeRef.current * speed
    if (nodeRef.current) {
      nodeRef.current.position.x = Math.cos(currentAngle) * radius
      nodeRef.current.position.z = Math.sin(currentAngle) * radius
      nodeRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5 + angle) * 0.08
    }
  })

  const isSelected = activeSkill === label
  const scale = hovered || isSelected ? 0.22 : 0.12
  const emissiveIntensity = hovered || isSelected ? 1.6 : 0.4

  return (
    <group rotation={rotation}>
      {/* Orbit path line */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.015, radius + 0.015, 64]} />
        <meshBasicMaterial
          color={isSelected ? color : '#ffffff'}
          transparent
          opacity={isSelected ? 0.25 : 0.04}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Orbiting mesh */}
      <group ref={nodeRef}>
        <mesh
          onPointerOver={(e) => {
            e.stopPropagation()
            setHovered(true)
          }}
          onPointerOut={(e) => {
            e.stopPropagation()
            setHovered(false)
          }}
          onClick={(e) => {
            e.stopPropagation()
            onSelectSkill(label)
          }}
        >
          <sphereGeometry args={[scale, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={emissiveIntensity}
            roughness={0.15}
            metalness={0.9}
          />
        </mesh>

        {/* Dynamic Glass Tag */}
        <Html distanceFactor={6} center>
          <div
            onClick={() => onSelectSkill(label)}
            className={`glass-panel px-2.5 py-1.5 rounded-xl text-[9px] md:text-xs font-mono text-white border transition-all duration-300 flex items-center gap-1.5 select-none shadow-lg cursor-pointer ${
              isSelected
                ? 'border-brand-blue bg-brand-blue/20 text-brand-blue shadow-[0_0_15px_rgba(0,242,254,0.3)] scale-105'
                : hovered
                ? 'border-white/30 bg-white/10 text-white'
                : 'border-white/10'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-brand-blue animate-ping' : ''}`}
              style={{ backgroundColor: isSelected ? undefined : color }}
            />
            {label}
          </div>
        </Html>
      </group>
    </group>
  )
}

interface SkillSystemProps {
  activeSkill: string
  onSelectSkill: (label: string) => void
}

function SkillSystem({ activeSkill, onSelectSkill }: SkillSystemProps) {
  const coreRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.3
      coreRef.current.position.y = Math.sin(time * 1.0) * 0.08
    }
  })

  // Tilted 3D orbital planes configuration
  const nodes: Omit<NodeProps, 'activeSkill' | 'onSelectSkill'>[] = [
    { angle: 0, radius: 1.6, speed: 0.3, label: 'React', color: '#61dafb', rotation: [0.4, 0.2, 0.1] },
    { angle: (2 * Math.PI) / 5, radius: 1.7, speed: 0.25, label: 'Ruby on Rails', color: '#cc0000', rotation: [-0.4, 0.5, -0.2] },
    { angle: (4 * Math.PI) / 5, radius: 1.8, speed: 0.28, label: 'Cloudflare', color: '#f38020', rotation: [0.2, -0.6, 0.3] },
    { angle: (6 * Math.PI) / 5, radius: 1.9, speed: 0.32, label: 'MySql', color: '#00758f', rotation: [-0.2, -0.3, -0.4] },
    { angle: (8 * Math.PI) / 5, radius: 2.0, speed: 0.22, label: 'AWS', color: '#ff9900', rotation: [0.5, -0.1, -0.5] },
  ]

  return (
    <group>
      {/* Central Axis Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial
          color="#9b51e0"
          emissive="#9b51e0"
          emissiveIntensity={0.25}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Orbiting Nodes mapped over planes */}
      {nodes.map((node, i) => (
        <OrbitingNode
          key={i}
          {...node}
          activeSkill={activeSkill}
          onSelectSkill={onSelectSkill}
        />
      ))}
    </group>
  )
}

// Data mapping of technology experiences
const SKILL_DETAILS: Record<string, { title: string; desc: string; highlights: string[]; accent: string }> = {
  React: {
    title: 'React & Frontend Architecture',
    desc: 'Expertise in building responsive user interfaces, optimization strategies, and managing dynamic rendering layers.',
    highlights: [
      'Built budget tracking layouts with React, improving reporting fidelity.',
      'Reduced initial client load time by tuning component builds.',
      'Integrated real-time OCR parsing inputs directly with reactive states.',
    ],
    accent: '#61dafb',
  },
  'Ruby on Rails': {
    title: 'Ruby on Rails Backend Ecosystem',
    desc: 'Strong knowledge of Rails API setups, queue architectures (Sidekiq), database indexing, and Rails 8 configuration.',
    highlights: [
      'Upgraded legacy Setlmint repositories to Rails 8.0 configurations.',
      'Designed RFQ comparative layouts backed by transaction APIs.',
      'Configured multi-thread background parsing pipelines.',
    ],
    accent: '#cc0000',
  },
  Cloudflare: {
    title: 'Cloudflare Network Optimizations',
    desc: 'Setting up SSL certificates, caching rules, edge proxy configs, and access controls.',
    highlights: [
      'Proxied custom portfolio domains securely using Cloudflare DNS.',
      'Tuned CDN caching layers for dynamic project resources.',
      'Configured network WAF firewall policies shielding assets.',
    ],
    accent: '#f38020',
  },
  MySql: {
    title: 'MySQL Relational Database Tuning',
    desc: 'Writing optimized indices, structured tables, handling record lockups, and database migrations.',
    highlights: [
      'Managed databases handling millions of records on concurrent channels.',
      'Upgraded MySQL databases from v5.7 directly to v8.0 versions.',
      'Resolved transaction deadlocks on concurrent budget operations.',
    ],
    accent: '#00758f',
  },
  AWS: {
    title: 'Amazon Web Services Deployments',
    desc: 'Knowledge in managing serverless Lambdas, AWS SAM configurations, and storage infrastructure.',
    highlights: [
      'Configured serverless logs utilizing S3 bucket setups.',
      'Deployed serverless function handlers via AWS SAM pipelines.',
      'Reduced overall hosting costs by 20% by adopting lambda patterns.',
    ],
    accent: '#ff9900',
  },
}

export default function About() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [skills, setSkills] = useState<SkillGroup[]>([])
  const [activeSkill, setActiveSkill] = useState<string>('React')

  useEffect(() => {
    fetchExperience().then(setExperiences)
    fetchEducation().then(setEducation)
    fetchSkills().then(setSkills)
  }, [])

  return (
    <section id="about" className="relative py-20 px-6 md:px-12 lg:px-24 w-full bg-dark-bg z-10">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="flex flex-col mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-white flex items-center gap-3">
            <span className="text-brand-purple">🙋‍♂️</span> Summary & Tech
          </h2>
          <div className="w-20 h-[3px] bg-brand-purple mt-3 rounded-full" />
        </div>

        {/* Layout: Summary text + 3D Orbiting Skill system */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch mb-24">
          
          {/* Left panel: Info summary and dynamic interactive skills showcase */}
          <div className="flex flex-col justify-between space-y-6 text-left">
            {/* Profile Card Header */}
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start glass-panel p-6 rounded-2xl border-white/5 relative overflow-hidden group">
              {/* Decorative radial overlay */}
              <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-brand-purple/10 rounded-full filter blur-[40px] pointer-events-none" />
              
              {/* Photo Frame with glowing border */}
              <div className="relative shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-tr from-brand-blue via-brand-purple to-brand-pink rounded-2xl filter blur-[6px] opacity-75 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-glow" />
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-white/10 group-hover:border-brand-blue/30 transition-all duration-500">
                  <img 
                    src="/assets/img/profile_upload.png" 
                    alt="Abhishek Gujar" 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              
              {/* Profile Details */}
              <div className="flex-grow flex flex-col justify-center space-y-3 text-center sm:text-left h-full pt-1">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    Abhishek Gujar
                  </h3>
                  <p className="text-sm font-mono text-brand-blue mt-1 font-semibold uppercase tracking-wider">
                    Full Stack Software Engineer
                  </p>
                </div>
                
                {/* Location & Contact Badges */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                    📍 Mumbai, India
                  </span>
                  <a 
                    href="mailto:gujarabhishek777@gmail.com"
                    className="inline-flex items-center gap-1.5 text-xs font-mono bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-blue/30 px-2.5 py-1 rounded-lg text-gray-300 hover:text-brand-blue transition-all"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
                    ✉️ Email Me
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p className="text-lg">
                Experienced Full Stack Developer with a strong track record in optimizing database performance,
                managing large-scale datasets, and implementing efficient solutions for concurrent data operations.
              </p>
              <p>
                Adept at delivering high-performance, scalable software solutions. Skilled in queue management to ensure system reliability and experienced in cost-cutting strategies to optimize cloud infrastructure.
              </p>
            </div>

            {/* Dynamic Interactive Tech highlights card */}
            <AnimatePresence mode="wait">
              {activeSkill && SKILL_DETAILS[activeSkill] && (
                <motion.div
                  key={activeSkill}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  style={{ borderColor: `${SKILL_DETAILS[activeSkill].accent}30` }}
                  className="glass-panel p-6 rounded-2xl border flex flex-col gap-4 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span 
                      style={{ color: SKILL_DETAILS[activeSkill].accent, backgroundColor: `${SKILL_DETAILS[activeSkill].accent}10` }} 
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase border border-white/5"
                    >
                      <Sparkles size={12} />
                      {activeSkill}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">Interactive Highlight</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">
                      {SKILL_DETAILS[activeSkill].title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {SKILL_DETAILS[activeSkill].desc}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {SKILL_DETAILS[activeSkill].highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-2.5 text-xs text-gray-300">
                        <CheckCircle2 
                          size={14} 
                          className="mt-0.5 shrink-0" 
                          style={{ color: SKILL_DETAILS[activeSkill].accent }} 
                        />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Static Core Metrics */}
            <div className="grid grid-cols-2 gap-4 text-sm font-mono pt-2">
              <div className="glass-panel p-4 rounded-xl">
                <span className="text-brand-blue font-bold block text-lg">9.67</span>
                Graduation CGPA
              </div>
              <div className="glass-panel p-4 rounded-xl">
                <span className="text-brand-green font-bold block text-lg">3+ Years</span>
                Professional Exp
              </div>
            </div>
          </div>

          {/* Right panel: Real-time 3D skill orbit canvas */}
          <div className="w-full min-h-[350px] lg:h-auto relative rounded-3xl overflow-hidden glass-panel border-white/5 flex flex-col justify-between p-6">
            <div className="text-left">
              <span className="text-xs font-mono uppercase tracking-widest text-brand-purple">Hover or Click Nodes</span>
              <h3 className="text-sm font-semibold text-white">Skill Orbiting Network</h3>
            </div>
            
            <div className="w-full flex-grow h-[300px] lg:h-[350px]">
              <Canvas camera={{ position: [0, 2.5, 4.4], fov: 50 }}>
                <ambientLight intensity={0.55} />
                <pointLight position={[5, 5, 5]} intensity={1.5} color="#00f2fe" />
                <pointLight position={[-5, -5, -5]} intensity={1} color="#bd00ff" />
                <SkillSystem activeSkill={activeSkill} onSelectSkill={setActiveSkill} />
              </Canvas>
            </div>

            <div className="text-center text-[10px] font-mono text-gray-500">
              Atom orbit axes representing active deployment pipelines.
            </div>
          </div>

        </div>

        {/* Skills Stack Listing */}
        <div className="mb-24">
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
            <Layers size={18} className="text-brand-blue" />
            Core Stack Ecosystem
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skills.map((group) => (
              <div key={group.category} className="glass-panel p-6 rounded-2xl border-white/5 text-left">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-brand-blue mb-4 pb-2 border-b border-white/5">
                  {group.category}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {group.skills.map((skill) => (
                    <div
                      key={skill.name}
                      onClick={() => {
                        // Tie static list items click to the interactive 3D orbit model!
                        if (SKILL_DETAILS[skill.name]) {
                          setActiveSkill(skill.name)
                          // Smooth scroll canvas area into view if needed
                          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
                        }
                      }}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-gray-300 font-mono transition-all duration-200 cursor-pointer ${
                        activeSkill === skill.name
                          ? 'bg-brand-blue/15 text-brand-blue border border-brand-blue/30 shadow-[0_0_8px_rgba(0,242,254,0.15)] scale-105'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <img src={skill.icon} alt={skill.name} className="w-4 h-4 object-contain" />
                      {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline: Experience and Education */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
          
          {/* Work Experience */}
          <div>
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
              <Briefcase size={18} className="text-brand-purple" />
              Work Experience
            </h3>
            <div className="space-y-8 border-l border-white/10 pl-6 relative">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative group">
                  <span className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full bg-dark-bg border-2 border-brand-purple group-hover:bg-brand-purple transition-colors duration-300" />
                  <div className="glass-panel p-6 rounded-2xl border-white/5 space-y-3">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div>
                        <h4 className="font-bold text-white text-lg">{exp.role}</h4>
                        <span className="text-sm text-brand-blue font-semibold">{exp.company}</span>
                      </div>
                      <span className="text-xs font-mono text-gray-500 bg-white/5 px-2.5 py-1 rounded-full">
                        {exp.period}
                      </span>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-400 list-disc pl-4">
                      {exp.points.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
              <GraduationCap size={18} className="text-brand-green" />
              Education Timeline
            </h3>
            <div className="space-y-8 border-l border-white/10 pl-6 relative">
              {education.map((edu) => (
                <div key={edu.id} className="relative group">
                  <span className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full bg-dark-bg border-2 border-brand-green group-hover:bg-brand-green transition-colors duration-300" />
                  <div className="glass-panel p-6 rounded-2xl border-white/5 space-y-3">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div>
                        <h4 className="font-bold text-white text-lg">{edu.degree}</h4>
                        <span className="text-sm text-brand-green font-semibold">{edu.school}</span>
                      </div>
                      <span className="text-xs font-mono text-gray-500 bg-white/5 px-2.5 py-1 rounded-full">
                        {edu.period}
                      </span>
                    </div>
                    <p className="text-sm font-mono text-brand-blue font-bold">{edu.score}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
