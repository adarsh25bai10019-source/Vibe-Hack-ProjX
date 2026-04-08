import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ThreeBackground from './ThreeBackground'
import Logo from './Logo'

const STAGES = [
  'Just an idea',
  'Built a prototype',
  'Have some users',
  'Making some money',
]

const STATS = [
  { value: '500+', label: 'Projects Analysed' },
  { value: '₹2Cr+', label: 'Revenue Unlocked' },
  { value: '3 min', label: 'Avg. Analysis Time' },
  { value: '94%', label: 'Founder Satisfaction' },
]

const FEATURES = [
  {
    icon: '🎯',
    title: 'Underdog Score',
    desc: 'AI-rated potential score from 0-100 with detailed reasoning',
    color: '#00FF88',
  },
  {
    icon: '💰',
    title: 'Monetization Paths',
    desc: '3 specific revenue streams with real INR projections',
    color: '#6366F1',
  },
  {
    icon: '🤝',
    title: 'Investor Match',
    desc: 'Real Indian funding programs matched to your stage',
    color: '#00D4FF',
  },
]

// 3D Card tilt on mouse move
function use3DTilt(strength = 12) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / (rect.width / 2)
      const dy = (e.clientY - cy) / (rect.height / 2)
      el.style.transform = `perspective(1200px) rotateY(${dx * strength}deg) rotateX(${-dy * strength}deg) scale3d(1.02,1.02,1.02)`
    }

    const handleLeave = () => {
      el.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)'
    }

    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [strength])

  return ref
}

export default function InputForm({ onSubmit }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    techStack: '',
    targetAudience: '',
    stage: '',
    githubLink: '',
  })
  const [scrolled, setScrolled] = useState(false)
  const formRef = use3DTilt(6)
  const heroRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (Object.values(formData).some((v) => !v.trim())) return
    onSubmit(formData)
  }

  const scrollToForm = () => {
    document.getElementById('analyse-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  const isValid = Object.values(formData).every((v) => v.trim())

  return (
    <div className="relative min-h-screen bg-[#0A0A0F] overflow-x-hidden">
      {/* 3D Three.js Background */}
      <ThreeBackground />

      {/* ════════════════ NAVBAR ════════════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? 'rgba(10, 10, 15, 0.92)'
            : 'rgba(10, 10, 15, 0.3)',
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled
            ? '1px solid rgba(0, 255, 136, 0.15)'
            : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How it Works', 'For Founders'].map((link) => (
              <button
                key={link}
                onClick={() => {
                  if (link === 'Features') {
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                  } else if (link === 'For Founders') {
                    navigate('/pitch-room')
                  } else {
                    scrollToForm()
                  }
                }}
                className="text-sm text-white/60 hover:text-white transition-colors duration-200 font-medium"
              >
                {link}
              </button>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={scrollToForm}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105"
            style={{
              background: 'rgba(0, 255, 136, 0.12)',
              border: '1px solid rgba(0, 255, 136, 0.4)',
              color: '#00FF88',
              boxShadow: '0 0 16px rgba(0,255,136,0.15)',
            }}
          >
            Analyse My Project →
          </button>

          {/* Mobile hamburger line */}
          <button
            onClick={scrollToForm}
            className="md:hidden text-[#00FF88] font-bold text-sm border border-[#00FF88]/30 px-3 py-1.5 rounded-lg"
          >
            Analyse →
          </button>
        </div>
      </nav>

      {/* ════════════════ HERO SECTION ════════════════ */}
      <section ref={heroRef} className="relative z-10 w-full" style={{ height: '200vh' }}>
        <div className="sticky top-0 min-h-screen w-full flex flex-col items-center justify-center pt-16 px-4 overflow-hidden pointer-events-none">
          
          <div className="relative z-10 flex flex-col items-center justify-center pointer-events-auto w-full max-w-4xl mx-auto">
            {/* Top badge */}
            <div
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8 cursor-default"
          style={{
            background: 'rgba(0, 255, 136, 0.08)',
            border: '1px solid rgba(0, 255, 136, 0.25)',
            animation: 'fadeUp 0.6s ease-out both',
          }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF88] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00FF88]" />
          </span>
          <span className="text-[#00FF88] text-sm font-semibold">AI-Powered Startup Analyser for Indian Founders</span>
        </div>

        {/* Main headline with 3D perspective */}
        <div
          className="text-center mb-6 max-w-4xl"
          style={{ animation: 'fadeUp 0.7s ease-out 0.1s both' }}
        >
          <h1
            className="font-black text-white leading-[1.05] mb-4"
            style={{
              fontSize: 'clamp(2.8rem, 7vw, 6rem)',
              textShadow: '0 0 80px rgba(0,255,136,0.12)',
              letterSpacing: '-0.02em',
            }}
          >
            You're not a student
            <br />
            <span
              style={{
                color: '#00FF88',
                textShadow: '0 0 40px rgba(0,255,136,0.5)',
                filter: 'drop-shadow(0 0 20px rgba(0,255,136,0.3))',
              }}
            >
              with a project.
            </span>
          </h1>
          <h2
            className="font-black text-white/80 leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 4.2rem)', letterSpacing: '-0.02em' }}
          >
            You're a founder with a product.
          </h2>
        </div>

        {/* Subtext */}
        <p
          className="text-white/50 text-xl max-w-xl text-center mb-10 leading-relaxed"
          style={{ animation: 'fadeUp 0.7s ease-out 0.2s both' }}
        >
          Get a detailed monetization roadmap, investor matches &amp; your first ₹ plan — in 30 seconds.
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 mb-16"
          style={{ animation: 'fadeUp 0.7s ease-out 0.3s both' }}
        >
          <button
            onClick={scrollToForm}
            className="btn-accent text-lg px-10 py-4 flex items-center gap-2"
            style={{ animation: 'pulseGlow 2.5s ease-in-out infinite' }}
          >
            🚀 Analyse My Project
          </button>
          <button
            onClick={() => navigate('/pitch-room')}
            className="px-8 py-4 rounded-xl font-semibold text-white/70 hover:text-white transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            Enter 3D Pitch Room 🎙️
          </button>
        </div>

        {/* Stats row */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl w-full mb-8"
          style={{ animation: 'fadeUp 0.7s ease-out 0.4s both' }}
        >
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="text-center glass-card py-4 px-3"
              style={{
                borderColor: 'rgba(255,255,255,0.06)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,255,136,0.12)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <p className="text-2xl font-black text-[#00FF88] mb-1">{stat.value}</p>
              <p className="text-xs text-white/45 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="flex flex-col items-center gap-2 opacity-40 mt-8" style={{ animation: 'fadeUp 1s ease-out 0.8s both' }}>
          <span className="text-white/60 text-xs font-medium tracking-widest uppercase">Scroll to unlock potential</span>
          <div className="w-5 h-8 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-white/60 rounded-full" style={{ animation: 'scrollDot 1.5s ease-in-out infinite' }} />
          </div>
        </div>
        
          </div> {/* end of inner relative z-10 wrapper */}
        </div> {/* end of sticky top-0 */}
      </section>

      {/* ════════════════ FEATURES STRIP ════════════════ */}
      <section id="features" className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#00FF88] text-sm font-bold uppercase tracking-widest mb-3">What you get</p>
            <h2 className="text-4xl md:text-5xl font-black text-white">
              Everything a founder needs.{' '}
              <span className="text-white/40">Nothing they don't.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="glass-card p-8 group cursor-default"
                style={{
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                  transformStyle: 'preserve-3d',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'perspective(800px) rotateY(-4deg) rotateX(3deg) translateY(-8px)'
                  e.currentTarget.style.boxShadow = `0 24px 60px ${f.color}20`
                  e.currentTarget.style.borderColor = `${f.color}40`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6"
                  style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}
                >
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-white/50 leading-relaxed">{f.desc}</p>
                <div
                  className="mt-6 h-1 rounded-full w-12"
                  style={{ background: `linear-gradient(90deg, ${f.color}, transparent)` }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ FORM SECTION ════════════════ */}
      <section id="analyse-form" className="relative z-10 py-16 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Section label */}
          <div className="text-center mb-10">
            <p className="text-[#00FF88] text-sm font-bold uppercase tracking-widest mb-3">Start your analysis</p>
            <h2 className="text-4xl font-black text-white mb-3">Tell us about your project</h2>
            <p className="text-white/40">Takes 60 seconds. Get your full startup roadmap instantly.</p>
          </div>

          {/* 3D Tilt Card Form */}
          <div
            ref={formRef}
            className="glass-card p-8 md:p-10"
            style={{
              transition: 'transform 0.12s ease-out',
              transformStyle: 'preserve-3d',
              border: '1px solid rgba(0, 255, 136, 0.12)',
              boxShadow: '0 0 60px rgba(0, 255, 136, 0.06), 0 40px 80px rgba(0,0,0,0.4)',
            }}
          >
            {/* Shimmer top border */}
            <div
              className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.6), transparent)' }}
            />

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-semibold text-white/60 mb-2 uppercase tracking-wide">
                  Project Name <span className="text-[#00FF88]">*</span>
                </label>
                <input
                  id="projectName"
                  name="projectName"
                  type="text"
                  className="form-input"
                  placeholder="e.g. CampusCart, NoteSwap, SkillBridge"
                  value={formData.projectName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-white/60 mb-2 uppercase tracking-wide">
                  What does your project do? <span className="text-[#00FF88]">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="form-input resize-none"
                  placeholder="Describe what problem it solves and how it works in 2-3 sentences..."
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Two columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-white/60 mb-2 uppercase tracking-wide">
                    Tech Stack <span className="text-[#00FF88]">*</span>
                  </label>
                  <input
                    id="techStack"
                    name="techStack"
                    type="text"
                    className="form-input"
                    placeholder="React, Python, Firebase..."
                    value={formData.techStack}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white/60 mb-2 uppercase tracking-wide">
                    Built for <span className="text-[#00FF88]">*</span>
                  </label>
                  <input
                    id="targetAudience"
                    name="targetAudience"
                    type="text"
                    className="form-input"
                    placeholder="College students, Freelancers..."
                    value={formData.targetAudience}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Stage */}
              <div>
                <label className="block text-sm font-semibold text-white/60 mb-2 uppercase tracking-wide">
                  Current Stage <span className="text-[#00FF88]">*</span>
                </label>
                <select
                  id="stage"
                  name="stage"
                  className="form-input"
                  value={formData.stage}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled style={{ background: '#0F0F1A' }}>
                    Select your current stage...
                  </option>
                  {STAGES.map((s) => (
                    <option key={s} value={s} style={{ background: '#0F0F1A' }}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            
              {/* GitHub Link */}
              <div>
                <label className="block text-sm font-semibold text-white/60 mb-2 uppercase tracking-wide flex items-center justify-between">
                  <span>GitHub Repo Link <span className="text-white/30 text-xs font-normal normal-case ml-2">(Optional)</span></span>
                  <svg className="w-5 h-5 text-white/30" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
                </label>
                <input
                  id="githubLink"
                  name="githubLink"
                  type="url"
                  className="form-input focus:ring-[#00FF88]/50 focus:border-[#00FF88]"
                  placeholder="https://github.com/username/project"
                  value={formData.githubLink}
                  onChange={handleChange}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                id="analyseBtn"
                className="btn-accent w-full text-lg py-4 mt-2 flex items-center justify-center gap-3"
                disabled={!isValid}
                style={isValid ? { animation: 'pulseGlow 2.5s ease-in-out infinite' } : {}}
              >
                <span>🚀</span>
                <span>Analyse My Project</span>
                <span>→</span>
              </button>

              <p className="text-center text-white/25 text-xs">
                Powered by Advanced Logic · ~15 second analysis · 100% free
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* ════════════════ FOOTER ════════════════ */}
      <footer className="relative z-10 mt-12 py-16 px-6 border-t border-white/10 bg-[#0A0A0F]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="scale-75 origin-left -ml-2">
              <Logo />
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm font-medium">
              ProjX evaluates your student projects and converts them into pitch-ready startup roadmaps using advanced analysis logic.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold tracking-wide uppercase text-xs mb-2">Platform</h4>
            <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="text-left text-white/40 hover:text-[#00FF88] text-sm transition-colors">Analyse Project</button>
            <button onClick={() => navigate('/pitch-room')} className="text-left text-white/40 hover:text-[#00FF88] text-sm transition-colors">3D Pitch Room</button>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold tracking-wide uppercase text-xs mb-2">Connect</h4>
            <a href="mailto:hello@projx.com" className="text-white/40 hover:text-[#00FF88] text-sm transition-colors">hello@projx.com</a>
            <a href="#" className="text-white/40 hover:text-[#00FF88] text-sm transition-colors">LinkedIn</a>
            <a href="#" className="text-white/40 hover:text-[#00FF88] text-sm transition-colors">Twitter (X)</a>
          </div>

        </div>
        
        <div className="max-w-7xl mx-auto border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} ProjX. All rights reserved.
          </p>
          <div className="flex gap-6 text-white/30 text-xs">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <span>Powered by ProjX Engine</span>
          </div>
        </div>
      </footer>

      {/* ════════════════ CUSTOM ANIMATIONS ════════════════ */}
      <style>{`
        @keyframes scrollDot {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(12px); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
