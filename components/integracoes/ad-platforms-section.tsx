"use client"

import { motion } from "framer-motion"
import { Megaphone } from "lucide-react"
import { MetaLogo } from "./platform-logos"

export function AdPlatformsSection() {
  return (
    <section>
      <SectionTitle icon={<Megaphone className="w-5 h-5 text-cyan" />} title="Plataforma de Anúncios" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ y: -4 }}
        className="relative w-full max-w-[480px] p-6 rounded-xl bg-card/40 backdrop-blur-xl border transition-all duration-300 group"
        style={{
          borderColor: "rgba(0,255,100,0.2)",
          boxShadow: "0 0 24px rgba(0,255,100,0.08)",
        }}
      >
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
          style={{ boxShadow: "0 0 40px rgba(0,255,100,0.15)" }}
        />

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center shrink-0">
              <MetaLogo className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Meta Ads</h3>
              <p className="text-xs text-muted-foreground">Facebook &amp; Instagram Ads</p>
            </div>
          </div>
          <StatusBadge connected />
        </div>

        {/* Connected account */}
        <div className="flex items-center gap-2 mt-5 p-3 rounded-lg bg-white/[0.03] border border-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric-blue to-neon-purple flex items-center justify-center text-white text-[11px] font-semibold">
            AR
          </div>
          <span className="text-xs text-muted-foreground">
            Conta: <span className="text-white font-medium">Arthur Rondon</span>
          </span>
        </div>

        <p className="text-[11px] text-muted-foreground mt-3">
          Última sincronização: <span className="text-cyan">há 2 minutos</span>
        </p>

        <button className="mt-5 w-full py-2.5 rounded-lg border border-cyan/40 text-cyan text-sm font-medium hover:bg-cyan/10 transition-colors">
          Gerenciar Conexão
        </button>
      </motion.div>
    </section>
  )
}

export function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2.5">
        {icon}
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <div className="mt-2 h-0.5 w-16 rounded-full bg-gradient-to-r from-cyan to-neon-purple" />
    </div>
  )
}

export function StatusBadge({ connected = false }: { connected?: boolean }) {
  if (connected) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-medium text-green-500">Conectado</span>
      </div>
    )
  }
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
      <span className="text-xs font-medium text-muted-foreground">Não conectado</span>
    </div>
  )
}
