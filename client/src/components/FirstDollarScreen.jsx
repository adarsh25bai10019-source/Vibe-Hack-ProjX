function formatINR(num) {
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`
  if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`
  return `₹${num}`
}

export default function FirstDollarScreen({ firstDollar }) {
  const { days, amount, action, founder_type, indian_startup_parallel } = firstDollar

  const linkedInText = encodeURIComponent(
    `Just analysed my startup project with ProjX and here's what I found:\n\n🎯 My first ₹ is ${days} days away.\n💡 I'm a "${founder_type}"\n🚀 ${indian_startup_parallel}\n\nIf you're a student founder, this tool will change how you see your project. 👇\n\n#StudentFounder #IndianStartup #BuildInPublic`
  )
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?summary=${linkedInText}`

  return (
    <section>
      <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
        <span className="text-3xl">⚡</span>
        Your First Dollar Roadmap
      </h2>

      <div
        className="rounded-2xl overflow-hidden relative"
        style={{
          background: 'linear-gradient(135deg, #0A0A0F 0%, #0F1F15 50%, #0A0A0F 100%)',
          border: '1px solid rgba(0, 255, 136, 0.2)',
          boxShadow: '0 0 60px rgba(0, 255, 136, 0.08), inset 0 1px 0 rgba(0, 255, 136, 0.1)',
        }}
      >
        {/* Decorative glow blob */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0, 255, 136, 0.12), transparent)',
          }}
        />

        <div className="relative z-10 px-8 py-12 md:px-16 md:py-16 text-center flex flex-col items-center gap-8">
          {/* Main headline */}
          <div>
            <p className="text-sm uppercase tracking-widest text-[#00FF88]/60 font-semibold mb-4">
              Your Financial Milestone
            </p>
            <h2
              className="text-4xl md:text-6xl font-black text-white leading-tight"
              style={{ textShadow: '0 0 40px rgba(0, 255, 136, 0.3)' }}
            >
              Your first{' '}
              <span
                className="text-[#00FF88]"
                style={{
                  textShadow: '0 0 20px rgba(0, 255, 136, 0.6)',
                  filter: 'drop-shadow(0 0 8px rgba(0,255,136,0.4))',
                }}
              >
                {formatINR(amount)}
              </span>{' '}
              is{' '}
              <span className="text-[#00FF88]">{days} days</span> away.
            </h2>
          </div>

          {/* Divider */}
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#00FF88] to-transparent" />

          {/* Today's action */}
          <div
            className="max-w-2xl w-full rounded-2xl p-6 text-left"
            style={{
              background: 'rgba(0, 255, 136, 0.06)',
              border: '1px solid rgba(0, 255, 136, 0.15)',
            }}
          >
            <p className="text-xs font-bold text-[#00FF88]/60 uppercase tracking-widest mb-3">
              🎯 Your move for today
            </p>
            <p className="text-white text-lg leading-relaxed font-medium">{action}</p>
          </div>

          {/* Founder type badge */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-white/40 text-sm">You are a</p>
            <div
              className="px-8 py-3 rounded-full text-xl font-black"
              style={{
                background: 'rgba(0, 255, 136, 0.1)',
                border: '2px solid rgba(0, 255, 136, 0.3)',
                color: '#00FF88',
                boxShadow: '0 0 20px rgba(0, 255, 136, 0.2)',
              }}
            >
              {founder_type}
            </div>
          </div>

          {/* Indian startup parallel */}
          <div
            className="max-w-xl text-center px-6 py-5 rounded-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <p className="text-white/80 text-base italic leading-relaxed">
              "{indian_startup_parallel}"
            </p>
          </div>

          {/* LinkedIn share button */}
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="linkedinShareBtn"
            className="flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-base transition-all duration-200 hover:scale-105 hover:shadow-xl"
            style={{
              background: '#0077B5',
              color: '#fff',
              boxShadow: '0 4px 20px rgba(0, 119, 181, 0.3)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            Share on LinkedIn →
          </a>
        </div>
      </div>
    </section>
  )
}
