import { useContext, useEffect, useState } from 'react'
import UserContext from '../context/UserContext'
import { updateHolding } from '../services/holdingService.js'

function getTodayDate() {
    return new Date().toISOString().split('T')[0]
}

function EditHoldingModal({ isOpen, onClose, onSuccess, assetOptions = [], initialData = null }) {
    const { selectedUser } = useContext(UserContext)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [form, setForm] = useState({
        assetId: '',
        quantity: '',
        buyPrice: '',
        action: 'buy',
        purchaseDate: getTodayDate(),
    })

    const editHoldingId = Number(initialData?.holdingId ?? initialData?.id ?? 0)
    const isEditMode = editHoldingId > 0

    useEffect(() => {
        if (!isOpen) return
        setForm({
            assetId: String(initialData?.assetId ?? ''),
            quantity: String(initialData?.quantity ?? ''),
            buyPrice: String(initialData?.pricePerUnit ?? initialData?.buyPrice ?? ''),
            action:
                Number(initialData?.actionId) === 2 ||
                String(initialData?.action || '').toLowerCase() === 'sell'
                    ? 'sell'
                    : 'buy',
            purchaseDate: String(initialData?.transactionDate ?? initialData?.purchaseDate ?? getTodayDate()).slice(0, 10),
        })
    }, [isOpen, initialData])

    if (!isOpen) return null

    const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!isEditMode) return

        const userId = Number(selectedUser?.id ?? selectedUser?.userId ?? 0)
        const enteredQty = Number(form.quantity)
        const enteredPrice = Number(form.buyPrice)

        if (
            !userId ||
            !Number(form.assetId) ||
            Number.isNaN(enteredQty) ||
            enteredQty < 0 ||
            Number.isNaN(enteredPrice) ||
            enteredPrice < 0 ||
            !form.purchaseDate
        ) {
            window.alert('Please fill all required fields.')
            return
        }

        const payload = {
            holdingId: editHoldingId,
            assetId: Number(form.assetId),
            quantity: enteredQty, // send absolute edited quantity
            userId,
            actionId: form.action === 'sell' ? 2 : 1, // use selected action
            pricePerUnit: enteredPrice,
            transactionDate: form.purchaseDate,
        }

        try {
            setIsSubmitting(true)
            await updateHolding(editHoldingId, payload)
            window.alert('Holding updated successfully.')
            onClose?.()
            onSuccess?.()
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || 'Request failed.'
            window.alert(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-[2px]">
            <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
                    <h3 className="text-lg font-semibold text-slate-900">Edit Holding</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md px-2 py-1 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    >
                        Close
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-5 py-5 sm:px-6 sm:py-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-medium text-slate-700">Asset</span>
                            <select
                                value={form.assetId}
                                onChange={(e) => updateField('assetId', e.target.value)}
                                className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                required
                            >
                                <option value="" disabled>Select asset</option>
                                {assetOptions.map((asset) => (
                                    <option key={asset.assetId} value={asset.assetId}>{asset.name}</option>
                                ))}
                            </select>
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-medium text-slate-700">Action</span>
                            <select
                                value={form.action}
                                onChange={(e) => updateField('action', e.target.value)}
                                className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                required
                            >
                                <option value="buy">Buy</option>
                                <option value="sell">Sell</option>
                            </select>
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-medium text-slate-700">Quantity</span>
                            <input
                                type="number"
                                min="0"
                                step="any"
                                value={form.quantity}
                                onChange={(e) => updateField('quantity', e.target.value)}
                                className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                required
                            />
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-medium text-slate-700">Buy Price</span>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.buyPrice}
                                onChange={(e) => updateField('buyPrice', e.target.value)}
                                className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                required
                            />
                        </label>

                        <label className="flex flex-col gap-1.5 sm:col-span-2">
                            <span className="text-sm font-medium text-slate-700">Purchase Date</span>
                            <input
                                type="date"
                                value={form.purchaseDate}
                                onChange={(e) => updateField('purchaseDate', e.target.value)}
                                className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                required
                            />
                        </label>
                    </div>

                    <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditHoldingModal