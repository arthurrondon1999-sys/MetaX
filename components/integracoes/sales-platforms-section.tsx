"use client"

import { motion } from "framer-motion"
import { ShoppingCart } from "lucide-react"
import {
  HotmartLogo,
  KiwifyLogo,
  MonetizzeLogo,
  EduzzLogo,
  BraipLogo,
  ShopifyLogo,
} from "./platform-logos"
import { SectionTitle, StatusBadge } from "./ad-platforms-section"

interface SalesPlatform {
  name: string
  logo: React.ReactNode
  connected: boolean
  info?: string
}

const salesPlatforms: SalesPlatform[] = [
  { name: "Hotmart", logo: <HotmartLogo />, connected: true, info: "3 produtos ativos" },
  { name: "Kiwify", logo: <KiwifyLogo />, connected: true },
  { name: "Monetizze", logo: <MonetizzeLogo />, connected: false },
  { name: "Eduzz", logo: <EduzzLogo />, connected: false },
  { name: "Braip", logo: <BraipLogo />, connected: false },
  { name: "Shopify", logo: <ShopifyLogo />, connected: false },
]

interface SalesPlatformsSectionProps {
  onConnect: (platform: string) => void
}

export function SalesPlatformsSection({ onConnect }: SalesPlatformsSectionProps) {
  return (
    <section>
      <SectionTitle icon={<ShoppingCart className="w-5 h-5 text-cyan" />} title="Plataformas de Vendas" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {salesPlatforms.map((platform, index) => (
          <motion.div
            key={platform.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            whileHover={{ y: -4 }}
            className="relative flex items-center gap-3 p-4 rounded-xl bg-card/40 backdrop-blur-xl border transition-all duration-300 group"
            style={{
              borderColor: platform.connected ? "rgba(0,255,100,0.2)" : "rgba(0,212,255,0.1)",
              boxShadow: platform.connected ? "0 0 24px rgba(0,255,100,0.08)" : "none",
            }}
          >
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
              style={{
                boxShadow: platform.connected
                  ? "0 0 40px rgba(0,255,100,0.15)"
                  : "0 0 40px rgba(0,212,255,0.12)",
              }}
            />
            <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center shrink-0">
              {platform.logo}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white">{platform.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
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
                <p className="text-[11px] text-muted-foreground mt-0.5">{platform.info}</p>
              )}
            </div>
            <button
              onClick={() => !platform.connected && onConnect(platform.name)}
              className={
                platform.connected
                  ? "px-3 py-1.5 rounded-lg border border-cyan/40 text-cyan text-xs font-medium hover:bg-cyan/10 transition-colors shrink-0"
                  : "px-3 py-1.5 rounded-lg text-white text-xs font-medium transition-all duration-300 hover:shadow-[0_0_16px_rgba(0,102,255,0.4)] shrink-0"
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
