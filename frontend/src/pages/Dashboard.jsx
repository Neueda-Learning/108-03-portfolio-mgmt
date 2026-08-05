import { useContext, useEffect, useMemo, useState } from 'react'
import { FiBarChart2, FiDollarSign, FiPieChart, FiTrendingUp, FiPercent } from 'react-icons/fi'
import UserContext from '../context/UserContext'
import AddAsset from '../dashboard/AddAsset'
import AssetAllocationChart from '../dashboard/AssetAllocation'
import PortfolioChart from '../dashboard/PortfolioChart'
import SummaryCard from '../dashboard/SummaryCard'
import TopHoldings from '../dashboard/TopHoldings'
import { getPortfolioDataForUser } from '../data/portfolioData'
import { getPortfolio } from '../services/portfolioService'

const summaryIconByKey = {
    value: FiDollarSign,
    gain: FiTrendingUp,
    allocation: FiPieChart,
    return: FiBarChart2,
}

const formatINR = (value) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(Number(value ?? 0))

const formatPercent = (value) => `${Number(value ?? 0).toFixed(2)}%`

function Dashboard() {
    const { selectedUser } = useContext(UserContext)
    const [isAddAssetOpen, setIsAddAssetOpen] = useState(false)
    const [portfolioResponse, setPortfolioResponse] = useState(null)

    const activeUserId = selectedUser?.id ?? selectedUser?.userId ?? null

    const userPortfolio = useMemo(() => {
        return getPortfolioDataForUser(activeUserId)
    }, [activeUserId])

    useEffect(() => {
        let ignore = false

        const loadPortfolio = async () => {
            if (!activeUserId) {
                setPortfolioResponse(null)
                return
            }

            try {
                const data = await getPortfolio(activeUserId)
                if (!ignore) setPortfolioResponse(data)
            } catch (error) {
                if (!ignore) {
                    console.error('Failed to load portfolio:', error)
                    setPortfolioResponse(null)
                }
            }
        }

        loadPortfolio()
        return () => {
            ignore = true
        }
    }, [activeUserId])

    const summaryCards = useMemo(() => {
        const t = portfolioResponse?.totals

        const invested = Number(t?.invested ?? 0)
        const currentValue = Number(t?.currentValue ?? 0)
        const profitLoss = Number(t?.profitLoss ?? 0)
        const profitLossPercentage = Number(t?.profitLossPercentage ?? 0)

        return [
            {
                title: 'Invested',
                value: formatINR(invested),
                change: '',
                isPositive: true,
                icon: FiPieChart,      // appropriate for allocation/investment base
            },
            {
                title: 'Current Value',
                value: formatINR(currentValue),
                change: '',
                isPositive: currentValue >= invested,
                icon: FiDollarSign,    // value/money
            },
            {
                title: 'Profit / Loss',
                value: formatINR(profitLoss),
                change: '',
                isPositive: profitLoss >= 0,
                icon: FiTrendingUp,    // gain/loss trend
            },
            {
                title: 'Profit/Loss %',
                value: formatPercent(profitLossPercentage),
                change: '',
                isPositive: profitLossPercentage >= 0,
                icon: FiPercent,       // percentage metric
            },
        ]
    }, [portfolioResponse?.totals])

    const allocationData = useMemo(() => {
        const assets = portfolioResponse?.assets
        if (!Array.isArray(assets) || assets.length === 0) return userPortfolio.allocationData

        return assets.map((a) => ({
            name: a.assetName,
            value: Number(a.percentageInvested) || 0,
        }))
    }, [portfolioResponse?.assets, userPortfolio.allocationData])

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
                    <AssetAllocationChart data={allocationData} />
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
