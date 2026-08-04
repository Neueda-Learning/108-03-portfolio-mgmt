import { useState } from 'react'
import { FiBarChart2, FiDollarSign, FiPieChart, FiTrendingUp } from 'react-icons/fi'
import AddAsset from '../dashboard/AddAsset'
import AssetAllocationChart from '../dashboard/AssetAllocation'
import PortfolioChart from '../dashboard/PortfolioChart'
import SummaryCard from '../dashboard/SummaryCard'
import TopHoldings from '../dashboard/TopHoldings'

const summaryCards = [
  {
    title: 'Portfolio Value',
    value: '$248,420',
    icon: FiDollarSign,
    change: '+6.8%',
    isPositive: true,
    iconBgColor: 'bg-sky-100',
  },
  {
    title: 'Total Gain',
    value: '$18,945',
    icon: FiTrendingUp,
    change: '+3.1%',
    isPositive: true,
    iconBgColor: 'bg-emerald-100',
  },
  {
    title: 'Asset Classes',
    value: '5',
    icon: FiPieChart,
    change: '-0.6%',
    isPositive: false,
    iconBgColor: 'bg-amber-100',
  },
  {
    title: 'Monthly Return',
    value: '$4,260',
    icon: FiBarChart2,
    change: '+2.4%',
    isPositive: true,
    iconBgColor: 'bg-violet-100',
  },
]

const allocationData = [
  { name: 'Equity', value: 48 },
  { name: 'Debt', value: 22 },
  { name: 'Gold', value: 12 },
  { name: 'ETF', value: 10 },
  { name: 'Cash', value: 8 },
]

const performanceData = [
  { data: 'Jan', value: 198000 },
  { data: 'Feb', value: 205500 },
  { data: 'Mar', value: 210800 },
  { data: 'Apr', value: 221200 },
  { data: 'May', value: 228900 },
  { data: 'Jun', value: 236400 },
  { data: 'Jul', value: 248420 },
]

const holdingsData = [
  {
    asset: 'Apple Inc.',
    type: 'Equity',
    quantity: 42,
    buyPrice: 164.5,
    currentPrice: 192.3,
    marketValue: 8076.6,
    profitLoss: 1167.6,
  },
  {
    asset: 'NVIDIA',
    type: 'Equity',
    quantity: 18,
    buyPrice: 880.0,
    currentPrice: 915.4,
    marketValue: 16477.2,
    profitLoss: 637.2,
  },
  {
    asset: 'Gold ETF',
    type: 'Commodity',
    quantity: 65,
    buyPrice: 54.2,
    currentPrice: 51.9,
    marketValue: 3373.5,
    profitLoss: -149.5,
  },
  {
    asset: 'US Treasury Fund',
    type: 'Debt',
    quantity: 120,
    buyPrice: 26.8,
    currentPrice: 27.35,
    marketValue: 3282,
    profitLoss: 66,
  },
]

function Dashboard() {
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false)

  const handleAddAssetSubmit = (payload) => {
    console.log('Add asset payload:', payload)
    setIsAddAssetOpen(false)
  }

  return (
    <>
      <div className="space-y-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <SummaryCard key={card.title} {...card} />
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <PortfolioChart chartData={performanceData} />
          <AssetAllocationChart data={allocationData} />
        </section>

        <TopHoldings data={holdingsData} onAddAsset={() => setIsAddAssetOpen(true)} />
      </div>

      <AddAsset
        isOpen={isAddAssetOpen}
        onClose={() => setIsAddAssetOpen(false)}
        onSubmit={handleAddAssetSubmit}
        assetOptions={['AAPL', 'NVDA', 'GLD', 'TLT', 'MSFT']}
      />
    </>
  )
}

export default Dashboard
