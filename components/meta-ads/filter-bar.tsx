"use client"

import { Search, ChevronDown, Settings2, Download } from "lucide-react"

interface FilterBarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
}

export function FilterBar({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: FilterBarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* Left side - Search and status filter */}
      <div className="flex items-center gap-3">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Pesquisar campanhas..."
            className="w-64 pl-10 pr-4 py-2 bg-card/50 backdrop-blur-xl border border-border rounded-lg text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/20 transition-all"
          />
        </div>

        {/* Status filter dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-xl border border-border rounded-lg text-sm text-muted-foreground hover:text-white hover:border-cyan/30 transition-all">
            <span>{statusFilter}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-4 py-2 border border-cyan/30 rounded-lg text-sm text-cyan hover:bg-cyan/10 transition-all">
          <Settings2 className="w-4 h-4" />
          <span>Colunas</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-cyan/30 rounded-lg text-sm text-cyan hover:bg-cyan/10 transition-all">
          <Download className="w-4 h-4" />
          <span>Exportar</span>
        </button>
      </div>
    </div>
  )
}
