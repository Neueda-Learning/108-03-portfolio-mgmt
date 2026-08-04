import { useEffect, useState } from 'react'

function getTodayDate() {
	return new Date().toISOString().split('T')[0]
}

function AddAsset({
	isOpen,
	isopen,
	onClose,
	onclose,
	onSubmit,
	onsubit,
	assetOptions = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'],
}) {
	const open = isOpen ?? isopen ?? false
	const closeHandler = onClose ?? onclose ?? (() => {})
	const submitHandler = onSubmit ?? onsubit

	const [form, setForm] = useState({
		asset: assetOptions[0] ?? '',
		action: 'buy',
		quantity: '',
		buyPrice: '',
		purchaseDate: getTodayDate(),
	})

	useEffect(() => {
		if (!open) return

		setForm((prev) => ({
			...prev,
			asset: assetOptions[0] ?? prev.asset,
			purchaseDate: prev.purchaseDate || getTodayDate(),
		}))
	}, [open, assetOptions])

	useEffect(() => {
		if (!open) return

		const onEsc = (event) => {
			if (event.key === 'Escape') {
				closeHandler()
			}
		}

		document.addEventListener('keydown', onEsc)
		return () => document.removeEventListener('keydown', onEsc)
	}, [open, closeHandler])

	if (!open) return null

	const updateField = (key, value) => {
		setForm((prev) => ({ ...prev, [key]: value }))
	}

	const handleSubmit = (event) => {
		event.preventDefault()

		const payload = {
			asset: form.asset,
			action: form.action,
			quantity: Number(form.quantity),
			buyPrice: Number(form.buyPrice),
			purchaseDate: form.purchaseDate,
		}

		if (typeof submitHandler === 'function') {
			submitHandler(payload)
		}
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-[2px]">
			<div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
				<div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
					<h3 className="text-lg font-semibold text-slate-900">Add Asset</h3>
					<button
						type="button"
						onClick={closeHandler}
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
								value={form.asset}
								onChange={(e) => updateField('asset', e.target.value)}
								className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
								required
							>
								{assetOptions.map((asset) => (
									<option key={asset} value={asset}>
										{asset}
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
							onClick={closeHandler}
							className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
						>
							Cancel
						</button>
						<button
							type="submit"
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

export default AddAsset