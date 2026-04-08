export default function Logo() {
  return (
    <div className="flex items-center gap-4 select-none">
      {/* Icon representing the `<` shape from the uploaded logo */}
      <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        {/* Top Arm - Bright Green */}
        <path d="M 30 4 L 14 4 L 2 16 L 8 16 L 18 10 L 30 10 Z" fill="#00FF88" />
        {/* Bottom Arm - Darker Green */}
        <path d="M 2 16 L 14 28 L 30 28 L 30 22 L 18 22 L 8 16 Z" fill="#1B8144" />
        {/* Right connector chunk for the geometric illusion */}
        <path d="M 24 10 L 30 10 L 30 28 L 24 28 Z" fill="#115522" opacity="0.8" />
      </svg>
      
      {/* Text Section mimicking the logo font */}
      <div className="flex flex-col translate-y-0.5">
         <div className="text-3xl font-black text-white leading-none tracking-tight flex items-baseline">
           Proj&nbsp;<span className="text-[#00FF88]">X</span>
         </div>
         <div className="text-[11px] font-black text-white/40 tracking-[0.25em] uppercase mt-1 leading-none ml-1">
           From Project To
         </div>
       </div>
    </div>
  )
}
