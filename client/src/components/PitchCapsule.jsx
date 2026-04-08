import { useState } from 'react'

export default function PitchCapsule({ pitch }) {
  const [copied, setCopied] = useState(false)

  const pitchText = `🔴 Problem: ${pitch.problem}\n🟢 Solution: ${pitch.solution}\n🔵 Ask: ${pitch.ask}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pitchText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea')
      el.value = pitchText
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const rows = [
    { dot: '#EF4444', label: 'Problem', icon: '🔴', text: pitch.problem },
    { dot: '#00FF88', label: 'Solution', icon: '🟢', text: pitch.solution },
    { dot: '#3B82F6', label: 'Ask', icon: '🔵', text: pitch.ask },
  ]

  return (
    <section>
      <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
        <span className="text-3xl">🎤</span>
        30-Second Pitch Capsule
      </h2>
      <p className="text-white/50 mb-8 text-sm">Copy and use in your next investor conversation</p>

      <div className="glass-card p-8 flex flex-col gap-0 overflow-hidden">
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex gap-5 py-5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors duration-200 rounded-lg px-2"
          >
            <div className="text-2xl shrink-0 pt-0.5">{row.icon}</div>
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: row.dot }}
              >
                {row.label}
              </p>
              <p className="text-white text-base leading-relaxed">{row.text}</p>
            </div>
          </div>
        ))}

        {/* Copy button */}
        <button
          id="copyPitchBtn"
          onClick={handleCopy}
          className="mt-6 self-start flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
          style={{
            background: copied ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 255, 255, 0.08)',
            border: `1px solid ${copied ? 'rgba(0, 255, 136, 0.4)' : 'rgba(255, 255, 255, 0.12)'}`,
            color: copied ? '#00FF88' : 'rgba(255, 255, 255, 0.8)',
          }}
        >
          {copied ? (
            <>✅ Copied to clipboard!</>
          ) : (
            <>📋 Copy Pitch</>
          )}
        </button>
      </div>
    </section>
  )
}
