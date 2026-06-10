"use client"

import { useEffect, useRef, useState } from "react"
import { DayPicker, type DateRange } from "react-day-picker"
import { ptBR } from "date-fns/locale"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export type { DateRange }

interface DateRangePickerProps {
  label?: string
  range?: DateRange
  onChange: (range: DateRange | undefined) => void
}

function formatRange(range?: DateRange): string {
  if (!range?.from) return "Selecionar período"
  if (!range.to) return format(range.from, "dd/MM/yyyy")
  return `${format(range.from, "dd/MM/yyyy")} – ${format(range.to, "dd/MM/yyyy")}`
}

export function DateRangePicker({ label = "Período Personalizado", range, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<DateRange | undefined>(range)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => setDraft(range), [range])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="flex flex-col gap-1.5 min-w-[220px]">
      <label className="text-xs font-medium text-white">{label}</label>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white hover:border-electric-blue/40 transition-colors"
      >
        <span className="truncate">{formatRange(range)}</span>
        <CalendarIcon className="w-4 h-4 text-muted-foreground shrink-0" />
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
            <div className="metax-rdp absolute top-1 left-0 rounded-xl bg-[#0a0f24] border border-white/10 shadow-2xl p-4 backdrop-blur-xl">
              <DayPicker
                mode="range"
                numberOfMonths={2}
                locale={ptBR}
                defaultMonth={range?.from}
                selected={draft}
                onSelect={setDraft}
                showOutsideDays
              />
              <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-white/10">
                <button
                  onClick={() => {
                    setDraft(undefined)
                    onChange(undefined)
                  }}
                  className="text-xs text-[#94A3B8] hover:text-white transition-colors"
                >
                  Limpar
                </button>
                <button
                  disabled={!draft?.from || !draft?.to}
                  onClick={() => {
                    onChange(draft)
                    setOpen(false)
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-40"
                  style={{ background: "linear-gradient(135deg, #0066FF, #8B00FF)" }}
                >
                  Aplicar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
