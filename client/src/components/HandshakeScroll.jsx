import { useEffect, useRef, useState } from 'react'

const TOTAL_FRAMES = 240
const FRAME_DIGITS = 3 // ezgif-frame-001.jpg

function pad(n, digits) {
  return String(n).padStart(digits, '0')
}

function frameUrl(n) {
  return `/handshake/ezgif-frame-${pad(n, FRAME_DIGITS)}.jpg`
}

export default function HandshakeScroll() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const imagesRef = useRef([]) // preloaded Image objects
  const currentFrameRef = useRef(1)
  const rafRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)

  // ── Preload all frames ──────────────────────────────────────
  useEffect(() => {
    let loadedCount = 0
    const images = []

    // Load in batches of 10 so browser doesn't choke
    const load = (i) => {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
          loadedCount++
          setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100))
          resolve(img)
        }
        img.onerror = () => resolve(null)
        img.src = frameUrl(i)
        images[i - 1] = img
      })
    }

    // Load first 10 frames immediately so canvas shows quickly
    Promise.all(
      Array.from({ length: 10 }, (_, i) => load(i + 1))
    ).then(() => {
      imagesRef.current = images
      setLoaded(true)
      drawFrame(1)
      // Then load the rest
      Promise.all(
        Array.from({ length: TOTAL_FRAMES - 10 }, (_, i) => load(i + 11))
      ).then(() => {
        imagesRef.current = images
      })
    })
  }, [])

  // ── Draw frame on canvas ────────────────────────────────────
  const drawFrame = (frameIndex) => {
    const canvas = canvasRef.current
    const img = imagesRef.current[frameIndex - 1]
    if (!canvas || !img) return

    const ctx = canvas.getContext('2d')
    const { width, height } = canvas

    ctx.clearRect(0, 0, width, height)

    // Draw dark themed background gradient to match site
    const grad = ctx.createLinearGradient(0, 0, width, height)
    grad.addColorStop(0, 'rgba(10, 10, 20, 0)')
    grad.addColorStop(1, 'rgba(10, 10, 20, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)

    // Draw image with mix-blend-mode effect (done via CSS)
    // Center + cover the image, remove white background via CSS mix-blend-mode: multiply
    const aspectRatio = img.naturalWidth / img.naturalHeight
    let drawW = width
    let drawH = width / aspectRatio
    if (drawH < height) {
      drawH = height
      drawW = height * aspectRatio
    }
    const x = (width - drawW) / 2
    const y = (height - drawH) / 2

    ctx.drawImage(img, x, y, drawW, drawH)
  }

  // ── Scroll-driven frame scrubbing ───────────────────────────
  useEffect(() => {
    if (!loaded) return

    const handleScroll = () => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const containerHeight = container.offsetHeight
      const windowHeight = window.innerHeight

      // Progress: 0 when container top hits viewport top, 1 when container bottom hits viewport bottom
      const scrollableDistance = containerHeight - windowHeight
      const scrolled = -rect.top
      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance))

      const frame = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(1 + progress * (TOTAL_FRAMES - 1))))

      if (frame !== currentFrameRef.current) {
        currentFrameRef.current = frame
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(() => drawFrame(frame))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial position

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [loaded])

  // ── Resize canvas to match DPR ──────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const setSize = () => {
      const parent = canvas.parentElement
      const dpr = window.devicePixelRatio || 1
      const w = parent.clientWidth
      const h = parent.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      const ctx = canvas.getContext('2d')
      ctx.scale(dpr, dpr)
      if (loaded) drawFrame(currentFrameRef.current)
    }

    setSize()
    window.addEventListener('resize', setSize)
    return () => window.removeEventListener('resize', setSize)
  }, [loaded])

  return (
    // Sticky scroll container — tall enough to scrub all 240 frames
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${Math.round(TOTAL_FRAMES * 5)}px` }} // ~5px per frame = 1200px total scroll distance
    >
      {/* Sticky canvas panel */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

        {/* Loading overlay */}
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 gap-4">
            <div className="spinner" />
            <p className="text-white/50 text-sm">Loading animation... {loadProgress}%</p>
          </div>
        )}

        {/* Canvas — mix-blend-mode: multiply removes the white bg naturally */}
        <div
          className="relative w-full h-full"
          style={{ maxWidth: 900 }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{
              mixBlendMode: 'screen',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.5s ease',
              filter: 'brightness(1.05) contrast(1.1) saturate(1.2)',
            }}
          />

          {/* Green glow underneath the characters */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0,255,136,0.18) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />

          {/* Left label — Student */}
          <div
            className="absolute bottom-16 left-8 text-center transition-all duration-500"
            style={{ opacity: loaded ? 1 : 0 }}
          >
            <span
              className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(0,255,136,0.1)',
                border: '1px solid rgba(0,255,136,0.3)',
                color: '#00FF88',
              }}
            >
              Student
            </span>
          </div>

          {/* Right label — Founder */}
          <div
            className="absolute bottom-16 right-8 text-center transition-all duration-500"
            style={{ opacity: loaded ? 1 : 0 }}
          >
            <span
              className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.3)',
                color: '#A5B4FC',
              }}
            >
              Founder
            </span>
          </div>

          {/* Center scroll hint — fades out after first scroll */}
          <div
            className="absolute inset-x-0 bottom-6 flex justify-center pointer-events-none"
            style={{ opacity: loaded ? 0.6 : 0 }}
          >
            <p className="text-white/40 text-xs font-medium tracking-widest uppercase animate-bounce">
              ↓ Scroll to watch the handshake
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
