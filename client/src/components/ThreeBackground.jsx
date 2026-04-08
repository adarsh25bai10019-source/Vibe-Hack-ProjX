import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeBackground() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000)
    camera.position.z = 20

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // === THE "STARTUP" CORE (Hidden at first) ===
    const coreGeo = new THREE.IcosahedronGeometry(3.5, 0)
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      emissive: 0x00ff88,
      emissiveIntensity: 0.1,
      transparent: true,
      opacity: 0,
      wireframe: false,
    })
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    
    // Wireframe overlay for the core
    const coreWireMat = new THREE.MeshBasicMaterial({ 
      color: 0x00ff88, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.2 
    })
    const coreWireMesh = new THREE.Mesh(coreGeo, coreWireMat)
    
    // Group them
    const coreGroup = new THREE.Group()
    coreGroup.add(coreMesh)
    coreGroup.add(coreWireMesh)
    coreGroup.position.set(0, 0, -5)
    scene.add(coreGroup)

    // === THE "STUDENT PROJECT" FRAGMENTS ===
    // These represent scattered, unpolished ideas
    const fragmentCount = 12
    const fragGeo = new THREE.OctahedronGeometry(1.2, 0)
    const fragments = []
    
    // Colors matching theme: green, purple, blue
    const colors = [0x00ff88, 0x6366f1, 0x00d4ff]

    for (let i = 0; i < fragmentCount; i++) {
      const mat = new THREE.MeshStandardMaterial({ 
        color: colors[i % colors.length], 
        wireframe: true, 
        transparent: true, 
        opacity: 0.7 
      })
      const mesh = new THREE.Mesh(fragGeo, mat)
      
      // Starting positions (scattered)
      const startX = (Math.random() - 0.5) * 40
      const startY = (Math.random() - 0.5) * 30
      const startZ = (Math.random() - 0.5) * 20 - 10
      
      // Store custom data for animation
      mesh.userData = {
        startX, startY, startZ,
        rotSpeedX: (Math.random() - 0.5) * 0.04,
        rotSpeedY: (Math.random() - 0.5) * 0.04,
      }
      
      mesh.position.set(startX, startY, startZ)
      scene.add(mesh)
      fragments.push(mesh)
    }

    // === PARTICLE FIELD ===
    const particleCount = 200
    const particleGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const particleSizes = new Float32Array(particleCount)
    const particleColors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10
      particleSizes[i] = Math.random() * 2.5 + 0.5

      const isGreen = Math.random() > 0.5
      particleColors[i * 3] = isGreen ? 0 : 0.388
      particleColors[i * 3 + 1] = isGreen ? 1 : 0.4
      particleColors[i * 3 + 2] = isGreen ? 0.533 : 1
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeo.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1))
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))

    const particleMat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // === GRID FLOOR ===
    const gridHelper = new THREE.GridHelper(80, 40, 0x00ff88, 0x00ff8811)
    gridHelper.position.y = -18
    gridHelper.material.transparent = true
    gridHelper.material.opacity = 0.2
    scene.add(gridHelper)

    // === LIGHTS ===
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
    scene.add(ambientLight)

    const mainLight = new THREE.PointLight(0x00ff88, 0, 50)
    mainLight.position.set(0, 0, 0)
    scene.add(mainLight)

    const purpleLight = new THREE.PointLight(0x6366f1, 4, 60)
    purpleLight.position.set(15, -10, 5)
    scene.add(purpleLight)

    // === MOUSE PARALLAX & SCROLL LOGIC ===
    let mouseX = 0
    let mouseY = 0
    let scrollProgress = 0 // 0 to 1

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    
    const handleScroll = () => {
      // Calculate progress based on the 200vh hero section
      const maxScroll = window.innerHeight // 100vh worth of scrolling
      scrollProgress = Math.max(0, Math.min(1, window.scrollY / maxScroll))
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // initial call

    // === RESIZE HANDLER ===
    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // === ANIMATION LOOP ===
    let t = 0
    const animate = () => {
      requestAnimationFrame(animate)
      t += 1

      // 1. Morph the fragments based on scrollProgress
      // Scroll 0 -> Start positions. Scroll 1 -> Merged into core (0,0,-5)
      fragments.forEach((mesh) => {
        const targetX = 0
        const targetY = 0
        const targetZ = -5
        
        // Easing function for smooth converge
        const ease = 1 - Math.pow(1 - scrollProgress, 3) 
        
        mesh.position.x = mesh.userData.startX + (targetX - mesh.userData.startX) * ease
        mesh.position.y = mesh.userData.startY + (targetY - mesh.userData.startY) * ease
        mesh.position.z = mesh.userData.startZ + (targetZ - mesh.userData.startZ) * ease
        
        // Rotate
        mesh.rotation.x += mesh.userData.rotSpeedX + (ease * 0.05) // speed up rotation as they merge
        mesh.rotation.y += mesh.userData.rotSpeedY + (ease * 0.05)
        
        // Fade out slightly when merged
        mesh.material.opacity = 0.7 * (1 - ease)
      })

      // 2. Animate the Core (Startup)
      // As scrollProgress -> 1, core becomes solid and glows brightly
      coreMat.opacity = scrollProgress
      coreMat.emissiveIntensity = 0.1 + (scrollProgress * 2.5) // intense glow
      coreGroup.rotation.y = t * (0.005 + scrollProgress * 0.02) // spins faster
      coreGroup.rotation.x = t * (0.003 + scrollProgress * 0.01)
      
      // Throbbing effect when fully formed
      if (scrollProgress > 0.8) {
        const throb = Math.sin(t * 0.1) * 0.2
        coreGroup.scale.setScalar(1 + throb * (scrollProgress - 0.8))
        mainLight.intensity = 5 + throb * 2
      } else {
        coreGroup.scale.setScalar(1)
        mainLight.intensity = scrollProgress * 5
      }

      // 3. Environment animations
      particles.rotation.y += 0.0005 + (scrollProgress * 0.001) // particles swirl faster
      particles.rotation.x += 0.0002

      // Camera parallax tracking mouse + subtle forward movement on scroll
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.05
      camera.position.y += (mouseY * 1.5 - camera.position.y) * 0.05
      // Push camera forward as we scroll
      camera.position.z = 20 - (scrollProgress * 5)
      
      camera.lookAt(coreGroup.position)

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
