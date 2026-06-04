"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const countries = [
  {
    id: "BR",
    name: "Brasil",
    path: "M280 380 L320 360 L340 380 L360 400 L340 440 L300 460 L260 440 L240 400 L260 380 Z",
    revenue: "R$ 32.450,00",
    orders: 1847,
    opacity: 1,
  },
  {
    id: "US",
    name: "Estados Unidos",
    path: "M80 180 L200 180 L220 200 L200 240 L160 260 L100 260 L60 220 L60 200 Z",
    revenue: "R$ 8.230,00",
    orders: 423,
    opacity: 0.7,
  },
  {
    id: "PT",
    name: "Portugal",
    path: "M420 220 L430 210 L440 220 L435 240 L420 235 Z",
    revenue: "R$ 3.890,00",
    orders: 198,
    opacity: 0.5,
  },
  {
    id: "AR",
    name: "Argentina",
    path: "M280 460 L300 470 L310 520 L290 560 L270 540 L260 480 Z",
    revenue: "R$ 1.840,00",
    orders: 94,
    opacity: 0.35,
  },
  {
    id: "MX",
    name: "México",
    path: "M100 280 L140 270 L160 290 L150 320 L120 340 L90 320 L80 300 Z",
    revenue: "R$ 1.422,00",
    orders: 73,
    opacity: 0.3,
  },
  // Background countries with very low opacity
  {
    id: "CA",
    name: "Canadá",
    path: "M60 100 L200 100 L240 140 L200 180 L80 180 L40 140 Z",
    revenue: "R$ 0,00",
    orders: 0,
    opacity: 0.1,
  },
  {
    id: "EU",
    name: "Europa",
    path: "M420 140 L520 140 L540 180 L520 220 L440 220 L420 200 L400 160 Z",
    revenue: "R$ 0,00",
    orders: 0,
    opacity: 0.1,
  },
  {
    id: "AF",
    name: "África",
    path: "M440 260 L500 260 L520 320 L500 400 L460 420 L420 380 L420 300 Z",
    revenue: "R$ 0,00",
    orders: 0,
    opacity: 0.1,
  },
  {
    id: "AS",
    name: "Ásia",
    path: "M540 120 L680 120 L700 200 L680 280 L600 300 L540 260 L520 180 Z",
    revenue: "R$ 0,00",
    orders: 0,
    opacity: 0.1,
  },
  {
    id: "AU",
    name: "Austrália",
    path: "M620 380 L700 380 L720 420 L700 460 L640 460 L600 420 Z",
    revenue: "R$ 0,00",
    orders: 0,
    opacity: 0.1,
  },
]

const topCountries = countries
  .filter((c) => c.orders > 0)
  .sort((a, b) => b.orders - a.orders)
  .slice(0, 5)

const countryFlags: Record<string, string> = {
  BR: "🇧🇷",
  US: "🇺🇸",
  PT: "🇵🇹",
  AR: "🇦🇷",
  MX: "🇲🇽",
}

export function WorldMap() {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [animatedCountries, setAnimatedCountries] = useState<string[]>([])

  useEffect(() => {
    // Staggered animation for countries
    countries.forEach((country, index) => {
      setTimeout(() => {
        setAnimatedCountries((prev) => [...prev, country.id])
      }, 1000 + index * 100)
    })
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="bg-card/50 backdrop-blur-xl border border-border rounded-xl p-6 h-full"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-2 rounded-full bg-cyan" />
        <h3 className="text-lg font-semibold text-white">Distribuição Global de Vendas</h3>
      </div>

      {/* Map */}
      <div
        className="relative w-full h-48 mb-4"
        onMouseMove={handleMouseMove}
      >
        <svg
          viewBox="0 0 800 500"
          className="w-full h-full"
          style={{ filter: "drop-shadow(0 0 20px rgba(0, 212, 255, 0.1))" }}
        >
          <defs>
            <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D4FF" />
              <stop offset="100%" stopColor="#0066FF" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {countries.map((country) => {
            const isAnimated = animatedCountries.includes(country.id)
            const isHovered = hoveredCountry === country.id
            const hasRevenue = country.orders > 0

            return (
              <motion.path
                key={country.id}
                d={country.path}
                fill={hasRevenue ? "url(#mapGradient)" : "#1a1a2e"}
                fillOpacity={isAnimated ? (isHovered ? 1 : country.opacity) : 0}
                stroke={hasRevenue ? "#00D4FF" : "#2a2a4e"}
                strokeWidth={isHovered ? 2 : 1}
                strokeOpacity={isAnimated ? (hasRevenue ? 0.5 : 0.2) : 0}
                filter={isHovered && hasRevenue ? "url(#glow)" : undefined}
                style={{ cursor: hasRevenue ? "pointer" : "default" }}
                onMouseEnter={() => hasRevenue && setHoveredCountry(country.id)}
                onMouseLeave={() => setHoveredCountry(null)}
                initial={{ fillOpacity: 0, strokeOpacity: 0 }}
                animate={{
                  fillOpacity: isAnimated ? (isHovered ? 1 : country.opacity) : 0,
                  strokeOpacity: isAnimated ? (hasRevenue ? 0.5 : 0.2) : 0,
                }}
                transition={{ duration: 0.5 }}
              />
            )
          })}
        </svg>

        {/* Tooltip */}
        {hoveredCountry && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute pointer-events-none bg-background/95 backdrop-blur-xl border border-border rounded-lg p-3 shadow-xl z-10"
            style={{
              left: Math.min(mousePos.x + 10, 200),
              top: mousePos.y - 60,
            }}
          >
            {(() => {
              const country = countries.find((c) => c.id === hoveredCountry)
              if (!country) return null
              return (
                <>
                  <p className="text-sm font-medium text-white flex items-center gap-2">
                    <span>{countryFlags[country.id]}</span>
                    {country.name}
                  </p>
                  <p className="text-xs text-cyan mt-1">{country.revenue}</p>
                  <p className="text-xs text-muted-foreground">{country.orders} pedidos</p>
                </>
              )
            })()}
          </motion.div>
        )}
      </div>

      {/* Top countries list */}
      <div className="space-y-2">
        {topCountries.map((country, index) => (
          <motion.div
            key={country.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3 + index * 0.1, duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <span className="text-lg">{countryFlags[country.id]}</span>
            <span className="text-sm text-white flex-1">{country.name}</span>
            <span className="text-sm font-medium text-cyan">{country.revenue}</span>
            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan to-electric-blue rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(country.orders / topCountries[0].orders) * 100}%` }}
                transition={{ delay: 1.5 + index * 0.1, duration: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
