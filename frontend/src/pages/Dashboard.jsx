import { useContext, useMemo, useState } from 'react'
import { FiBarChart2, FiDollarSign, FiPieChart, FiTrendingUp } from 'react-icons/fi'
import UserContext from '../context/UserContext'
import AddAsset from '../dashboard/AddAsset'
import AssetAllocationChart from '../dashboard/AssetAllocation'
import PortfolioChart from '../dashboard/PortfolioChart'
import SummaryCard from '../dashboard/SummaryCard'
import TopHoldings from '../dashboard/TopHoldings'
import { getPortfolioDataForUser } from '../data/portfolioData'

const summaryIconByKey = {
  value: FiDollarSign,
  gain: FiTrendingUp,
  allocation: FiPieChart,
  return: FiBarChart2,
}

function Dashboard() {
  const { selectedUser } = useContext(UserContext)
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false)

  const userPortfolio = useMemo(() => {
    return getPortfolioDataForUser(selectedUser?.id)
  }, [selectedUser?.id])

  const summaryCards = useMemo(() => {
    return userPortfolio.summaryCards.map((card) => ({
      ...card,
      icon: summaryIconByKey[card.iconKey] || FiDollarSign,
    }))
  }, [userPortfolio.summaryCards])

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
          <PortfolioChart chartData={userPortfolio.performanceData} />
          <AssetAllocationChart data={userPortfolio.allocationData} />
        </section>

        <TopHoldings data={userPortfolio.holdingsData} onAddAsset={() => setIsAddAssetOpen(true)} />
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
