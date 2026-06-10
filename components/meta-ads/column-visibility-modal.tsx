"use client"

import { useEffect, useState } from "react"
import { Modal } from "@/components/shared/modal"
import { Check, RotateCcw } from "lucide-react"
import { COLUMN_DEFS } from "@/lib/meta/columns"

interface ColumnVisibilityModalProps {
  open: boolean
  onClose: () => void
  /** ids atualmente visíveis */
  visible: string[]
  onApply: (visible: string[]) => void
  onReset: () => void
}

export function ColumnVisibilityModal({ open, onClose, visible, onApply, onReset }: ColumnVisibilityModalProps) {
  const [local, setLocal] = useState<string[]>(visible)

  // Sincroniza quando reabre
  useEffect(() => {
    if (open) setLocal(visible)
  }, [open, visible])

  const toggle = (id: string) => {
    setLocal((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  return (
    <Modal open={open} onClose={onClose} title="Personalizar Colunas" maxWidth="max-w-2xl">
      <div className="grid grid-cols-2 gap-1.5 max-h-[50vh] overflow-y-auto pr-1">
        {COLUMN_DEFS.map((col) => {
          const isOn = local.includes(col.id)
          return (
            <button
              key={col.id}
              onClick={() => toggle(col.id)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
            >
              <span
                className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all ${
                  isOn ? "bg-gradient-to-br from-electric-blue to-neon-purple" : "border border-white/20"
                }`}
              >
                {isOn && <Check className="w-3.5 h-3.5 text-white" />}
              </span>
              <span className="text-sm text-white/80">{col.label}</span>
            </button>
          )
        })}
      </div>
      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={() => {
            onReset()
            onClose()
          }}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-[#94A3B8] hover:text-white border border-white/10 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Restaurar padrão
        </button>
        <button
          onClick={() => {
            onApply(local)
            onClose()
          }}
          className="flex-1 py-3 rounded-lg font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #0066FF, #8B00FF)" }}
        >
          Aplicar
        </button>
      </div>
    </Modal>
  )
}
