"use client"

import { useEffect, useRef } from "react"

export function FloatingCards() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const rotateX = ((e.clientY - centerY) / rect.height) * 15
      const rotateY = ((e.clientX - centerX) / rect.width) * -15
      
      container.style.setProperty("--rotate-x", `${rotateX}deg`)
      container.style.setProperty("--rotate-y", `${rotateY}deg`)
    }

    const handleMouseLeave = () => {
      container.style.setProperty("--rotate-x", "0deg")
      container.style.setProperty("--rotate-y", "0deg")
    }

    window.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  const cards = [
    { value: "5", rotation: -20, x: -80, y: 20, z: 60, delay: 0 },
    { value: "8", rotation: -8, x: -30, y: -10, z: 30, delay: 0.1 },
    { value: "?", rotation: 5, x: 30, y: 0, z: 0, delay: 0.2 },
    { value: "13", rotation: 18, x: 90, y: 15, z: 40, delay: 0.3 },
  ]

  return (
    <div 
      ref={containerRef}
      className="relative h-[320px] w-[400px] perspective-1000 md:h-[400px] md:w-[500px]"
      style={{ 
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Glow backdrop */}
      <div 
        className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[80px] md:h-[400px] md:w-[400px]"
        style={{ 
          background: "radial-gradient(circle, rgba(0,255,255,0.4) 0%, rgba(59,130,246,0.2) 50%, transparent 70%)" 
        }}
      />
      
      {/* Cards container */}
      <div 
        className="relative h-full w-full transition-transform duration-300 ease-out"
        style={{ 
          transformStyle: "preserve-3d",
          transform: "rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg))"
        }}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 h-[140px] w-[100px] md:h-[180px] md:w-[130px]"
            style={{
              transform: `translate(-50%, -50%) translateX(${card.x}px) translateY(${card.y}px) translateZ(${card.z}px) rotateY(${card.rotation}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Floating wrapper */}
            <div 
              className="h-full w-full animate-[floatY_6s_ease-in-out_infinite]"
              style={{ animationDelay: `${card.delay * 10}s` }}
            >
            {/* Card face */}
            <div 
              className="relative flex h-full w-full flex-col items-center justify-center rounded-xl border border-[rgba(0,255,255,0.3)] bg-[rgba(10,20,40,0.8)] backdrop-blur-md transition-all duration-300 hover:border-[rgba(0,255,255,0.6)]"
              style={{
                boxShadow: "0 0 30px rgba(0,255,255,0.15), 0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)",
              }}
            >
              {/* Card inner glow */}
              <div 
                className="absolute inset-0 rounded-xl opacity-30"
                style={{
                  background: "linear-gradient(135deg, rgba(0,255,255,0.1) 0%, transparent 50%, rgba(59,130,246,0.05) 100%)"
                }}
              />
              
              {/* Card value */}
              <span 
                className="relative text-4xl font-bold text-[rgb(0,255,255)] md:text-5xl"
                style={{
                  textShadow: "0 0 20px rgba(0,255,255,0.5)"
                }}
              >
                {card.value}
              </span>
              
              {/* Card corner marks */}
              <span className="absolute left-3 top-3 text-xs text-[rgba(0,255,255,0.4)]">{card.value}</span>
              <span className="absolute bottom-3 right-3 rotate-180 text-xs text-[rgba(0,255,255,0.4)]">{card.value}</span>
            </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
