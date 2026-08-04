import { useMemo, useState } from 'react'
import DeleteHoldingDialog from '../holdings/DeleteHoldingDialog'
import HoldingsTable from '../holdings/HoldingsTable'

const dummyHoldings = [
  {
    id: 1,
    asset: 'Apple Inc.',
    type: 'Equity',
    quantity: 35,
    buyPrice: 172.5,
    currentPrice: 191.4,
    marketValue: 6699,
    profitLoss: 661.5,
    purchaseDate: '2026-03-02',
  },
  {
    id: 2,
    asset: 'NVIDIA',
    type: 'Equity',
    quantity: 14,
    buyPrice: 845,
    currentPrice: 915.6,
    marketValue: 12818.4,
    profitLoss: 988.4,
    purchaseDate: '2026-02-10',
  },
  {
    id: 3,
    asset: 'Gold ETF',
    type: 'Commodity',
    quantity: 58,
    buyPrice: 53.8,
    currentPrice: 52.1,
    marketValue: 3021.8,
    profitLoss: -98.6,
    purchaseDate: '2026-01-18',
  },
  {
    id: 4,
    asset: 'US Treasury Fund',
    type: 'Debt',
    quantity: 120,
    buyPrice: 26.7,
    currentPrice: 27.3,
    marketValue: 3276,
    profitLoss: 72,
    purchaseDate: '2025-12-29',
  },
  {
    id: 5,
    asset: 'Ethereum',
    type: 'Crypto',
    quantity: 2.5,
    buyPrice: 2950,
    currentPrice: 3210,
    marketValue: 8025,
    profitLoss: 650,
    purchaseDate: '2026-04-07',
  },
]

function Holdings() {
  const [holdings, setHoldings] = useState(dummyHoldings)
  const [searchTerm, setSearchTerm] = useState('')
  const [assetType, setAssetType] = useState('All')
  const [selectedHolding, setSelectedHolding] = useState(null)

  const assetTypeOptions = useMemo(() => {
    const uniqueTypes = [...new Set(holdings.map((item) => item.type))]
    return ['All', ...uniqueTypes]
  }, [holdings])

  const filteredHoldings = useMemo(() => {
    return holdings.filter((item) => {
      const matchesSearch = item.asset.toLowerCase().includes(searchTerm.trim().toLowerCase())
      const matchesType = assetType === 'All' || item.type === assetType
      return matchesSearch && matchesType
    })
  }, [holdings, searchTerm, assetType])

  const handleDeleteConfirm = () => {
    if (!selectedHolding) return
    setHoldings((prev) => prev.filter((item) => item.id !== selectedHolding.id))
    setSelectedHolding(null)
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-2xl font-bold text-slate-900">Holdings</h2>
        <p className="mt-1 text-sm text-slate-600">Manage yourr portfolio assests</p>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search asset..."
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />

          <select
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            {assetTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </section>

      <HoldingsTable data={filteredHoldings} onDelete={(holding) => setSelectedHolding(holding)} />

      <DeleteHoldingDialog
        isOpen={Boolean(selectedHolding)}
        onClose={() => setSelectedHolding(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}

export default Holdings
