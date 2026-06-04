"use client"

import { useEffect, useRef } from "react"

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
    }> = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      particles = []
      const numParticles = Math.floor((canvas.width * canvas.height) / 15000)
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 0.5,
        })
      }
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      ctx.strokeStyle = "rgba(0, 212, 255, 0.1)"
      ctx.lineWidth = 0.5

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 150) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.globalAlpha = 1 - dist / 150
            ctx.stroke()
          }
        }
      }

      // Draw particles
      ctx.globalAlpha = 1
      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 212, 255, ${0.3 + Math.random() * 0.3})`
        ctx.fill()

        // Update position
        p.x += p.vx
        p.y += p.vy

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
      })

      animationFrameId = requestAnimationFrame(drawParticles)
    }

    resize()
    drawParticles()

    window.addEventListener("resize", resize)

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Deep background */}
      <div className="absolute inset-0 bg-[#050818]" />

      {/* Radial gradient nebula */}
      <div
        className="absolute inset-0 animate-pulse-glow"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0, 102, 255, 0.15) 0%, rgba(139, 0, 255, 0.1) 40%, transparent 70%)",
        }}
      />

      {/* Grid mesh */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <svg
          className="absolute w-full h-[200%] animate-grid"
          style={{ bottom: "-50%" }}
        >
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="rgba(0, 212, 255, 0.3)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-32 h-32 border border-cyan/5 rotate-45 animate-particle"
          style={{ top: "20%", left: "10%", animationDelay: "0s" }}
        />
        <div
          className="absolute w-24 h-24 border border-neon-purple/5 rotate-12 animate-particle"
          style={{ top: "60%", right: "15%", animationDelay: "2s" }}
        />
        <div
          className="absolute w-16 h-16 border border-electric-blue/5 -rotate-12 animate-particle"
          style={{ top: "40%", left: "70%", animationDelay: "4s" }}
        />
        <svg
          className="absolute w-20 h-20 opacity-5 animate-particle"
          style={{ top: "70%", left: "20%", animationDelay: "1s" }}
          viewBox="0 0 100 100"
        >
          <polygon
            points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
            fill="none"
            stroke="#00D4FF"
            strokeWidth="1"
          />
        </svg>
        <svg
          className="absolute w-28 h-28 opacity-5 animate-particle"
          style={{ top: "15%", right: "25%", animationDelay: "3s" }}
          viewBox="0 0 100 100"
        >
          <polygon
            points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
            fill="none"
            stroke="#8B00FF"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
