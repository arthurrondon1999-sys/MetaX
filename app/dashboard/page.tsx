import { Sidebar } from "@/components/shared/sidebar"
import { Header } from "@/components/dashboard/header"
import { MetricsGrid } from "@/components/dashboard/metric-cards"
import { RevenueChart, SalesByHourChart } from "@/components/dashboard/charts"
import { WorldMap } from "@/components/dashboard/world-map"
import { DashboardBackground } from "@/components/dashboard/background"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardBackground />
      <Sidebar activePage="dashboard" />
      <Header />

      {/* Main Content */}
      <main className="ml-60 pt-16">
        <div className="p-6 space-y-6">
          {/* Metrics Grid */}
          <MetricsGrid />

          {/* Revenue Chart */}
          <RevenueChart />

          {/* Bottom Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* World Map - 55% width */}
            <div className="lg:col-span-3">
              <WorldMap />
            </div>

            {/* Sales by Hour - 45% width */}
            <div className="lg:col-span-2">
              <SalesByHourChart />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
