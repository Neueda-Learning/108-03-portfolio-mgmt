import { useContext, useEffect, useMemo, useState } from 'react'
import { FiBarChart2, FiDollarSign, FiPieChart, FiTrendingUp, FiPercent, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'
import UserContext from '../context/UserContext'
import AddAsset from '../dashboard/AddAsset'
import AssetAllocationChart from '../dashboard/AssetAllocation'
import PortfolioRecommendation from '../dashboard/PortfolioRecommendation'
import { getPortfolioDataForUser } from '../data/portfolioData'
import { getPortfolio } from '../services/portfolioService'
import { getAssets } from '../services/assetService'
import { getInsights } from '../services/insightService'
import SummaryCard from '../dashboard/SummaryCard'
import TopHoldings from '../dashboard/TopHoldings'

const formatINR = (value) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(Number(value ?? 0))

const formatPercent = (value) => `${Number(value ?? 0).toFixed(2)}%`

const ALLOCATION_THRESHOLDS = {
    STOCK: 60,
    CRYPTO: 15,
    GOLD: 20,
    BOND: 30,
    CASH: 10,
}

const ASSET_TYPE_ALIASES = {
    STOCKS: 'STOCK',
    EQUITY: 'STOCK',
    CRYPTOCURRENCY: 'CRYPTO',
}

const normalizeAssetType = (value) =>
    String(value ?? '')
        .trim()
        .toUpperCase()
        .replace(/\./g, '')
        .replace(/\s+/g, ' ')

function Dashboard() {
    const { selectedUser } = useContext(UserContext)
    const [isAddAssetOpen, setIsAddAssetOpen] = useState(false)
    const [portfolioResponse, setPortfolioResponse] = useState(null)
    const [assetOptions, setAssetOptions] = useState([])
    const [reloadKey, setReloadKey] = useState(0)
    const [insights, setInsights] = useState(null)
    const [insightsLoading, setInsightsLoading] = useState(false)

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
    }, [activeUserId, reloadKey])

    useEffect(() => {
        const loadAssets = async () => {
            try {
                const data = await getAssets()
                setAssetOptions(data)
            } catch (error) {
                console.error('Failed to load assets:', error)
                setAssetOptions([])
            }
        }
        loadAssets()
    }, [])

    useEffect(() => {
        let ignore = false

        const loadInsights = async () => {
            if (!activeUserId) {
                setInsights(null)
                return
            }

            try {
                setInsightsLoading(true)
                const data = await getInsights(activeUserId)
                if (!ignore) setInsights(data)
            } catch (error) {
                if (!ignore) {
                    console.error('Failed to load insights:', error)
                    setInsights({ holdingClusters: [] })
                }
            } finally {
                if (!ignore) setInsightsLoading(false)
            }
        }

        loadInsights()
        return () => {
            ignore = true
        }
    }, [activeUserId])

    const recommendationRows = useMemo(() => {
        return Array.isArray(insights?.holdingClusters) ? insights.holdingClusters : []
    }, [insights])

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
                icon: FiPieChart,
            },
            {
                title: 'Current Value',
                value: formatINR(currentValue),
                change: '',
                isPositive: currentValue >= invested,
                icon: FiDollarSign,
            },
            {
                title: 'Profit / Loss',
                value: formatINR(profitLoss),
                change: '',
                isPositive: profitLoss >= 0,
                icon: FiTrendingUp,
            },
            {
                title: 'Profit/Loss %',
                value: formatPercent(profitLossPercentage),
                change: '',
                isPositive: profitLossPercentage >= 0,
                icon: FiPercent,
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

    const topHoldingsData = useMemo(() => {
        const apiPositions = Array.isArray(portfolioResponse?.positions) ? portfolioResponse.positions : []

        if (apiPositions.length === 0) {
            return [] // no dummy/fallback data
        }

        return apiPositions
            .map((p) => {
                const quantity = Number(p?.totalQuantity ?? 0)
                const marketValue = Number(p?.currentValue ?? 0)
                const totalInvested = Number(p?.totalInvested ?? 0)

                const currentPrice = quantity > 0 ? marketValue / quantity : 0
                const buyPrice = quantity > 0 ? totalInvested / quantity : 0

                return {
                    asset: p?.assetName ?? '-',
                    type: p?.type ?? '-',
                    quantity,
                    buyPrice,
                    currentPrice,
                    marketValue,
                    profitLoss: Number(p?.profitLoss ?? 0),
                }
            })
            .sort((a, b) => b.marketValue - a.marketValue)
            .slice(0, 5)
    }, [portfolioResponse?.positions])

    const allocationAlerts = useMemo(() => {
        const assets = Array.isArray(portfolioResponse?.assets) ? portfolioResponse.assets : []

        return assets
            .map((item) => {
                const rawType = item?.assetName ?? item?.name
                const normalized = normalizeAssetType(rawType)
                const thresholdKey = ASSET_TYPE_ALIASES[normalized] ?? normalized
                const threshold = ALLOCATION_THRESHOLDS[thresholdKey]
                const current = Number(item?.percentageInvested ?? item?.value ?? 0)

                if (threshold == null || Number.isNaN(current)) return null
                if (current <= threshold) return null

                return {
                    assetType: rawType,
                    current,
                    threshold,
                }
            })
            .filter(Boolean)
    }, [portfolioResponse?.assets])

    return (
        <>
            <div className="space-y-6">
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {summaryCards.map((card) => (
                        <SummaryCard key={card.title} {...card} />
                    ))}
                </section>

                <section className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-[3fr_2fr]">
                    <PortfolioRecommendation rows={recommendationRows} isLoading={insightsLoading} />
                    <AssetAllocationChart data={allocationData} />
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-3 flex items-center gap-2">
                        <FiAlertTriangle className="text-amber-500" />
                        <h3 className="text-sm font-semibold text-slate-800">Allocation Threshold Alerts</h3>
                    </div>

                    {allocationAlerts.length > 0 ? (
                        <div className="space-y-3">
                            {allocationAlerts.map((alert, index) => (
                                <div
                                    key={`${alert.assetType}-${index}`}
                                    className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 text-amber-900"
                                >
                                    <p className="text-sm leading-6">
                                        <span className="font-semibold">⚠ {alert.assetType}</span>{' '}
                                        is at <span className="font-semibold">{alert.current.toFixed(2)}%</span>
                                        {' '}vs threshold <span className="font-semibold">{alert.threshold}%</span>.
                                    </p>
                                    <p className="mt-1 text-xs text-amber-800">Recommendation: diversify allocation.</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-3 text-emerald-900">
                            <FiCheckCircle className="text-emerald-600" />
                            <span className="text-sm font-medium">Portfolio is well diversified</span>
                        </div>
                    )}
                </section>

                <TopHoldings data={topHoldingsData} onAddAsset={() => setIsAddAssetOpen(true)} />
            </div>

            <AddAsset
                isOpen={isAddAssetOpen}
                onClose={() => setIsAddAssetOpen(false)}
                onSuccesss={() => setReloadKey((v) => v + 1)}
                assetOptions={assetOptions}
            />
        </>
    )
}

export default Dashboard
