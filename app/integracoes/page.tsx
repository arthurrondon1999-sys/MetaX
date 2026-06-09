"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/shared/sidebar"
import { PageHeader } from "@/components/integracoes/page-header"
import { DashboardBackground } from "@/components/dashboard/background"
import { AdPlatformsSection } from "@/components/integracoes/ad-platforms-section"
import { SalesPlatformsSection } from "@/components/integracoes/sales-platforms-section"
import { HowItWorksSection } from "@/components/integracoes/how-it-works-section"
import { ConnectModal } from "@/components/integracoes/connect-modal"

export default function IntegracoesPage() {
  // null = closed. No modal opens on page load.
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null)
  const [manageOpen, setManageOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardBackground />
      <Sidebar activePage="integracoes" />
      <PageHeader title="Integrações" />

      <main className="ml-60 pt-16">
        <div className="p-6 space-y-10 max-w-6xl">
          {/* Intro subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-sm text-muted-foreground max-w-2xl leading-relaxed"
          >
            Conecte sua conta de anúncios e plataformas de vendas para visualizar todos os dados em um só
            lugar.
          </motion.p>

          <AdPlatformsSection onManage={() => setManageOpen(true)} />
          <SalesPlatformsSection onConnect={setConnectingPlatform} />
          <HowItWorksSection />
        </div>
      </main>

      {/* Connect (em breve) modal */}
      <ConnectModal platform={connectingPlatform} onClose={() => setConnectingPlatform(null)} />

      {/* Gerenciar conexão modal */}
      <ConnectModal
        platform={manageOpen ? "Meta Ads" : null}
        manage
        onClose={() => setManageOpen(false)}
      />
    </div>
  )
}
