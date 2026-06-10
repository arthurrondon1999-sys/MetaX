"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/shared/sidebar"
import { MobileNav } from "@/components/shared/mobile-nav"
import { PageHeader } from "@/components/integracoes/page-header"
import { DashboardBackground } from "@/components/dashboard/background"
import { AdPlatformsSection } from "@/components/integracoes/ad-platforms-section"
import { SalesPlatformsSection } from "@/components/integracoes/sales-platforms-section"
import { HowItWorksSection } from "@/components/integracoes/how-it-works-section"
import { ConnectModal } from "@/components/integracoes/connect-modal"
import { MetaConnectionModal } from "@/components/integracoes/meta-connection-modal"
import { HotmartConnectionModal } from "@/components/integracoes/hotmart-connection-modal"
import { useMetaStatus } from "@/hooks/use-meta"
import { useHotmartStatus } from "@/hooks/use-hotmart"

export default function IntegracoesPage() {
  // null = closed. No modal opens on page load.
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null)
  const [manageOpen, setManageOpen] = useState(false)
  const [hotmartManageOpen, setHotmartManageOpen] = useState(false)

  const { status, isLoading, mutate } = useMetaStatus()
  const { status: hotmartStatus, mutate: mutateHotmart } = useHotmartStatus()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardBackground />
      <Sidebar activePage="integracoes" />
      <MobileNav activePage="integracoes" />
      <PageHeader title="Integrações" />

      <main className="md:ml-60 pt-16 pb-24 md:pb-0">
        <div className="p-4 md:p-6 space-y-10 max-w-6xl">
          {/* Intro subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-sm text-muted-foreground max-w-2xl leading-relaxed"
          >
            Conecte sua conta de anúncios e plataformas de vendas para visualizar todos os dados em um só lugar.
          </motion.p>

          <AdPlatformsSection status={status} loading={isLoading} onManage={() => setManageOpen(true)} />
          <SalesPlatformsSection
            onConnect={setConnectingPlatform}
            hotmartStatus={hotmartStatus}
            onManageHotmart={() => setHotmartManageOpen(true)}
          />
          <HowItWorksSection />
        </div>
      </main>

      {/* Connect (em breve) modal — plataformas de venda */}
      <ConnectModal platform={connectingPlatform} onClose={() => setConnectingPlatform(null)} />

      {/* Gerenciar conexão Meta (real) */}
      <MetaConnectionModal
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        status={status}
        onChanged={() => mutate()}
      />

      {/* Gerenciar conexão Hotmart (real) */}
      <HotmartConnectionModal
        open={hotmartManageOpen}
        onClose={() => setHotmartManageOpen(false)}
        status={hotmartStatus}
        onChanged={() => mutateHotmart()}
      />
    </div>
  )
}
