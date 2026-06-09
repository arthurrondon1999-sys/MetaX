"use client"

import { motion } from "framer-motion"
import { Megaphone } from "lucide-react"
import { MetaLogo, GoogleAdsLogo, TikTokLogo } from "./platform-logos"

interface AdPlatformsSectionProps {
  onConnect: (platform: string) => void
}

export function AdPlatformsSection({ onConnect }: AdPlatformsSectionProps) {
  return (
    <section>
      <SectionTitle icon={<Megaphone className="w-5 h-5 text-cyan" />} title="Plataformas de Anúncios" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Meta Ads - Connected */}
        <PlatformCard
          connected
          delay={0}
          logo={<MetaLogo className="w-9 h-9" />}
          title="Meta Ads"
          subtitle="Facebook & Instagram Ads"
        >
          <StatusBadge connected />
          <div className="flex items-center gap-2 mt-4 p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-electric-blue to-neon-purple flex items-center justify-center text-white text-[10px] font-semibold">
              AR
            </div>
            <span className="text-xs text-muted-foreground">
              Conta: <span className="text-white font-medium">Arthur Rondon</span>
            </span>
          </div>
          <button className="mt-4 w-full py-2.5 rounded-lg border border-cyan/40 text-cyan text-sm font-medium hover:bg-cyan/10 transition-colors">
            Gerenciar Conexão
          </button>
        </PlatformCard>

        {/* Google Ads - Disconnected */}
        <PlatformCard
          delay={0.1}
          logo={<GoogleAdsLogo className="w-9 h-9" />}
          title="Google Ads"
          subtitle="Search, Display & YouTube"
        >
          <StatusBadge />
          <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
            Visualize campanhas do Google junto com seus Meta Ads
          </p>
          <GradientButton onClick={() => onConnect("Google Ads")}>Conectar Google Ads</GradientButton>
        </PlatformCard>

        {/* TikTok Ads - Disconnected */}
        <PlatformCard
          delay={0.2}
          logo={<TikTokLogo className="w-9 h-9" />}
          title="TikTok Ads"
          subtitle="TikTok for Business"
        >
          <StatusBadge />
          <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
            Acompanhe seus anúncios no TikTok em tempo real
          </p>
          <GradientButton onClick={() => onConnect("TikTok Ads")}>Conectar TikTok</GradientButton>
        </PlatformCard>
      </div>
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
      <div className="mt-2 h-0.5 w-16 rounded-full bg-gradient-to-r from-electric-blue to-neon-purple" />
    </div>
  )
}

export function PlatformCard({
  children,
  logo,
  title,
  subtitle,
  connected = false,
  delay = 0,
}: {
  children: React.ReactNode
  logo: React.ReactNode
  title: string
  subtitle: string
  connected?: boolean
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className="relative p-5 rounded-xl bg-card/40 backdrop-blur-xl border transition-all duration-300 group"
      style={{
        borderColor: connected ? "rgba(0,255,100,0.2)" : "rgba(0,212,255,0.1)",
        boxShadow: connected ? "0 0 24px rgba(0,255,100,0.08)" : "none",
      }}
    >
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
        style={{
          boxShadow: connected
            ? "0 0 40px rgba(0,255,100,0.15)"
            : "0 0 40px rgba(0,212,255,0.12)",
        }}
      />
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center shrink-0">
          {logo}
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </motion.div>
  )
}

export function StatusBadge({ connected = false }: { connected?: boolean }) {
  if (connected) {
    return (
      <div className="inline-flex items-center gap-1.5 mt-4 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-medium text-green-500">Conectado</span>
      </div>
    )
  }
  return (
    <div className="inline-flex items-center gap-1.5 mt-4 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
      <span className="text-xs font-medium text-muted-foreground">Não conectado</span>
    </div>
  )
}

export function GradientButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="mt-4 w-full py-2.5 rounded-lg text-white text-sm font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,102,255,0.4)]"
      style={{ background: "linear-gradient(135deg,#0066FF,#8B00FF)" }}
    >
      {children}
    </button>
  )
}
