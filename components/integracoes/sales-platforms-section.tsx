"use client"

import { motion } from "framer-motion"
import { ShoppingBag } from "lucide-react"
import {
  HotmartLogo,
  KiwifyLogo,
  PerfectPayLogo,
  DigistoreLogo,
  CaktoLogo,
} from "./platform-logos"
import { SectionTitle } from "./ad-platforms-section"

interface SalesPlatform {
  name: string
  logo: React.ReactNode
  subtitle: string
  connected: boolean
  info?: string
  featured?: boolean
}

const salesPlatforms: SalesPlatform[] = [
  {
    name: "Hotmart",
    logo: <HotmartLogo />,
    subtitle: "Plataforma de infoprodutos",
    connected: true,
    info: "3 produtos ativos",
    featured: true,
  },
  { name: "Kiwify", logo: <KiwifyLogo />, subtitle: "Plataforma de vendas", connected: false },
  { name: "Perfect Pay", logo: <PerfectPayLogo />, subtitle: "Gateway de pagamentos", connected: false },
  { name: "Digistore", logo: <DigistoreLogo />, subtitle: "Marketplace digital", connected: false },
  { name: "Cakto", logo: <CaktoLogo />, subtitle: "Plataforma de vendas", connected: false },
]

interface SalesPlatformsSectionProps {
  onConnect: (platform: string) => void
}

export function SalesPlatformsSection({ onConnect }: SalesPlatformsSectionProps) {
  return (
    <section>
      <SectionTitle icon={<ShoppingBag className="w-5 h-5 text-cyan" />} title="Plataformas de Vendas" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {salesPlatforms.map((platform, index) => (
          <motion.div
            key={platform.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            whileHover={{ y: -4 }}
            className="relative p-5 rounded-xl bg-card/40 backdrop-blur-xl border transition-all duration-300 group"
            style={{
              borderColor: platform.connected ? "rgba(0,255,100,0.2)" : "rgba(0,212,255,0.1)",
              boxShadow: platform.connected ? "0 0 24px rgba(0,255,100,0.08)" : "none",
            }}
          >
            {/* Featured badge */}
            {platform.featured && (
              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
                Principal
              </span>
            )}

            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
              style={{
                boxShadow: platform.connected
                  ? "0 0 40px rgba(0,255,100,0.15)"
                  : "0 0 40px rgba(0,212,255,0.12)",
              }}
            />

            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center shrink-0">
                {platform.logo}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{platform.name}</h3>
                <p className="text-[11px] text-muted-foreground">{platform.subtitle}</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-1.5 mt-4">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  platform.connected ? "bg-green-500 animate-pulse" : "bg-muted-foreground"
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  platform.connected ? "text-green-500" : "text-muted-foreground"
                }`}
              >
                {platform.connected ? "Conectado" : "Não conectado"}
              </span>
            </div>

            {platform.info && (
              <p className="text-[11px] text-muted-foreground mt-1.5">{platform.info}</p>
            )}

            <button
              onClick={() => !platform.connected && onConnect(platform.name)}
              className={
                platform.connected
                  ? "mt-4 w-full py-2.5 rounded-lg border border-cyan/40 text-cyan text-sm font-medium hover:bg-cyan/10 transition-colors"
                  : "mt-4 w-full py-2.5 rounded-lg text-white text-sm font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,102,255,0.4)]"
              }
              style={
                platform.connected
                  ? undefined
                  : { background: "linear-gradient(135deg,#0066FF,#8B00FF)" }
              }
            >
              {platform.connected ? "Gerenciar" : "Conectar"}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
