import { useContext, useEffect, useState } from 'react'
import UserContext from '../context/UserContext'
import { createHolding } from '../services/holdingService.js'

function getTodayDate() {
	return new Date().toISOString().split('T')[0]
}

function AddAsset({
	isOpen,
	onClose,
	onSubmit, // kept for compatibility
	onSuccess,
	onSuccesss, // as requested
	assetOptions = [],
}) {
	const { selectedUser } = useContext(UserContext)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const [form, setForm] = useState({
		assetId: '',
		quantity: '',
		buyPrice: '',
		action: 'buy',
		purchaseDate: getTodayDate(),
	})

	useEffect(() => {
		if (!isOpen) return

		setForm((prev) => ({
			...prev,
			assetId: assetOptions[0]?.assetId ?? prev.assetId,
			purchaseDate: prev.purchaseDate || getTodayDate(),
		}))
	}, [isOpen, assetOptions])

	useEffect(() => {
		if (!isOpen) return

		const onEsc = (event) => {
			if (event.key === 'Escape') {
				onClose?.()
			}
		}

		document.addEventListener('keydown', onEsc)
		return () => document.removeEventListener('keydown', onEsc)
	}, [isOpen, onClose])

	if (!isOpen) return null

	const updateField = (key, value) => {
		setForm((prev) => ({ ...prev, [key]: value }))
	}

	const handleSubmit = async (event) => {
		event.preventDefault()

		const userId = selectedUser?.id ?? selectedUser?.userId
		const assetId = Number(form.assetId)
		const quantity = Number(form.quantity)
		const pricePerUnit = Number(form.buyPrice)
		const actionId = form.action === 'buy' ? 1 : 2
		const transactionDate = form.purchaseDate

		if (!userId || !assetId || !quantity || !pricePerUnit || !transactionDate) {
			window.alert('Please fill all required fields.')
			return
		}

		if (quantity <= 0 || pricePerUnit <= 0) {
			window.alert('Quantity and price must be greater than 0.')
			return
		}

		const payload = {
			holdingId: 0,
			assetId,
			quantity,
			userId: Number(userId),
			actionId, // BUY=1, SELL=2
			pricePerUnit,
			transactionDate,
		}

		try {
			setIsSubmitting(true)
			await createHolding(payload)

			// optional compatibility callback
			if (onSubmit) await onSubmit(payload)

			window.alert('Asset added successfully.')
			onClose?.()
			onSuccesss?.()
			onSuccess?.()
		} catch (error) {
			const message =
				error?.response?.data?.message ||
				error?.message ||
				'Failed to add asset.'
			window.alert(message)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-[2px]">
			<div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
				<div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
					<h3 className="text-lg font-semibold text-slate-900">Add Asset</h3>
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
								onChange={(e) => setForm((prev) => ({ ...prev, assetId: e.target.value }))}
								className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
								required
							>
								<option value="" disabled>
									Select asset
								</option>
								{assetOptions.map((asset) => (
									<option key={asset.assetId} value={asset.assetId}>
										{asset.name}
									</option>
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
								placeholder="Enter quantity"
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
								placeholder="Enter price"
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
							className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
							disabled={isSubmitting}
						>
							Save
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default AddAsset
