function formatINR(num) {
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`
  if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`
  return `₹${num}`
}

const effortConfig = {
  Low: { cls: 'badge-low', emoji: '⚡' },
  Medium: { cls: 'badge-medium', emoji: '🔧' },
  High: { cls: 'badge-high', emoji: '🏋️' },
}

export default function MonetizationCards({ paths }) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
        <span className="text-3xl">💰</span>
        Monetization Paths
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paths.map((path, i) => {
          const effort = effortConfig[path.effort] || effortConfig['Medium']
          return (
            <div
              key={i}
              className="glass-card p-6 flex flex-col gap-4 hover:border-[#00FF88]/30 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold text-white leading-snug flex-1">{path.title}</h3>
                <span
                  className={`${effort.cls} px-3 py-1 rounded-full text-xs font-bold shrink-0 flex items-center gap-1`}
                >
                  {effort.emoji} {path.effort}
                </span>
              </div>

              {/* Description */}
              <p className="text-white/60 text-sm leading-relaxed flex-1">{path.description}</p>

              {/* Revenue range */}
              <div className="bg-[#00FF88]/10 border border-[#00FF88]/20 rounded-xl p-4">
                <p className="text-xs text-white/50 mb-1">Monthly Revenue Potential</p>
                <p className="text-xl font-black text-[#00FF88]">
                  {formatINR(path.revenue_min)} – {formatINR(path.revenue_max)}
                </p>
                <p className="text-xs text-white/40 mt-0.5">per month</p>
              </div>

              {/* Confidence bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-white/50">Confidence</span>
                  <span className="text-xs font-bold text-white">{path.confidence}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${path.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
