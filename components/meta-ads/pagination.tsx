"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  total: number
  pageSize: number
  currentPage: number
}

export function Pagination({ total, pageSize, currentPage }: PaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        Mostrando {total} de {total} campanhas
      </span>

      <div className="flex items-center gap-4">
        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Por página:</span>
          <select className="bg-card/50 border border-border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-cyan/50">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <button
            disabled
            className="flex items-center gap-1 px-3 py-1.5 border border-cyan/30 rounded-lg text-sm text-cyan disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan/10 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>
          <button
            disabled
            className="flex items-center gap-1 px-3 py-1.5 border border-cyan/30 rounded-lg text-sm text-cyan disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan/10 transition-all"
          >
            Próximo
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
