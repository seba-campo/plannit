"use client"

import { useRef, useEffect, useCallback } from "react"

interface Particle {
  x: number
  y: number
  baseX: number
  baseY: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
}

const PARTICLE_COLORS = [
  "0, 255, 255",    // cyan
  "59, 130, 246",   // blue
  "99, 179, 255",   // light blue
  "0, 200, 220",    // teal-cyan
]

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)
  const dimensionsRef = useRef({ w: 0, h: 0 })

  const createParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = []
    const density = Math.floor((width * height) / 6000)
    const count = Math.min(Math.max(density, 80), 400)

    for (let i = 0; i < count; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const colorIndex = Math.floor(Math.random() * PARTICLE_COLORS.length)
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: 0,
        vy: 0,
        size: 1 + Math.random() * 2.5,
        opacity: 0.15 + Math.random() * 0.5,
        color: PARTICLE_COLORS[colorIndex],
      })
    }
    return particles
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let running = true

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dimensionsRef.current = { w, h }
      particlesRef.current = createParticles(w, h)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }

    const handleTouchEnd = () => {
      mouseRef.current = { x: -9999, y: -9999 }
    }

    const MOUSE_RADIUS = 150
    const REPULSION_STRENGTH = 6
    const RETURN_SPEED = 0.015
    const FRICTION = 0.96
    const CONNECTION_DISTANCE = 120

    const animate = () => {
      if (!running) return
      const { w, h } = dimensionsRef.current
      ctx.clearRect(0, 0, w, h)

      const particles = particlesRef.current
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Mouse repulsion
        const dx = p.x - mx
        const dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS
          const angle = Math.atan2(dy, dx)
          p.vx += Math.cos(angle) * force * REPULSION_STRENGTH
          p.vy += Math.sin(angle) * force * REPULSION_STRENGTH
        }

        // Return to base position
        p.vx += (p.baseX - p.x) * RETURN_SPEED
        p.vy += (p.baseY - p.y) * RETURN_SPEED

        // Apply friction
        p.vx *= FRICTION
        p.vy *= FRICTION

        // Update position
        p.x += p.vx
        p.y += p.vy

        // Draw particle
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        const dynamicOpacity = Math.min(p.opacity + speed * 0.05, 1)

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color}, ${dynamicOpacity})`
        ctx.fill()

        // Glow effect for faster particles
        if (speed > 1) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${p.color}, ${Math.min(speed * 0.03, 0.15)})`
          ctx.fill()
        }
      }

      // Draw connections
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < CONNECTION_DISTANCE) {
            const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.12
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`
            ctx.stroke()
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    resize()
    animate()

    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("touchmove", handleTouchMove)
    window.addEventListener("touchend", handleTouchEnd)

    return () => {
      running = false
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [createParticles])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
