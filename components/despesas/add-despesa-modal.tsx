"use client"

import { useState } from "react"
import { Modal } from "@/components/shared/modal"
import { FilterDropdown } from "@/components/shared/filter-dropdown"

export interface NovaDespesa {
  descricao: string
  tipo: string
  categoria: string
  data: string
  valor: number
}

interface AddDespesaModalProps {
  open: boolean
  onClose: () => void
  onAdd: (despesa: NovaDespesa) => Promise<void> | void
}

const TIPOS = ["Único", "Recorrente Mensal", "Recorrente Anual"]
const CATEGORIAS = ["Ferramentas", "Equipe", "Infraestrutura", "Marketing", "Tráfego Pago", "Outros"]

export function AddDespesaModal({ open, onClose, onAdd }: AddDespesaModalProps) {
  const [descricao, setDescricao] = useState("")
  const [tipo, setTipo] = useState("Único")
  const [categoria, setCategoria] = useState("Ferramentas")
  const [data, setData] = useState("")
  const [valor, setValor] = useState("")
  const [saving, setSaving] = useState(false)

  const reset = () => {
    setDescricao("")
    setTipo("Único")
    setCategoria("Ferramentas")
    setData("")
    setValor("")
  }

  const handleSubmit = async () => {
    if (!descricao.trim() || saving) return
    setSaving(true)
    const valorNum = Number(valor.replace(/[^\d,.-]/g, "").replace(".", "").replace(",", ".")) || 0
    await onAdd({
      descricao: descricao.trim(),
      tipo,
      categoria,
      data: data || new Date().toISOString().slice(0, 10),
      valor: valorNum,
    })
    setSaving(false)
    reset()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Adicionar Despesa">
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Descrição</label>
          <input
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição"
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-muted-foreground outline-none focus:border-electric-blue/40 transition-colors"
          />
        </div>

        <FilterDropdown label="Tipo de Despesa" value={tipo} onChange={setTipo} options={TIPOS} />

        <FilterDropdown
          label="Categoria"
          value={categoria}
          onChange={setCategoria}
          options={CATEGORIAS}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Data</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-electric-blue/40 transition-colors [color-scheme:dark]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Valor</label>
          <input
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="R$ 0,00"
            inputMode="decimal"
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-muted-foreground outline-none focus:border-electric-blue/40 transition-colors"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving || !descricao.trim()}
          className="w-full py-3 rounded-lg font-semibold text-white disabled:opacity-50 transition-opacity"
          style={{ background: "linear-gradient(135deg, #0066FF, #8B00FF)" }}
        >
          {saving ? "Adicionando..." : "Adicionar Despesa"}
        </button>
      </div>
    </Modal>
  )
}
