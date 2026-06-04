"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string
  subtitle?: string
  trend?: {
    value: string
    positive: boolean
  }
  index: number
  variant?: "sparkline" | "progress" | "multi-bar"
  sparklineColor?: string
  progressValue?: number
  multiBarData?: Array<{ label: string; value: number; percentage: string }>
}

function useCountUp(end: number, duration: number = 1500, startDelay: number = 0) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      let startTime: number
      let animationFrame: number
      
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        setCount(Math.floor(easeOutQuart * end))
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate)
        }
      }
      
      animationFrame = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(animationFrame)
    }, startDelay)
    
    return () => clearTimeout(timeout)
  }, [end, duration, startDelay])
  
  return count
}

function Sparkline({ color, delay }: { color: string; delay: number }) {
  const [progress, setProgress] = useState(0)
  const pathRef = useRef<SVGPathElement>(null)
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgress(1)
    }, delay)
    return () => clearTimeout(timeout)
  }, [delay])
  
  const data = [20, 35, 25, 45, 30, 55, 40, 60, 50, 70, 55, 75]
  const width = 120
  const height = 32
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - (d / 80) * height,
  }))
  
  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(" ")
  
  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`
  
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`sparkline-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <clipPath id={`clip-${color}`}>
          <rect x="0" y="0" width={progress * width} height={height} />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-${color})`}>
        <path
          d={areaD}
          fill={`url(#sparkline-${color})`}
          style={{ transition: "all 1s ease-out" }}
        />
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: "all 1s ease-out" }}
        />
      </g>
    </svg>
  )
}

function CircularProgress({ value, delay }: { value: number; delay: number }) {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgress(value)
    }, delay)
    return () => clearTimeout(timeout)
  }, [value, delay])
  
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference
  
  return (
    <div className="relative w-16 h-16">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="4"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#8B00FF" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-white">{Math.round(progress)}%</span>
      </div>
    </div>
  )
}

function MultiBar({ data, delay }: { data: Array<{ label: string; value: number; percentage: string }>; delay: number }) {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgress(1)
    }, delay)
    return () => clearTimeout(timeout)
  }, [delay])
  
  return (
    <div className="space-y-2 w-full">
      {data.map((item, i) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-12">{item.label}</span>
          <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan to-electric-blue"
              initial={{ width: 0 }}
              animate={{ width: `${progress * item.value}%` }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
          </div>
          <span className="text-xs font-medium text-white w-12 text-right">{item.percentage}</span>
        </div>
      ))}
    </div>
  )
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  index,
  variant = "sparkline",
  sparklineColor = "#00D4FF",
  progressValue = 0,
  multiBarData,
}: MetricCardProps) {
  const numericValue = parseFloat(value.replace(/[^\d,]/g, "").replace(",", "."))
  const animatedValue = useCountUp(
    isNaN(numericValue) ? 0 : numericValue * 100,
    1500,
    index * 100
  )
  
  const formatValue = (val: number) => {
    if (value.includes("R$")) {
      return `R$ ${(val / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
    if (value.includes("x")) {
      return `${(val / 100).toFixed(2)}x`
    }
    if (value.includes("%")) {
      return `${Math.round(val / 100)}%`
    }
    return (val / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative"
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-cyan/0 via-electric-blue/0 to-neon-purple/0 group-hover:from-cyan/20 group-hover:via-electric-blue/20 group-hover:to-neon-purple/20 transition-all duration-300 blur-sm" />
      
      {/* Card */}
      <div className="relative bg-card/50 backdrop-blur-xl border border-border rounded-xl p-4 h-full overflow-hidden">
        {/* Shimmer effect */}
        <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">{title}</p>
              <p className="text-2xl font-bold text-white tracking-tight">
                {formatValue(animatedValue)}
              </p>
              {subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
            {variant === "progress" && (
              <CircularProgress value={progressValue} delay={index * 100 + 300} />
            )}
          </div>
          
          {trend && (
            <div className="flex items-center gap-1 mb-3">
              {trend.positive ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.positive ? "text-green-500" : "text-red-500"
                )}
              >
                {trend.value} vs ontem
              </span>
            </div>
          )}
          
          {variant === "sparkline" && (
            <div className="mt-auto">
              <Sparkline color={sparklineColor} delay={index * 100 + 500} />
            </div>
          )}
          
          {variant === "multi-bar" && multiBarData && (
            <div className="mt-2">
              <MultiBar data={multiBarData} delay={index * 100 + 300} />
            </div>
          )}
        </div>
        
        {/* Border glow */}
        <div className="absolute inset-0 rounded-xl border border-cyan/10 group-hover:border-cyan/30 transition-colors duration-300" />
      </div>
    </motion.div>
  )
}

export function MetricsGrid() {
  const metrics = [
    {
      title: "Faturamento",
      value: "R$ 47.832,00",
      subtitle: "Receita líquida total",
      trend: { value: "+12,4%", positive: true },
      variant: "sparkline" as const,
      sparklineColor: "#00D4FF",
    },
    {
      title: "Gastos com Anúncios",
      value: "R$ 8.291,00",
      subtitle: "Total investido",
      trend: { value: "+3,2%", positive: false },
      variant: "sparkline" as const,
      sparklineColor: "#8B00FF",
    },
    {
      title: "Lucro",
      value: "R$ 39.541,00",
      subtitle: "Faturamento - Gastos",
      trend: { value: "+18,7%", positive: true },
      variant: "sparkline" as const,
      sparklineColor: "#22C55E",
    },
    {
      title: "ROAS",
      value: "5,77x",
      subtitle: "Retorno sobre investimento em ads",
      trend: { value: "+8,1%", positive: true },
      variant: "progress" as const,
      progressValue: 77,
    },
    {
      title: "Faturamento Bruto",
      value: "R$ 52.190,00",
      trend: { value: "+9,3%", positive: true },
      variant: "sparkline" as const,
      sparklineColor: "#0066FF",
    },
    {
      title: "ROI",
      value: "377%",
      trend: { value: "+14,2%", positive: true },
      variant: "progress" as const,
      progressValue: 77,
    },
    {
      title: "CPA (Custo por Aquisição)",
      value: "R$ 18,42",
      trend: { value: "-5,1%", positive: true },
      variant: "sparkline" as const,
      sparklineColor: "#00D4FF",
    },
    {
      title: "Taxa de Aprovação",
      value: "71,2%",
      variant: "multi-bar" as const,
      multiBarData: [
        { label: "Pix", value: 94.2, percentage: "94,2%" },
        { label: "Cartão", value: 78.3, percentage: "78,3%" },
        { label: "Boleto", value: 41.0, percentage: "41,0%" },
      ],
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <MetricCard key={metric.title} {...metric} index={index} />
      ))}
    </div>
  )
}
