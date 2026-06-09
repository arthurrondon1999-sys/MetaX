"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Check } from "lucide-react"

interface FilterDropdownProps {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
}

export function FilterDropdown({ label, options, value, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="flex flex-col gap-1.5 min-w-[160px]">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white hover:border-electric-blue/40 transition-colors"
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="relative z-50"
          >
            <div className="absolute top-1 left-0 right-0 rounded-lg bg-[#0a0f24] border border-white/10 shadow-xl overflow-hidden backdrop-blur-xl">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onChange(option)
                    setOpen(false)
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-white/5 transition-colors text-white/80 hover:text-white"
                >
                  <span>{option}</span>
                  {value === option && <Check className="w-4 h-4 text-cyan" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
