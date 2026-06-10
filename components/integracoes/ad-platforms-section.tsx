"use client"

import { motion } from "framer-motion"
import { Megaphone, AlertTriangle, Clock } from "lucide-react"
import { MetaLogo } from "./platform-logos"
import type { MetaStatus } from "@/hooks/use-meta"

interface AdPlatformsSectionProps {
  onManage?: () => void
  status?: MetaStatus
  loading?: boolean
}

export function AdPlatformsSection({ onManage, status, loading }: AdPlatformsSectionProps) {
  const connected = Boolean(status?.connected)
  const expired = Boolean(status?.expired)
  const tokenValid = Boolean(status?.tokenValid) && !expired
  const activeAccount = status?.accounts?.find((a) => a.account_id === status?.accountId) || status?.accounts?.[0]
  const accountName = activeAccount?.name

  const expiresAt = status?.expiresAt
  const daysLeft = status?.daysUntilExpiry ?? null
  // Aviso quando faltam 7 dias ou menos (mas ainda válido)
  const expiringSoon = tokenValid && daysLeft != null && daysLeft >= 0 && daysLeft <= 7

  const borderColor = expired
    ? "rgba(255,80,80,0.3)"
    : expiringSoon
      ? "rgba(255,180,0,0.3)"
      : tokenValid
        ? "rgba(0,255,100,0.2)"
        : connected
          ? "rgba(255,180,0,0.25)"
          : "rgba(255,255,255,0.1)"
  const glow = expired
    ? "rgba(255,80,80,0.08)"
    : expiringSoon
      ? "rgba(255,180,0,0.1)"
      : tokenValid
        ? "rgba(0,255,100,0.08)"
        : connected
          ? "rgba(255,180,0,0.08)"
          : "transparent"

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
          borderColor,
          boxShadow: `0 0 24px ${glow}`,
        }}
      >
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
          <StatusBadge connected={tokenValid} pending={connected && !tokenValid && !expired} expired={expired} />
        </div>

        {/* Connected account */}
        {connected && (
          <div className="flex items-center gap-2 mt-5 p-3 rounded-lg bg-white/[0.03] border border-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric-blue to-neon-purple flex items-center justify-center text-white text-[11px] font-semibold">
              {accountName ? accountName.slice(0, 2).toUpperCase() : "MA"}
            </div>
            <span className="text-xs text-muted-foreground">
              Conta:{" "}
              <span className="text-white font-medium">
                {accountName || (tokenValid ? "Conta padrão" : "Indisponível")}
              </span>
            </span>
          </div>
        )}

        {/* Token expiry status */}
        {connected && expired && (
          <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="text-xs font-medium text-red-400">
              Token expirado{expiresAt ? ` em ${formatExpiryDate(expiresAt)}` : ""}. Reconecte para continuar.
            </span>
          </div>
        )}

        {connected && !expired && expiringSoon && (
          <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-medium text-amber-400">
              {daysLeft === 0 ? "Token expira hoje" : `Token expira em ${daysLeft} ${daysLeft === 1 ? "dia" : "dias"}`}
            </span>
          </div>
        )}

        {connected && tokenValid && !expiringSoon && expiresAt && (
          <p className="text-[11px] text-muted-foreground mt-3">
            Token válido até:{" "}
            <span className="text-cyan font-medium">{formatExpiryDate(expiresAt)}</span>
          </p>
        )}

        {connected && !tokenValid && !expired && status?.error && (
          <p className="text-[11px] text-amber-400 mt-3">{status.error}</p>
        )}

        {connected && status?.updatedAt && (
          <p className="text-[11px] text-muted-foreground mt-3">
            Última atualização:{" "}
            <span className="text-cyan">{new Date(status.updatedAt).toLocaleString("pt-BR")}</span>
          </p>
        )}

        <button
          onClick={onManage}
          disabled={loading}
          className={
            expiringSoon || expired
              ? "mt-5 w-full py-2.5 rounded-lg text-white text-sm font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,102,255,0.4)] disabled:opacity-50"
              : "mt-5 w-full py-2.5 rounded-lg border border-cyan/40 text-cyan text-sm font-medium hover:bg-cyan/10 transition-colors disabled:opacity-50"
          }
          style={
            expiringSoon || expired ? { background: "linear-gradient(135deg,#0066FF,#8B00FF)" } : undefined
          }
        >
          {expired ? "Reconectar" : expiringSoon ? "Renovar" : connected ? "Gerenciar Conexão" : "Conectar Meta Ads"}
        </button>
      </motion.div>
    </section>
  )
}

/** Formata uma data ISO para DD/MM/YYYY. */
function formatExpiryDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
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

export function StatusBadge({
  connected = false,
  pending = false,
  expired = false,
}: {
  connected?: boolean
  pending?: boolean
  expired?: boolean
}) {
  if (expired) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        <span className="text-xs font-medium text-red-400">Token expirado</span>
      </div>
    )
  }
  if (connected) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-medium text-green-500">Conectado</span>
      </div>
    )
  }
  if (pending) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        <span className="text-xs font-medium text-amber-500">Atenção</span>
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
