export default function UnderdogScore({ score, label, reason }) {
  // Determine color based on score
  const color = score > 70 ? '#00FF88' : score >= 40 ? '#FBBF24' : '#EF4444'
  const trackColor = 'rgba(255,255,255,0.08)'

  // SVG circle math
  const radius = 78
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <section>
      <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
        <span className="text-3xl">🎯</span>
        Underdog Score
      </h2>

      <div className="glass-card p-10 flex flex-col md:flex-row items-center gap-10">
        {/* Circular Score */}
        <div className="flex-shrink-0">
          <div className="score-circle" style={{ width: 180, height: 180 }}>
            <svg width="180" height="180" viewBox="0 0 180 180">
              {/* Background track */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={trackColor}
                strokeWidth="10"
              />
              {/* Score arc */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{
                  transition: 'stroke-dashoffset 1.5s ease-out',
                  filter: `drop-shadow(0 0 8px ${color})`,
                }}
              />
            </svg>
            <div className="score-number" style={{ color }}>
              {score}
            </div>
          </div>

          {/* Label below circle */}
          <div className="mt-4 text-center">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-bold"
              style={{
                background: `${color}20`,
                border: `1px solid ${color}40`,
                color,
              }}
            >
              {label}
            </span>
          </div>
        </div>

        {/* Text side */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-5xl font-black mb-2" style={{ color }}>
            {score}/100
          </p>
          <p className="text-xl font-bold text-white mb-4">{label}</p>
          <p className="text-white/70 text-lg leading-relaxed">{reason}</p>

          {/* Score bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-white/40 mb-2">
              <span>Raw Diamond</span>
              <span>Underrated Powerhouse</span>
            </div>
            <div className="progress-bar" style={{ height: 8 }}>
              <div
                className="progress-fill"
                style={{
                  width: `${score}%`,
                  background: `linear-gradient(90deg, ${color}, ${color}99)`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
