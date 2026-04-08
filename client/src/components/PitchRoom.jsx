import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PitchScene from './PitchScene'
import Logo from './Logo'

export default function PitchRoom() {
  const navigate = useNavigate()
  
  const [pitchText, setPitchText] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [feedback, setFeedback] = useState(null)
  
  // 0: input form, 1: tech speaking, 2: biz speaking, 3: modal
  const [scenarioStep, setScenarioStep] = useState(0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!pitchText.trim()) return

    setIsThinking(true)
    try {
      const response = await fetch('/api/pitch/feedback', {
        method: 'POST',
        headers : { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pitchText })
      })
      const data = await response.json()
      
      setFeedback(data)
      setIsThinking(false)
      
      // Sequence the playback
      setScenarioStep(1); // Tech speaks
      setTimeout(() => {
        setScenarioStep(2); // Biz speaks
        setTimeout(() => {
          setScenarioStep(3); // Show modal
        }, 4000);
      }, 4000);

    } catch(err) {
      console.error("Chat Error:", err);
      setIsThinking(false);
      alert("Failed to analyze pitch.");
    }
  }

  // Determine what the 3D scene should render
  let currentInvestorIdx = null;
  let currentInvestorText = '';

  if (scenarioStep === 1 && feedback) {
     currentInvestorIdx = 0; // Tech
     currentInvestorText = feedback.techReply;
  } else if (scenarioStep === 2 && feedback) {
     currentInvestorIdx = 1; // Biz
     currentInvestorText = feedback.bizReply;
  }

  return (
    <div className="relative w-full h-screen bg-[#0A0A0F] overflow-hidden flex flex-col font-sans">
       
       {/* Top Nav */}
       <div className="absolute top-0 inset-x-0 z-20 flex justify-between items-center p-6 pointer-events-auto">
         <div className="flex items-center gap-6">
           <Logo />
           <button onClick={() => navigate('/')} className="text-white/50 hover:text-[#00FF88] flex items-center gap-2 transition-colors text-sm font-semibold ml-4">
              ← Back to Home
           </button>
         </div>
         <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/30">
              Technical Evaluator
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#6366F1]/20 text-[#6366F1] border border-[#6366F1]/30">
              Business Shark
            </span>
         </div>
       </div>

       {/* 3D Scene */}
       <div className="flex-grow relative z-0">
         <PitchScene 
            investorText={currentInvestorText} 
            investorIdx={currentInvestorIdx} 
            isThinking={isThinking} 
         />
       </div>

       {/* Input UI Overlay */}
       {scenarioStep === 0 && (
         <div className="absolute bottom-10 inset-x-4 max-w-3xl mx-auto z-10 bg-[#0F0F16]/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl animate-fadeUp">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               <div>
                  <label className="block text-sm font-bold text-white/80 mb-2 uppercase tracking-wide">
                     Paste your pitch idea:
                  </label>
                  <textarea 
                     className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#00FF88]/50 resize-none"
                     rows={5}
                     placeholder="e.g. A marketplace app for college students to trade textbooks using campus coins..."
                     value={pitchText}
                     onChange={e => setPitchText(e.target.value)}
                     disabled={isThinking}
                     required
                  />
               </div>
               <button 
                  type="submit"
                  disabled={isThinking || !pitchText.trim()}
                  className={`w-full py-4 rounded-full font-bold text-slate-900 transition-all text-lg ${isThinking ? 'bg-white/20 text-white cursor-wait' : 'bg-[#00FF88] hover:bg-[#00D4FF] hover:scale-[1.02] shadow-[0_0_20px_rgba(0,255,136,0.2)]'}`}
               >
                  {isThinking ? 'Investors are thinking... 🤔' : 'Submit Pitch to Investors'}
               </button>
            </form>
         </div>
       )}

       {/* Feedback Modal */}
       {scenarioStep === 3 && feedback && (
         <div className="absolute inset-0 z-50 bg-[#0A0A0F]/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-fadeIn">
            <div className="bg-[#12121A] border border-[#00FF88]/30 max-w-2xl w-full rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#00FF88] to-transparent opacity-50" />
               
               <h2 className="text-3xl font-black text-white mb-2">Final Verdict</h2>
               <p className="text-white/50 mb-8">Overall startup evaluation</p>

               <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-white/5 p-6 rounded-2xl border border-[#00D4FF]/30">
                     <p className="text-[#00D4FF] font-bold text-sm mb-2 uppercase tracking-wider">Tech Viability</p>
                     <p className="text-4xl font-black text-white">{feedback.techScore || 0}<span className="text-xl text-white/30">/100</span></p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl border border-[#6366F1]/30">
                     <p className="text-[#6366F1] font-bold text-sm mb-2 uppercase tracking-wider">Business Viability</p>
                     <p className="text-4xl font-black text-white">{feedback.bizScore || 0}<span className="text-xl text-white/30">/100</span></p>
                  </div>
               </div>

               <div className="bg-white/5 p-6 rounded-2xl border border-[#00FF88]/20 mb-8">
                  <p className="text-white/90 leading-relaxed text-lg">"{
                    (feedback.techScore === 0 && feedback.bizScore === 0) 
                      ? 'You need to work more' 
                      : (feedback.verdict || 'Good job!')
                  }"</p>
               </div>

               <button 
                 onClick={() => { setFeedback(null); setPitchText(''); setScenarioStep(0); }}
                 className="w-full py-4 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white transition-colors"
               >
                 Pitch Another Idea
               </button>
            </div>
         </div>
       )}
    </div>
  )
}
