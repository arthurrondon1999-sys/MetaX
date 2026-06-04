"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Campaign {
  id: string
  status: "active" | "paused" | "warning"
  name: string
  investimento: string
  impressoes: string
  cliques: string
  ctr: string
  cpc: string
  cpm: string
  frequencia: string
  resultados: string
  custoResultado: string
  roas: string
}

const campaigns: Campaign[] = [
  {
    id: "1",
    status: "active",
    name: "Black Friday — Escala",
    investimento: "R$2.840",
    impressoes: "412.300",
    cliques: "18.420",
    ctr: "4,47%",
    cpc: "R$0,15",
    cpm: "R$6,89",
    frequencia: "1,8",
    resultados: "187",
    custoResultado: "R$15,19",
    roas: "6,2x",
  },
  {
    id: "2",
    status: "active",
    name: "Produto Principal — Topo",
    investimento: "R$1.920",
    impressoes: "287.100",
    cliques: "11.230",
    ctr: "3,91%",
    cpc: "R$0,17",
    cpm: "R$6,69",
    frequencia: "2,1",
    resultados: "124",
    custoResultado: "R$15,48",
    roas: "5,8x",
  },
  {
    id: "3",
    status: "active",
    name: "Retargeting — Quente",
    investimento: "R$890",
    impressoes: "98.400",
    cliques: "7.840",
    ctr: "7,97%",
    cpc: "R$0,11",
    cpm: "R$9,04",
    frequencia: "3,4",
    resultados: "89",
    custoResultado: "R$10,00",
    roas: "8,1x",
  },
  {
    id: "4",
    status: "warning",
    name: "Teste Criativo — V3",
    investimento: "R$420",
    impressoes: "67.200",
    cliques: "2.190",
    ctr: "3,26%",
    cpc: "R$0,19",
    cpm: "R$6,25",
    frequencia: "1,3",
    resultados: "31",
    custoResultado: "R$13,55",
    roas: "4,9x",
  },
  {
    id: "5",
    status: "paused",
    name: "Lookalike — Frio",
    investimento: "R$1.240",
    impressoes: "198.700",
    cliques: "6.320",
    ctr: "3,18%",
    cpc: "R$0,20",
    cpm: "R$6,24",
    frequencia: "1,6",
    resultados: "78",
    custoResultado: "R$15,90",
    roas: "5,1x",
  },
  {
    id: "6",
    status: "paused",
    name: "Campanha Engajamento",
    investimento: "R$181",
    impressoes: "184.130",
    cliques: "3.680",
    ctr: "2,00%",
    cpc: "R$0,05",
    cpm: "R$0,98",
    frequencia: "4,2",
    resultados: "—",
    custoResultado: "—",
    roas: "—",
  },
]

const columns = [
  { key: "status", label: "", width: "w-12" },
  { key: "name", label: "Nome da Campanha", width: "w-64" },
  { key: "investimento", label: "Investimento", width: "w-28" },
  { key: "impressoes", label: "Impressões", width: "w-28" },
  { key: "cliques", label: "Cliques no Link", width: "w-32" },
  { key: "ctr", label: "CTR", width: "w-20" },
  { key: "cpc", label: "CPC Médio", width: "w-24" },
  { key: "cpm", label: "CPM", width: "w-20" },
  { key: "frequencia", label: "Frequência", width: "w-24" },
  { key: "resultados", label: "Resultados", width: "w-24" },
  { key: "custoResultado", label: "Custo/Resultado", width: "w-32" },
  { key: "roas", label: "ROAS", width: "w-20" },
]

function StatusIndicator({ status }: { status: Campaign["status"] }) {
  return (
    <div
      className={cn(
        "w-2.5 h-2.5 rounded-full",
        status === "active" && "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]",
        status === "paused" && "bg-gray-500",
        status === "warning" && "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]"
      )}
    />
  )
}

function getCTRColor(ctr: string) {
  const value = parseFloat(ctr.replace(",", ".").replace("%", ""))
  if (value >= 4) return "text-green-500"
  if (value >= 2) return "text-yellow-500"
  return "text-red-500"
}

function getROASColor(roas: string) {
  if (roas === "—") return "text-muted-foreground"
  const value = parseFloat(roas.replace(",", ".").replace("x", ""))
  if (value >= 5) return "text-cyan"
  if (value >= 3) return "text-yellow-500"
  return "text-red-500"
}

export function CampaignsTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const toggleSelectAll = () => {
    if (selectedRows.length === campaigns.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(campaigns.map((c) => c.id))
    }
  }

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    )
  }

  return (
    <div className="relative bg-card/30 backdrop-blur-xl border border-border rounded-xl overflow-hidden">
      {/* Horizontal scroll container */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          {/* Header */}
          <thead>
            <tr className="bg-background/50 border-b border-border">
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedRows.length === campaigns.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-cyan/30 bg-transparent checked:bg-cyan checked:border-cyan focus:ring-cyan/20"
                />
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-medium text-cyan uppercase tracking-wider",
                    col.width
                  )}
                >
                  <button className="flex items-center gap-1 hover:text-white transition-colors">
                    {col.label}
                    {col.label && <ArrowUpDown className="w-3 h-3" />}
                  </button>
                </th>
              ))}
              <th className="w-32 px-4 py-3"></th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {campaigns.map((campaign, index) => (
              <motion.tr
                key={campaign.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                onMouseEnter={() => setHoveredRow(campaign.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={cn(
                  "border-b border-border/50 transition-all duration-200",
                  index % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]",
                  hoveredRow === campaign.id && "bg-gradient-to-r from-electric-blue/5 to-neon-purple/5"
                )}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(campaign.id)}
                    onChange={() => toggleRow(campaign.id)}
                    className="w-4 h-4 rounded border-cyan/30 bg-transparent checked:bg-cyan checked:border-cyan focus:ring-cyan/20"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center">
                    <StatusIndicator status={campaign.status} />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-white">
                    {campaign.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-white">
                  {campaign.investimento}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {campaign.impressoes}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {campaign.cliques}
                </td>
                <td className={cn("px-4 py-3 text-sm font-medium", getCTRColor(campaign.ctr))}>
                  {campaign.ctr}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {campaign.cpc}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {campaign.cpm}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {campaign.frequencia}
                </td>
                <td className="px-4 py-3 text-sm text-white font-medium">
                  {campaign.resultados}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {campaign.custoResultado}
                </td>
                <td className={cn("px-4 py-3 text-sm font-bold", getROASColor(campaign.roas))}>
                  {campaign.roas}
                </td>
                <td className="px-4 py-3">
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredRow === campaign.id ? 1 : 0 }}
                    className="flex items-center gap-1 text-xs text-cyan hover:text-white transition-colors"
                  >
                    Ver detalhes
                    <ChevronRight className="w-3 h-3" />
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl border border-cyan/10 pointer-events-none" />
    </div>
  )
}
