const investorColors = {
  'Angel Investor': { color: '#F59E0B', emoji: '👼' },
  'Pre-seed VC': { color: '#6366F1', emoji: '🚀' },
  'Government Grant': { color: '#10B981', emoji: '🏛️' },
  'Accelerator Program': { color: '#00FF88', emoji: '⚡' },
}

export default function InvestorMatch({ investorType, investorTypeReason, opportunities }) {
  const config = investorColors[investorType] || { color: '#00FF88', emoji: '💼' }

  return (
    <section>
      <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
        <span className="text-3xl">🤝</span>
        Investor Match
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Investor type badge */}
        <div
          className="glass-card p-8 flex flex-col items-center justify-center gap-4 md:w-64 shrink-0 text-center"
          style={{
            borderColor: `${config.color}30`,
            boxShadow: `0 0 40px ${config.color}15`,
          }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
            style={{ background: `${config.color}20`, border: `2px solid ${config.color}40` }}
          >
            {config.emoji}
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Best Fit</p>
            <p className="text-xl font-black" style={{ color: config.color }}>
              {investorType}
            </p>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">{investorTypeReason}</p>
        </div>

        {/* Right: Opportunity cards */}
        <div className="flex-1 flex flex-col gap-4">
          {opportunities.map((opp, i) => (
            <div
              key={i}
              className="glass-card p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-white/15 transition-all duration-300"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white text-base truncate">{opp.name}</h3>
                  <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                    {opp.type}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-white/50 mb-1">
                    <span>Fit Score</span>
                    <span className="font-bold text-white">{opp.fit_score}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${opp.fit_score}%`,
                        background: `linear-gradient(90deg, ${config.color}, ${config.color}80)`,
                      }}
                    />
                  </div>
                </div>
              </div>
              <a
                href={opp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  background: `${config.color}15`,
                  border: `1px solid ${config.color}30`,
                  color: config.color,
                }}
              >
                Learn More →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
