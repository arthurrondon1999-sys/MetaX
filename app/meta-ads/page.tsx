"use client"

import { useState } from "react"
import { Sidebar } from "@/components/shared/sidebar"
import { MetaAdsHeader } from "@/components/meta-ads/header"
import { MetaAdsSummaryCards } from "@/components/meta-ads/summary-cards"
import { TabNavigation } from "@/components/meta-ads/tab-navigation"
import { FilterBar } from "@/components/meta-ads/filter-bar"
import { CampaignsTable } from "@/components/meta-ads/campaigns-table"
import { Pagination } from "@/components/meta-ads/pagination"
import { DailySpendChart } from "@/components/meta-ads/daily-spend-chart"
import { DashboardBackground } from "@/components/dashboard/background"

type TabType = "campanhas" | "conjuntos" | "anuncios"

export default function MetaAdsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("campanhas")
  const [searchValue, setSearchValue] = useState("")
  const [statusFilter, setStatusFilter] = useState("Todos os status")

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardBackground />
      <Sidebar activePage="meta-ads" />
      <MetaAdsHeader />
      
      {/* Main content */}
      <main className="ml-60 pt-16">
        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <MetaAdsSummaryCards />

          {/* Tab Navigation */}
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Filter Bar */}
          <FilterBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />

          {/* Campaigns Table */}
          <CampaignsTable />

          {/* Pagination */}
          <Pagination total={6} pageSize={10} currentPage={1} />

          {/* Daily Spend Chart */}
          <DailySpendChart />
        </div>
      </main>
    </div>
  )
}
