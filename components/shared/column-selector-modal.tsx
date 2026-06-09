"use client"

import { useState } from "react"
import { Modal } from "./modal"
import { Check } from "lucide-react"

interface ColumnSelectorModalProps {
  open: boolean
  onClose: () => void
  columns: string[]
  selected: string[]
  onApply: (selected: string[]) => void
}

export function ColumnSelectorModal({
  open,
  onClose,
  columns,
  selected,
  onApply,
}: ColumnSelectorModalProps) {
  const [local, setLocal] = useState<string[]>(selected)

  const toggle = (col: string) => {
    setLocal((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    )
  }

  return (
    <Modal open={open} onClose={onClose} title="Personalizar Colunas" maxWidth="max-w-lg">
      <div className="grid grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto pr-1">
        {columns.map((col) => {
          const isOn = local.includes(col)
          return (
            <button
              key={col}
              onClick={() => toggle(col)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
            >
              <span
                className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all ${
                  isOn
                    ? "bg-gradient-to-br from-electric-blue to-neon-purple"
                    : "border border-white/20"
                }`}
              >
                {isOn && <Check className="w-3.5 h-3.5 text-white" />}
              </span>
              <span className="text-sm text-white/80">{col}</span>
            </button>
          )
        })}
      </div>
      <button
        onClick={() => {
          onApply(local)
          onClose()
        }}
        className="mt-5 w-full py-3 rounded-lg font-semibold text-white"
        style={{ background: "linear-gradient(135deg, #0066FF, #8B00FF)" }}
      >
        Aplicar
      </button>
    </Modal>
  )
}
