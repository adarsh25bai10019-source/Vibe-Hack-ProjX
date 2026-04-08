import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import InputForm from './components/InputForm'
import UnderdogScore from './components/UnderdogScore'
import MonetizationCards from './components/MonetizationCards'
import EffortIncomeMatrix from './components/EffortIncomeMatrix'
import InvestorMatch from './components/InvestorMatch'
import PitchCapsule from './components/PitchCapsule'
import FirstDollarScreen from './components/FirstDollarScreen'
import PitchRoom from './components/PitchRoom'

const LOADING_MESSAGES = [
  'Analysing your project...',
  'Finding monetization paths...',
  'Matching with investors...',
  'Calculating your first dollar...',
]

function Home() {
  const [state, setState] = useState('input') // 'input' | 'loading' | 'results' | 'error'
  const [results, setResults] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0)

  const handleSubmit = async (formData) => {
    setState('loading')
    setLoadingMsgIndex(0)

    // Cycle loading messages
    const intervals = LOADING_MESSAGES.map((_, i) =>
      setTimeout(() => setLoadingMsgIndex(i), i * 2200)
    )

    try {
      const response = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Analysis failed. Please try again.')
      }

      intervals.forEach(clearTimeout)
      setResults(data)
      setState('results')
      // Scroll to top so first section plays animation
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      intervals.forEach(clearTimeout)
      setErrorMessage(err.message)
      setState('error')
    }
  }

  const handleReset = () => {
    setResults(null)
    setErrorMessage('')
    setState('input')
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }, 10)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* ── INPUT STATE ── */}
      {state === 'input' && <InputForm onSubmit={handleSubmit} />}

      {/* ── LOADING STATE ── */}
      {state === 'loading' && (
        <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4">
          <div className="spinner" />
          <p
            key={loadingMsgIndex}
            className="text-xl font-semibold text-white/80"
            style={{ animation: 'fadeIn 0.5s ease-out' }}
          >
            {LOADING_MESSAGES[loadingMsgIndex]}
          </p>
          <div className="flex gap-2">
            {LOADING_MESSAGES.map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-colors duration-500"
                style={{ background: i <= loadingMsgIndex ? '#00FF88' : 'rgba(255,255,255,0.2)' }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── ERROR STATE ── */}
      {state === 'error' && (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
          <div className="text-6xl">⚠️</div>
          <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
          <p className="text-white/60 max-w-md">{errorMessage}</p>
          <button className="btn-accent" onClick={handleReset}>
            Try Again
          </button>
        </div>
      )}

      {/* ── RESULTS STATE ── */}
      {state === 'results' && results && (
        <div className="relative max-w-6xl mx-auto px-4 py-12 flex flex-col gap-16">
          <button 
            onClick={handleReset} 
            className="absolute top-12 left-4 md:left-8 text-white/50 hover:text-[#00FF88] flex items-center gap-2 transition-colors text-sm font-semibold"
          >
             ← Back to Home
          </button>
          
          {/* Header */}
          <div className="text-center section-animate mt-8 md:mt-0">
            <p className="text-[#00FF88] font-semibold text-sm uppercase tracking-widest mb-3">Analysis Complete</p>
            <h1 className="text-4xl md:text-5xl font-black text-white">Your Project's Full Breakdown</h1>
          </div>

          <div className="section-animate">
            <UnderdogScore
              score={results.underdog_score}
              label={results.score_label}
              reason={results.score_reason}
            />
          </div>

          <div className="section-animate">
            <MonetizationCards paths={results.monetization_paths} />
          </div>

          <div className="section-animate">
            <EffortIncomeMatrix paths={results.monetization_paths} />
          </div>

          <div className="section-animate">
            <InvestorMatch
              investorType={results.investor_type}
              investorTypeReason={results.investor_type_reason}
              opportunities={results.funding_opportunities}
            />
          </div>

          <div className="section-animate">
            <PitchCapsule pitch={results.pitch_capsule} />
          </div>

          <div className="section-animate">
            <FirstDollarScreen firstDollar={results.first_dollar} />
          </div>

          {/* Reset CTA */}
          <div className="text-center section-animate pb-8">
            <button className="btn-accent text-lg px-10 py-4" onClick={handleReset}>
              🔄 Analyse Another Project
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pitch-room" element={<PitchRoom />} />
      </Routes>
    </Router>
  )
}
