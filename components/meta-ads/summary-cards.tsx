"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SummaryCardProps {
  title: string
  value: string
  trend: {
    value: string
    positive: boolean
  }
  index: number
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

function SummaryCard({ title, value, trend, index }: SummaryCardProps) {
  const numericValue = parseFloat(value.replace(/[^\d,]/g, "").replace(",", ".").replace(".", ""))
  const animatedValue = useCountUp(
    isNaN(numericValue) ? 0 : numericValue,
    1500,
    index * 100
  )
  
  const formatValue = (val: number) => {
    if (value.includes("R$")) {
      return `R$ ${val.toLocaleString("pt-BR")},00`
    }
    return val.toLocaleString("pt-BR")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative"
    >
      <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-cyan/0 via-electric-blue/0 to-neon-purple/0 group-hover:from-cyan/20 group-hover:via-electric-blue/20 group-hover:to-neon-purple/20 transition-all duration-300 blur-sm" />
      
      <div className="relative bg-card/50 backdrop-blur-xl border border-border rounded-xl p-4 h-full overflow-hidden">
        <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative z-10">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-white tracking-tight mb-2">
            {formatValue(animatedValue)}
          </p>
          <div className="flex items-center gap-1">
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
        </div>
        
        <div className="absolute inset-0 rounded-xl border border-cyan/10 group-hover:border-cyan/30 transition-colors duration-300" />
      </div>
    </motion.div>
  )
}

export function MetaAdsSummaryCards() {
  const summaryData = [
    { title: "Total Investido", value: "R$ 8.291,00", trend: { value: "+3,2%", positive: true } },
    { title: "Alcance", value: "284.392", trend: { value: "+7,1%", positive: true } },
    { title: "Impressões", value: "1.247.830", trend: { value: "+5,4%", positive: true } },
    { title: "Resultado (Compras)", value: "451", trend: { value: "+22,3%", positive: true } },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryData.map((card, index) => (
        <SummaryCard key={card.title} {...card} index={index} />
      ))}
    </div>
  )
}
