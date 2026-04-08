import { Canvas, useFrame } from '@react-three/fiber'
import { Html, Environment, ContactShadows } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

// ----------------------------------------------------
// DETAILED CHAIR COMPONENT
// ----------------------------------------------------
function DetailedChair({ position, rotationY }) {
  return (
    <group position={position} rotation-y={rotationY}>
      {/* Legs (bottom origin is 0, legs go down) */}
      {/* Front Left */}
      <mesh position={[-0.45, 0.225, 0.4]}><cylinderGeometry args={[0.04, 0.03, 0.45]} /><meshStandardMaterial color="#111122" /></mesh>
      {/* Front Right */}
      <mesh position={[0.45, 0.225, 0.4]}><cylinderGeometry args={[0.04, 0.03, 0.45]} /><meshStandardMaterial color="#111122" /></mesh>
      {/* Back Left */}
      <mesh position={[-0.45, 0.225, -0.4]}><cylinderGeometry args={[0.04, 0.03, 0.45]} /><meshStandardMaterial color="#111122" /></mesh>
      {/* Back Right */}
      <mesh position={[0.45, 0.225, -0.4]}><cylinderGeometry args={[0.04, 0.03, 0.45]} /><meshStandardMaterial color="#111122" /></mesh>

      {/* Seat Base */}
      <mesh position={[0, 0.51, 0]}><boxGeometry args={[1.1, 0.12, 1.0]} /><meshStandardMaterial color="#1a1a2a" /></mesh>
      {/* Seat Cushion */}
      <mesh position={[0, 0.62, 0]}><boxGeometry args={[1.0, 0.1, 0.92]} /><meshStandardMaterial color="#2a2a3e" /></mesh>
      
      {/* Backrest */}
      <mesh position={[0, 1.16, -0.44]}><boxGeometry args={[1.0, 1.1, 0.12]} /><meshStandardMaterial color="#1a1a2a" /></mesh>
      {/* Backrest Cushion */}
      <mesh position={[0, 1.16, -0.33]}><boxGeometry args={[0.92, 1.0, 0.1]} /><meshStandardMaterial color="#2a2a3e" /></mesh>

      {/* Armrests */}
      <mesh position={[-0.55, 0.85, 0]}><boxGeometry args={[0.08, 0.06, 0.75]} /><meshStandardMaterial color="#1a1a2a" /></mesh>
      <mesh position={[0.55, 0.85, 0]}><boxGeometry args={[0.08, 0.06, 0.75]} /><meshStandardMaterial color="#1a1a2a" /></mesh>
    </group>
  )
}

// ----------------------------------------------------
// FLOATING NAME PLATE COMPONENT
// ----------------------------------------------------
function NamePlate({ name, title, isSpeaking }) {
  const groupRef = useRef()
  useFrame((state) => {
    if (groupRef.current) {
      // Slight bob animation: 0.6 + sine wave
      groupRef.current.position.y = 0.6 + Math.sin(state.clock.elapsedTime * 1.5) * 0.03
    }
  })

  return (
    <group ref={groupRef} position={[0, 0.6, 0]}>
      <Html center zIndexRange={[100, 0]}>
        <div 
          style={{
            background: 'rgba(5,3,15,0.85)',
            border: '1px solid rgba(0,255,136,0.3)',
            borderRadius: '8px',
            padding: '6px 14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: isSpeaking ? '0 0 15px rgba(0,255,136,0.5)' : 'none',
            transition: 'box-shadow 0.3s ease',
            pointerEvents: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{name}</span>
          <span style={{ fontSize: '10px', color: 'rgba(0,255,136,0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</span>
        </div>
      </Html>
    </group>
  )
}

// ----------------------------------------------------
// SPEECH BUBBLE COMPONENT
// ----------------------------------------------------
function SpeechBubble({ text }) {
  if (!text) return null;
  return (
    <Html position={[0, 0.4, 0.2]} center zIndexRange={[90, 0]}>
      <div 
        className="bg-white/95 backdrop-blur-md text-slate-900 p-4 rounded-xl shadow-2xl"
        style={{ 
          width: 'max-content',
          maxWidth: '260px',
          borderBottomLeftRadius: '4px',
          animation: 'fadeUp 0.3s ease-out',
          border: '1px solid rgba(0,0,0,0.1)'
        }}
      >
        <p className="text-[13px] font-semibold leading-relaxed relative z-10">
          {text}
        </p>
        <div className="absolute -bottom-2 left-4 w-4 h-4 bg-white/95 transform rotate-45 border-r border-b border-black/10"></div>
      </div>
    </Html>
  )
}

// ----------------------------------------------------
// INVESTOR 1: ARJUN MEHTA
// ----------------------------------------------------
function ArjunMehta({ position, rotationY, isSpeaking, text }) {
  const headRef = useRef()
  const mouthRef = useRef()
  const torsoRef = useRef()
  const auraRef = useRef()
  const auraMatRef = useRef()

  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // Breathing (always on)
    if (torsoRef.current) torsoRef.current.scale.y = 1 + Math.sin(time * 1.2) * 0.012

    if (headRef.current) {
      if (isSpeaking) {
        // Head nod
        headRef.current.rotation.x = Math.sin(time * 3) * 0.06
        // Mouth movement
        if (mouthRef.current) mouthRef.current.scale.y = 1 + Math.abs(Math.sin(time * 8)) * 0.8
        
        // Aura rotation and pulse
        if (auraRef.current) auraRef.current.rotation.y = time * 0.5
        if (auraMatRef.current) auraMatRef.current.opacity = 0.3 + Math.abs(Math.sin(time * 5)) * 0.5
      } else {
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0, 0.1)
        if (mouthRef.current) mouthRef.current.scale.y = 1
        if (auraMatRef.current) auraMatRef.current.opacity = 0
      }
    }
  })

  // Torso x rotation -0.08 rad (forward lean)
  return (
    <group position={position} rotation-y={rotationY}>
      
      {/* Torso/Body block */}
      <group position={[0, 1.1, 0]} rotation-x={-0.08} ref={torsoRef}>
        {/* Shirt */}
        <mesh><boxGeometry args={[0.72, 0.95, 0.38]} /><meshStandardMaterial color="#d4a0b0" /></mesh>
        
        {/* Collar left/right */}
        <mesh position={[-0.1, 0.48, 0.2]} rotation-z={0.3} rotation-x={0.1}><boxGeometry args={[0.15, 0.05, 0.02]} /><meshStandardMaterial color="#fff5f5" /></mesh>
        <mesh position={[0.1, 0.48, 0.2]} rotation-z={-0.3} rotation-x={0.1}><boxGeometry args={[0.15, 0.05, 0.02]} /><meshStandardMaterial color="#fff5f5" /></mesh>
        
        {/* Button line */}
        <mesh position={[0, 0.05, 0.195]}><boxGeometry args={[0.03, 0.8, 0.05]} /><meshStandardMaterial color="#c090a0" /></mesh>

        {/* Neck */}
        <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.13, 0.15, 0.22]} /><meshStandardMaterial color="#8B5A3C" /></mesh>

        {/* Head */}
        <group position={[0, 0.8, 0]} ref={headRef}>
          <mesh><sphereGeometry args={[0.28, 32, 32]} /><meshStandardMaterial color="#8B5A3C" roughness={0.8} /></mesh>
          
          {/* Eyes */}
          <mesh position={[-0.09, 0.06, 0.26]}><sphereGeometry args={[0.04]} /><meshStandardMaterial color="#1a0a00" /></mesh>
          <mesh position={[0.09, 0.06, 0.26]}><sphereGeometry args={[0.04]} /><meshStandardMaterial color="#1a0a00" /></mesh>
          
          {/* Eyebrows */}
          <mesh position={[-0.09, 0.13, 0.26]} rotation-z={-0.1}><boxGeometry args={[0.08, 0.015, 0.01]} /><meshStandardMaterial color="#2a1a00" /></mesh>
          <mesh position={[0.09, 0.13, 0.26]} rotation-z={0.1}><boxGeometry args={[0.08, 0.015, 0.01]} /><meshStandardMaterial color="#2a1a00" /></mesh>
          
          {/* Nose */}
          <mesh position={[0, -0.02, 0.27]}><cylinderGeometry args={[0.025, 0.025, 0.05]} /><meshStandardMaterial color="#7a4a2c" /></mesh>
          
          {/* Mouth */}
          <mesh position={[0, -0.1, 0.26]} ref={mouthRef}><boxGeometry args={[0.1, 0.02, 0.01]} /><meshStandardMaterial color="#5a2a1a" /></mesh>
          
          {/* Ears */}
          <mesh position={[-0.27, 0, 0]} scale-z={0.4}><sphereGeometry args={[0.07]} /><meshStandardMaterial color="#8B5A3C" /></mesh>
          <mesh position={[0.27, 0, 0]} scale-z={0.4}><sphereGeometry args={[0.07]} /><meshStandardMaterial color="#8B5A3C" /></mesh>
          
           {/* Hair */}
          <group position={[0, 0.05, 0]}>
            <mesh><sphereGeometry args={[0.30, 32, 16, 0, Math.PI*2, 0, Math.PI/2]} /><meshStandardMaterial color="#1a0a00" /></mesh>
            <mesh position={[0, 0.22, 0.2]}><sphereGeometry args={[0.1]} /><meshStandardMaterial color="#1a0a00" /></mesh>
          </group>

          {/* Speaking Aura */}
          <mesh ref={auraRef} position={[0, 0, 0.1]}>
             <ringGeometry args={[0.32, 0.36, 32]} />
             <meshBasicMaterial ref={auraMatRef} color="#00FF88" transparent opacity={0} depthTest={false} />
          </mesh>

          <NamePlate name="Arjun Mehta" title="Technical Evaluator" isSpeaking={isSpeaking} />
          {isSpeaking && <SpeechBubble text={text} />}
        </group>

        {/* Arms resting on knees (Shoulders at sides, angled down and forward) */}
        {/* Left Arm */}
        <group position={[-0.45, 0.35, 0]} rotation-x={0.4} rotation-z={0.15}>
          <mesh position={[0, -0.32, 0]}><cylinderGeometry args={[0.13, 0.13, 0.65]} /><meshStandardMaterial color="#d4a0b0" /></mesh>
          {/* Forearm */}
          <mesh position={[0, -0.85, 0.1]} rotation-x={-0.2}><cylinderGeometry args={[0.1, 0.1, 0.45]} /><meshStandardMaterial color="#8B5A3C" /></mesh>
          {/* Hand */}
          <mesh position={[0, -1.15, 0.15]} scale-y={0.8}><sphereGeometry args={[0.13]} /><meshStandardMaterial color="#8B5A3C" /></mesh>
        </group>
        {/* Right Arm */}
        <group position={[0.45, 0.35, 0]} rotation-x={0.4} rotation-z={-0.15}>
          <mesh position={[0, -0.32, 0]}><cylinderGeometry args={[0.13, 0.13, 0.65]} /><meshStandardMaterial color="#d4a0b0" /></mesh>
          <mesh position={[0, -0.85, 0.1]} rotation-x={-0.2}><cylinderGeometry args={[0.1, 0.1, 0.45]} /><meshStandardMaterial color="#8B5A3C" /></mesh>
          <mesh position={[0, -1.15, 0.15]} scale-y={0.8}><sphereGeometry args={[0.13]} /><meshStandardMaterial color="#8B5A3C" /></mesh>
        </group>
      </group>

      {/* Legs at 90 degrees at hip (sitting) */}
      <group position={[0, 0.8, 0.4]}>
        {/* Thighs */}
        <mesh position={[-0.18, 0, 0.3]} rotation-x={Math.PI/2}><cylinderGeometry args={[0.16, 0.16, 0.6]} /><meshStandardMaterial color="#2a2a3a" /></mesh>
        <mesh position={[0.18, 0, 0.3]} rotation-x={Math.PI/2}><cylinderGeometry args={[0.16, 0.16, 0.6]} /><meshStandardMaterial color="#2a2a3a" /></mesh>
        
        {/* Calves (down) */}
        <mesh position={[-0.18, -0.4, 0.6]}><cylinderGeometry args={[0.16, 0.16, 0.85]} /><meshStandardMaterial color="#2a2a3a" /></mesh>
        <mesh position={[0.18, -0.4, 0.6]}><cylinderGeometry args={[0.16, 0.16, 0.85]} /><meshStandardMaterial color="#2a2a3a" /></mesh>

        {/* Shoes */}
        <mesh position={[-0.18, -0.85, 0.7]} rotation-x={0.1}><boxGeometry args={[0.18, 0.1, 0.36]} /><meshStandardMaterial color="#3a2010" /></mesh>
        <mesh position={[0.18, -0.85, 0.7]} rotation-x={0.1}><boxGeometry args={[0.18, 0.1, 0.36]} /><meshStandardMaterial color="#3a2010" /></mesh>
      </group>
    </group>
  )
}


// ----------------------------------------------------
// INVESTOR 2: PRIYA NAIR
// ----------------------------------------------------
function PriyaNair({ position, rotationY, isSpeaking, text }) {
  const headRef = useRef()
  const mouthRef = useRef()
  const torsoRef = useRef()
  const gestureArmRef = useRef()
  const auraRef = useRef()
  const auraMatRef = useRef()

  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (torsoRef.current) torsoRef.current.scale.y = 1 + Math.sin(time * 1.2) * 0.012

    if (isSpeaking) {
      if (headRef.current) headRef.current.rotation.x = Math.sin(time * 3) * 0.06
      if (mouthRef.current) mouthRef.current.scale.y = 1 + Math.abs(Math.sin(time * 8)) * 0.8
      if (gestureArmRef.current) gestureArmRef.current.rotation.x = Math.sin(time * 2.5) * 0.2 - 0.3
      
      if (auraRef.current) auraRef.current.rotation.y = time * 0.5
      if (auraMatRef.current) auraMatRef.current.opacity = 0.3 + Math.abs(Math.sin(time * 5)) * 0.5
    } else {
      if (headRef.current) headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0, 0.1)
      if (mouthRef.current) mouthRef.current.scale.y = 1
      if (gestureArmRef.current) gestureArmRef.current.rotation.x = THREE.MathUtils.lerp(gestureArmRef.current.rotation.x, 0, 0.1)
      if (auraMatRef.current) auraMatRef.current.opacity = 0
    }
  })

  // Body turned slightly +0.15 rad
  return (
    <group position={position} rotation-y={rotationY}>
      <group rotation-y={0.15}>
        
        {/* Torso/Body */}
        <group position={[0, 1.1, 0]} ref={torsoRef}>
          {/* Blazer */}
          <mesh><boxGeometry args={[0.70, 0.92, 0.36]} /><meshStandardMaterial color="#1a2a4a" /></mesh>
          
          {/* Lapels */}
          <mesh position={[-0.1, 0.2, 0.19]} rotation-z={0.3} rotation-x={0.1}><boxGeometry args={[0.15, 0.5, 0.02]} /><meshStandardMaterial color="#152238" /></mesh>
          <mesh position={[0.1, 0.2, 0.19]} rotation-z={-0.3} rotation-x={0.1}><boxGeometry args={[0.15, 0.5, 0.02]} /><meshStandardMaterial color="#152238" /></mesh>
          
          {/* Inner shirt */}
          <mesh position={[0, 0.3, 0.185]}><boxGeometry args={[0.1, 0.4, 0.02]} /><meshStandardMaterial color="#fff8f0" /></mesh>

          {/* Neck */}
          <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.12, 0.12, 0.2]} /><meshStandardMaterial color="#C68B59" /></mesh>

          {/* Head */}
          <group position={[0, 0.77, 0]} ref={headRef}>
            <mesh><sphereGeometry args={[0.27, 32, 32]} /><meshStandardMaterial color="#C68B59" roughness={0.75} /></mesh>
            
            {/* Eyes */}
            <mesh position={[-0.09, 0.05, 0.25]}><sphereGeometry args={[0.04]} /><meshStandardMaterial color="#1a0800" /></mesh>
            <mesh position={[0.09, 0.05, 0.25]}><sphereGeometry args={[0.04]} /><meshStandardMaterial color="#1a0800" /></mesh>
            
            {/* Eyelashes */}
            <mesh position={[-0.09, 0.1, 0.26]} rotation-z={-0.05}><boxGeometry args={[0.09, 0.01, 0.005]} /><meshStandardMaterial color="#0a0500" /></mesh>
            <mesh position={[0.09, 0.1, 0.26]} rotation-z={0.05}><boxGeometry args={[0.09, 0.01, 0.005]} /><meshStandardMaterial color="#0a0500" /></mesh>
            
            {/* Nose bump */}
            <mesh position={[0, -0.01, 0.26]} rotation-x={0.1}><cylinderGeometry args={[0.022, 0.022, 0.04]} /><meshStandardMaterial color="#b07840" /></mesh>
            
            {/* Lips */}
            <mesh position={[0, -0.09, 0.25]} ref={mouthRef}><boxGeometry args={[0.12, 0.03, 0.01]} /><meshStandardMaterial color="#c06060" /></mesh>
            
            {/* Ears */}
            <mesh position={[-0.26, 0, 0]} scale-z={0.4}><sphereGeometry args={[0.065]} /><meshStandardMaterial color="#C68B59" /></mesh>
            <mesh position={[0.26, 0, 0]} scale-z={0.4}><sphereGeometry args={[0.065]} /><meshStandardMaterial color="#C68B59" /></mesh>
            
            {/* Earrings */}
            <mesh position={[-0.27, -0.08, 0]}><sphereGeometry args={[0.03]} /><meshStandardMaterial color="#d4a800" metalness={0.8} roughness={0.2} /></mesh>
            <mesh position={[0.27, -0.08, 0]}><sphereGeometry args={[0.03]} /><meshStandardMaterial color="#d4a800" metalness={0.8} roughness={0.2} /></mesh>

            {/* Hair */}
            <mesh><sphereGeometry args={[0.31, 32, 16, 0, Math.PI*2, 0, Math.PI/1.8]} /><meshStandardMaterial color="#0a0500" /></mesh>
            <mesh position={[0, 0.05, -0.28]}><sphereGeometry args={[0.18]} /><meshStandardMaterial color="#0a0500" /></mesh>
            {/* Strand */}
            <mesh position={[0.15, 0.2, 0.22]} rotation-z={-0.5} rotation-x={0.5}><cylinderGeometry args={[0.01, 0.01, 0.15]} /><meshStandardMaterial color="#0a0500" /></mesh>

            {/* Speaking Aura */}
            <mesh ref={auraRef} position={[0, 0, 0.1]}>
               <ringGeometry args={[0.32, 0.36, 32]} />
               <meshBasicMaterial ref={auraMatRef} color="#00FF88" transparent opacity={0} depthTest={false} />
            </mesh>

            <NamePlate name="Priya Nair" title="Business Shark" isSpeaking={isSpeaking} />
            {isSpeaking && <SpeechBubble text={text} />}
          </group>

          {/* Left Arm (Resting) */}
          <group position={[-0.45, 0.35, 0]} rotation-x={0.3} rotation-z={0.1}>
            <mesh position={[0, -0.31, 0]}><cylinderGeometry args={[0.12, 0.12, 0.62]} /><meshStandardMaterial color="#1a2a4a" /></mesh>
            <mesh position={[0, -0.63, 0]}><cylinderGeometry args={[0.125, 0.125, 0.05]} /><meshStandardMaterial color="#fff8f0" /></mesh>
            <mesh position={[0, -0.85, 0.1]} rotation-x={-0.2}><cylinderGeometry args={[0.09, 0.09, 0.42]} /><meshStandardMaterial color="#C68B59" /></mesh>
            <mesh position={[0, -1.1, 0.15]} scale-y={0.7}><sphereGeometry args={[0.12]} /><meshStandardMaterial color="#C68B59" /></mesh>
          </group>
          
          {/* Right Arm (Gesture Arm) */}
          <group position={[0.45, 0.35, 0]} rotation-z={-0.1} ref={gestureArmRef}>
            <mesh position={[0, -0.31, 0]}><cylinderGeometry args={[0.12, 0.12, 0.62]} /><meshStandardMaterial color="#1a2a4a" /></mesh>
            <mesh position={[0, -0.63, 0]}><cylinderGeometry args={[0.125, 0.125, 0.05]} /><meshStandardMaterial color="#fff8f0" /></mesh>
            {/* Gesture Forearm angled up */}
            <group position={[0, -0.65, 0]} rotation-x={1.4}>
               <mesh position={[0, -0.21, 0]}><cylinderGeometry args={[0.09, 0.09, 0.42]} /><meshStandardMaterial color="#C68B59" /></mesh>
               <mesh position={[0, -0.45, 0]} scale-y={0.7}><sphereGeometry args={[0.12]} /><meshStandardMaterial color="#C68B59" /></mesh>
            </group>
          </group>
        </group>

        {/* Legs (Crossed) */}
        <group position={[0, 0.8, 0.4]}>
          <mesh position={[-0.1, 0.15, 0.4]} rotation-x={1.4} rotation-z={-0.2}><cylinderGeometry args={[0.16, 0.16, 0.6]} /><meshStandardMaterial color="#1a2a4a" /></mesh>
          <mesh position={[0.15, 0, 0.3]} rotation-x={Math.PI/2}><cylinderGeometry args={[0.16, 0.16, 0.6]} /><meshStandardMaterial color="#1a2a4a" /></mesh>
          
          {/* Calves */}
          <mesh position={[-0.3, -0.3, 0.65]} rotation-z={-0.1}><cylinderGeometry args={[0.16, 0.16, 0.85]} /><meshStandardMaterial color="#1a2a4a" /></mesh>
          <mesh position={[0.15, -0.4, 0.6]}><cylinderGeometry args={[0.16, 0.16, 0.85]} /><meshStandardMaterial color="#1a2a4a" /></mesh>

          {/* Shoes - pointed heels */}
          <group position={[-0.35, -0.75, 0.7]} rotation-x={0.4}>
             <mesh position={[0, 0, 0.1]}><boxGeometry args={[0.15, 0.08, 0.32]} /><meshStandardMaterial color="#0a0a1a" /></mesh>
             <mesh position={[0, -0.05, -0.05]}><cylinderGeometry args={[0.02, 0.04, 0.1]} /><meshStandardMaterial color="#0a0a1a" /></mesh>
          </group>
          <group position={[0.15, -0.85, 0.7]} rotation-x={0.1}>
             <mesh position={[0, 0, 0.1]}><boxGeometry args={[0.15, 0.08, 0.32]} /><meshStandardMaterial color="#0a0a1a" /></mesh>
             <mesh position={[0, -0.05, -0.05]}><cylinderGeometry args={[0.02, 0.04, 0.1]} /><meshStandardMaterial color="#0a0a1a" /></mesh>
          </group>
        </group>

      </group>
    </group>
  )
}

// ----------------------------------------------------
// MAIN SCENE
// ----------------------------------------------------
export default function PitchScene({ investorText, investorIdx, isThinking }) {
  return (
    <Canvas camera={{ position: [0, 2.0, 5.5], fov: 45 }}>
      <color attach="background" args={['#0A0A0F']} />
      <Environment preset="city" />

      {/* Upgraded Lighting Rig */}
      <ambientLight intensity={0.2} />
      {/* Key light: warm main light from upper right */}
      <directionalLight position={[3, 5, 4]} color="#fff5e0" intensity={1.2} castShadow />
      {/* Fill light: cool blue fill from left */}
      <directionalLight position={[-3, 3, 2]} color="#d0e8ff" intensity={0.4} />
      {/* Rim light: subtle green rim from behind */}
      <directionalLight position={[0, 2, -4]} color="#00FF88" intensity={0.15} />
      
      {/* Avatar spots directly focused */}
      <spotLight position={[-2.2, 4, 3]} target-position={[-2.2, 1.5, 0]} color="#fff0e0" intensity={0.8} angle={0.4} penumbra={0.5} castShadow />
      <spotLight position={[2.2, 4, 3]} target-position={[2.2, 1.5, 0]} color="#fff0e0" intensity={0.8} angle={0.4} penumbra={0.5} castShadow />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
         <planeGeometry args={[30, 30]} />
         <meshStandardMaterial color="#0A0A0F" roughness={1} metalness={0} />
      </mesh>
      <gridHelper args={[30, 30, '#00ff88', '#ffffff']} position={[0, 0.01, 0]} material-transparent material-opacity={0.05} />

      {/* The Central Desk */}
      <group position={[0, 0.45, 1.2]}>
        {/* Top */}
        <mesh receiveShadow castShadow position={[0, 0.45, 0]}>
           <boxGeometry args={[6.5, 0.1, 1.8]} />
           <meshStandardMaterial color="#1a1a24" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Legs */}
        <mesh position={[-3, 0, 0]} receiveShadow castShadow><boxGeometry args={[0.05, 0.9, 1.5]} /><meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.2} /></mesh>
        <mesh position={[3, 0, 0]} receiveShadow castShadow><boxGeometry args={[0.05, 0.9, 1.5]} /><meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.2} /></mesh>
      </group>

      {/* Chairs */}
      <DetailedChair position={[-2.2, 0, -0.6]} rotationY={0.15} />
      <DetailedChair position={[2.2, 0, -0.6]} rotationY={-0.15} />

      {/* Investor 1: Arjun Mehta - Technical */}
      <ArjunMehta 
        position={[-2.2, 0.0, -0.6]} 
        rotationY={0.15}
        isSpeaking={investorIdx === 0 && !isThinking} 
        text={investorText} 
      />
      
      {/* Investor 2: Priya Nair - Business */}
      <PriyaNair 
        position={[2.2, 0.0, -0.6]} 
        rotationY={-0.15}
        isSpeaking={investorIdx === 1 && !isThinking} 
        text={investorText} 
      />

      {/* Thinking Indicator */}
      {isThinking && (
        <Html position={[0, 2.8, 0]} center>
           <div className="bg-[#00FF88]/20 backdrop-blur-md text-[#00FF88] border border-[#00FF88]/50 p-2 rounded-full px-6 text-sm font-bold shadow-[0_0_20px_rgba(0,255,136,0.3)] animate-pulse flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-ping" />
             Investors are synthesizing...
           </div>
        </Html>
      )}

      <ContactShadows position={[0, 0, 0]} scale={20} blur={2.5} opacity={0.6} />
    </Canvas>
  )
}
