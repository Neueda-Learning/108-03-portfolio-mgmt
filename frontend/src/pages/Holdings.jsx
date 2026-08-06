import { useContext, useEffect, useMemo, useState } from 'react'
import UserContext from '../context/UserContext'
import HoldingsTable from '../holdings/HoldingsTable'
import { getHoldingsByUser, deleteHolding } from '../services/holdingService'
import { getAssets, getAssetById } from '../services/assetService'
import EditHoldingModal from '../holdings/EditHoldingModal'

const ASSET_TYPE_BY_ID = {
    1: 'STOCK',
    2: 'BOND',
    3: 'GOLD',
    4: 'BOND',
    5: 'CASH',
}

function Holdings() {
  const { selectedUser } = useContext(UserContext)
  const [holdings, setHoldings] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [assetOptions, setAssetOptions] = useState([])
  const [reloadKey, setReloadKey] = useState(0)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingHolding, setEditingHolding] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [assetType, setAssetType] = useState('All')

  const activeUserId = Number(selectedUser?.userId ?? selectedUser?.id ?? 0)

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

  useEffect(() => {
    const loadHoldings = async () => {
      if (!activeUserId) {
        setHoldings([])
        return
      }

      try {
        setIsLoading(true)
        const rows = await getHoldingsByUser(activeUserId)

        const uniqueAssetIds = Array.from(
          new Set(rows.map((h) => Number(h?.assetId)).filter((id) => Number.isFinite(id) && id > 0)),
        )

        const metaEntries = await Promise.allSettled(
          uniqueAssetIds.map(async (assetId) => {
            const meta = await getAssetById(assetId)
            return [assetId, meta]
          }),
        )

        const assetMetaMap = new Map(
          metaEntries
            .filter((r) => r.status === 'fulfilled')
            .map((r) => r.value),
        )

        const normalized = rows.map((h) => {
          const assetId = Number(h?.assetId ?? 0)
          const meta = assetMetaMap.get(assetId)
          const typeId = Number(meta?.typeId ?? h?.typeId ?? 0)

          return {
            ...h,
            holdingId: h.holdingId ?? h.id,
            assetId,
            asset: meta?.name ?? h?.asset ?? h?.assetName ?? h?.ticker ?? '-',
            type: ASSET_TYPE_BY_ID[typeId] ?? h?.type ?? 'Unknown',
            buyPrice: h.buyPrice ?? h.pricePerUnit ?? 0,
            currentPrice: h.currentPrice ?? h.ltp ?? 0,
            marketValue:
              h.marketValue ??
              Number(h.quantity ?? 0) * Number(h.currentPrice ?? h.ltp ?? 0),
            profitLoss: h.profitLoss ?? 0,
            transactionDate: h.transactionDate ?? h.purchaseDate ?? '',
          }
        })

        setHoldings(normalized)
      } catch (error) {
        console.error('Failed to load holdings:', error)
        setHoldings([])
      } finally {
        setIsLoading(false)
      }
    }

    loadHoldings()
  }, [activeUserId, reloadKey])

  const assetTypeOptions = useMemo(() => {
    const uniqueTypes = Array.from(new Set(holdings.map((h) => h?.type).filter(Boolean)))
    return ['All', ...uniqueTypes]
  }, [holdings])

  const filteredHoldings = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    return holdings.filter((h) => {
      const matchesSearch =
        !q ||
        String(h?.asset ?? '').toLowerCase().includes(q) ||
        String(h?.type ?? '').toLowerCase().includes(q)

      const matchesType = assetType === 'All' || String(h?.type ?? '') === assetType
      return matchesSearch && matchesType
    })
  }, [holdings, searchTerm, assetType])

  const handleEditClick = (row) => {
    setEditingHolding(row)
    setIsEditOpen(true)
  }

  const handleDeleteHolding = async (row) => {
    const holdingId = Number(row?.holdingId ?? row?.id ?? 0)
    if (!holdingId) return

    const ok = window.confirm('Delete this holding?')
    if (!ok) return

    try {
      await deleteHolding(holdingId)
      window.alert('Holding deleted successfully.')
      setReloadKey((v) => v + 1)
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || 'Failed to delete holding.'
      window.alert(msg)
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-2xl font-bold text-slate-900">Holdings</h2>
        <p className="mt-1 text-sm text-slate-600">Manage your portfolio assets</p>

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
        holdings={filteredHoldings}
        isLoading={isLoading}
        onEditClick={handleEditClick}
        onDelete={handleDeleteHolding}
      />

      <EditHoldingModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false)
          setEditingHolding(null)
        }}
        initialData={editingHolding}
        assetOptions={assetOptions}
        onSuccess={() => setReloadKey((v) => v + 1)}
      />
    </div>
  )
}

export default Holdings
