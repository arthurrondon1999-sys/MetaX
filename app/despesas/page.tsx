"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Plus, MoreHorizontal, Trash2, Search } from "lucide-react"
import { Sidebar } from "@/components/shared/sidebar"
import { DashboardBackground } from "@/components/dashboard/background"
import { PageHeader } from "@/components/shared/page-header"
import { FilterDropdown } from "@/components/shared/filter-dropdown"
import { SavedIndicator } from "@/components/shared/saved-indicator"
import { AddDespesaModal, type NovaDespesa } from "@/components/despesas/add-despesa-modal"
import { useDespesas, formatBRL } from "@/hooks/use-despesas"
import { createClient } from "@/lib/supabase/client"

const CATEGORIAS = [
  "Qualquer",
  "Ferramentas",
  "Equipe",
  "Infraestrutura",
  "Marketing",
  "Tráfego Pago",
  "Outros",
]

const COLUMNS = ["DATA", "TIPO", "CATEGORIA", "DESCRIÇÃO", "VALOR", "MAIS"]

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-")
  if (!y || !m || !d) return iso
  return `${d}/${m}/${y}`
}

export default function DespesasPage() {
  const { despesas, mutate, userId } = useDespesas()
  const [modalOpen, setModalOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const [descFilter, setDescFilter] = useState("")
  const [categoriaFilter, setCategoriaFilter] = useState("Qualquer")
  const [periodo, setPeriodo] = useState("Esse mês")

  const showSaved = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleAdd = async (nova: NovaDespesa) => {
    if (!userId) return
    const supabase = createClient()
    const { error } = await supabase.from("despesas").insert({
      user_id: userId,
      descricao: nova.descricao,
      tipo: nova.tipo,
      categoria: nova.categoria,
      data: nova.data,
      valor: nova.valor,
    })
    if (!error) {
      await mutate()
      showSaved()
    } else {
      console.log("[v0] Erro ao adicionar despesa:", error.message)
    }
  }

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    setOpenMenu(null)
    const { error } = await supabase.from("despesas").delete().eq("id", id)
    if (!error) {
      await mutate()
      showSaved()
    } else {
      console.log("[v0] Erro ao excluir despesa:", error.message)
    }
  }

  const filtered = useMemo(() => {
    return despesas.filter((d) => {
      const matchDesc = d.descricao.toLowerCase().includes(descFilter.toLowerCase())
      const matchCat = categoriaFilter === "Qualquer" || d.categoria === categoriaFilter
      return matchDesc && matchCat
    })
  }, [despesas, descFilter, categoriaFilter])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardBackground />
      <Sidebar activePage="despesas" />
      <PageHeader
        title="Despesas"
        subtitle="Use essa tela para adicionar despesas personalizadas."
        updatedLabel=""
        showCurrency={false}
        actions={
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #0066FF, #8B00FF)" }}
          >
            <Plus className="w-4 h-4" />
            Adicionar gasto
          </button>
        }
      />

      <main className="ml-60 pt-20">
        <div className="p-6 space-y-5 max-w-[1400px]">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-col gap-1.5 min-w-[200px]">
              <label className="text-xs font-medium text-muted-foreground">Descrição</label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus-within:border-electric-blue/40 transition-colors">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  value={descFilter}
                  onChange={(e) => setDescFilter(e.target.value)}
                  placeholder="Filtrar por descrição"
                  className="bg-transparent text-sm text-white placeholder:text-muted-foreground outline-none w-full"
                />
              </div>
            </div>
            <FilterDropdown
              label="Categoria"
              value={categoriaFilter}
              onChange={setCategoriaFilter}
              options={CATEGORIAS}
            />
            <FilterDropdown
              label="Período de visualização"
              value={periodo}
              onChange={setPeriodo}
              options={["Esse mês", "Hoje", "Essa semana", "Últimos 30 dias"]}
            />
          </div>

          {/* Table */}
          <div className="rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    {COLUMNS.map((col) => (
                      <th
                        key={col}
                        className="px-4 py-3 text-left text-xs font-semibold text-[#E5E7EB] whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d) => (
                    <motion.tr
                      key={d.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3 text-white/80 whitespace-nowrap">{formatDate(d.data)}</td>
                      <td className="px-4 py-3 text-white/80 whitespace-nowrap">{d.tipo}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-xs bg-electric-blue/10 text-cyan border border-electric-blue/20">
                          {d.categoria}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white">{d.descricao}</td>
                      <td className="px-4 py-3 font-medium whitespace-nowrap text-[#FF4444]">
                        {formatBRL(Number(d.valor))}
                      </td>
                      <td className="px-4 py-3 relative">
                        <button
                          onClick={() => setOpenMenu(openMenu === d.id ? null : d.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {openMenu === d.id && (
                          <div className="absolute right-4 top-12 z-20 rounded-lg bg-[#0a0f24] border border-white/10 shadow-xl overflow-hidden">
                            <button
                              onClick={() => handleDelete(d.id)}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors w-full"
                            >
                              <Trash2 className="w-4 h-4" />
                              Excluir
                            </button>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="px-4 py-12 text-center text-sm text-muted-foreground">
                Nenhuma despesa cadastrada
              </div>
            )}
          </div>
        </div>
      </main>

      <AddDespesaModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAdd} />
      <SavedIndicator show={saved} />
    </div>
  )
}
