import { useContext, useEffect, useMemo, useState } from 'react'
import UserContext from '../context/UserContext'
import DeleteHoldingDialog from '../holdings/DeleteHoldingDialog'
import HoldingsTable from '../holdings/HoldingsTable'
import { getPortfolio } from '../services/portfolioService'
import { FiEdit2 } from 'react-icons/fi'
import AddAsset from '../dashboard/AddAsset'
import { getAssets } from '../services/assetService'

function Holdings() {
  const { selectedUser } = useContext(UserContext)
  const [holdings, setHoldings] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false)
  const [editingHolding, setEditingHolding] = useState(null)
  const [assetOptions, setAssetOptions] = useState([])
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!selectedUser?.id) return

    setIsLoading(true)
    getPortfolio(selectedUser.id)
      .then((data) => {
        const positions = Array.isArray(data?.positions) ? data.positions : []
        setHoldings(
          positions.map((p, index) => ({
            id: index,
            asset: p.assetName,
            type: p.type,
            quantity: p.totalQuantity,
            buyPrice: p.totalQuantity > 0 ? p.totalInvested / p.totalQuantity : 0,
            currentPrice: p.totalQuantity > 0 ? p.currentValue / p.totalQuantity : 0,
            marketValue: p.currentValue,
            profitLoss: p.profitLoss,
            purchaseDate: null,
          }))
        )
      })
      .catch((err) => {
        console.error('Failed to load portfolio', err)
        setHoldings([])
      })
      .finally(() => setIsLoading(false))
  }, [selectedUser?.id, reloadKey])

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const assets = await getAssets()
        setAssetOptions(Array.isArray(assets) ? assets : [])
      } catch {
        setAssetOptions([])
      }
    }
    loadAssets()
  }, [])

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

  const handleEditClick = (holding) => {
    setEditingHolding({
      holdingId: holding?.holdingId ?? holding?.id,
      assetId: holding?.assetId,
      quantity: holding?.quantity,
      actionId: holding?.actionId,
      pricePerUnit: holding?.buyPrice ?? holding?.pricePerUnit,
      transactionDate: holding?.purchaseDate ?? holding?.transactionDate,
    })
    setIsAddAssetOpen(true)
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

      <HoldingsTable
        holdings={holdings}
        isLoading={isLoading}
        onDelete={handleDeleteConfirm}
        onEditClick={handleEditClick}
      />

      <DeleteHoldingDialog
        isOpen={Boolean(selectedHolding)}
        onClose={() => setSelectedHolding(null)}
        onConfirm={handleDeleteConfirm}
      />

      <AddAsset
        isOpen={isAddAssetOpen}
        onClose={() => {
          setIsAddAssetOpen(false)
          setEditingHolding(null)
        }}
        initialData={editingHolding}
        assetOptions={assetOptions}
        onSuccesss={() => setReloadKey((v) => v + 1)}
      />
    </div>
  )
}

export default Holdings
