"use client"

import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Facebook,
  Target,
  Music2,
  Link2,
  Puzzle,
  FileBarChart,
  Wallet,
  Receipt,
  Settings,
  HelpCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: LayoutDashboard, label: "Resumo", active: true },
  { icon: Facebook, label: "Meta Ads" },
  { icon: Target, label: "Google Ads" },
  { icon: Music2, label: "TikTok Ads" },
  { icon: Link2, label: "UTMs" },
  { icon: Puzzle, label: "Integrações" },
  { icon: FileBarChart, label: "Relatórios" },
  { icon: Wallet, label: "Despesas" },
  { icon: Receipt, label: "Impostos" },
  { icon: Settings, label: "Configurações" },
  { icon: HelpCircle, label: "Suporte" },
]

export function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -240, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed left-0 top-0 bottom-0 w-60 bg-sidebar border-r border-sidebar-border/10 flex flex-col z-50"
    >
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg
              width="40"
              height="40"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_0_10px_rgba(0,102,255,0.5)]"
            >
              <path
                d="M24 4L42 14V34L24 44L6 34V14L24 4Z"
                fill="url(#sidebarHexGradient)"
                fillOpacity="0.2"
                stroke="url(#sidebarHexStroke)"
                strokeWidth="1.5"
              />
              <path
                d="M14 32V18L24 26L34 18V32"
                stroke="url(#sidebarMGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M24 26V32"
                stroke="url(#sidebarMGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="sidebarHexGradient"
                  x1="6"
                  y1="4"
                  x2="42"
                  y2="44"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0066FF" />
                  <stop offset="1" stopColor="#8B00FF" />
                </linearGradient>
                <linearGradient
                  id="sidebarHexStroke"
                  x1="6"
                  y1="4"
                  x2="42"
                  y2="44"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#00D4FF" />
                  <stop offset="0.5" stopColor="#0066FF" />
                  <stop offset="1" stopColor="#8B00FF" />
                </linearGradient>
                <linearGradient
                  id="sidebarMGradient"
                  x1="14"
                  y1="18"
                  x2="34"
                  y2="32"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#00D4FF" />
                  <stop offset="1" stopColor="#0066FF" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 blur-lg bg-electric-blue/20 -z-10 rounded-full" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Meta<span className="text-cyan">X</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item, index) => (
            <motion.li
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <button
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 group relative",
                  item.active
                    ? "bg-gradient-to-r from-electric-blue/20 to-neon-purple/20 text-white"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                {/* Active indicator */}
                {item.active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-electric-blue to-neon-purple rounded-r-full"
                  />
                )}
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    item.active ? "text-cyan" : "group-hover:text-cyan"
                  )}
                />
                <span className="text-sm font-medium">{item.label}</span>
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-electric-blue/0 to-neon-purple/0 group-hover:from-electric-blue/5 group-hover:to-neon-purple/5 transition-all duration-300 -z-10" />
              </button>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-sidebar-border/10">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-blue to-neon-purple flex items-center justify-center text-white font-semibold text-sm">
            AR
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              André Reis
            </p>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
              Plano Pro
            </span>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}
