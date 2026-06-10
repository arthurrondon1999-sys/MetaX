"use client"

import { LayoutDashboard, Megaphone, Puzzle, FileBarChart, Receipt } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface MobileNavProps {
  activePage?: string
}

const navItems = [
  { icon: LayoutDashboard, label: "Resumo", href: "/dashboard" },
  { icon: Megaphone, label: "Meta Ads", href: "/meta-ads" },
  { icon: Puzzle, label: "Integrações", href: "/integracoes" },
  { icon: FileBarChart, label: "Relatórios", href: "/relatorios" },
  { icon: Receipt, label: "Despesas", href: "/despesas" },
]

export function MobileNav({ activePage = "dashboard" }: MobileNavProps) {
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#050818]/95 backdrop-blur-xl border-t border-white/10"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Navegação principal"
    >
      <ul className="flex items-stretch justify-around">
        {navItems.map((item) => {
          const isActive = item.href === `/${activePage}`
          return (
            <li key={item.label} className="flex-1">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 transition-colors",
                  isActive ? "text-cyan" : "text-[#94A3B8] hover:text-white",
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
