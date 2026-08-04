function DeleteHoldingDialog({ isOpen, isopen, onClose, onclose, onConfirm }) {
	const open = isOpen ?? isopen ?? false
	const closeHandler = onClose ?? onclose ?? (() => {})

	if (!open) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-[2px]">
			<div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
				<h3 className="text-lg font-semibold text-slate-900">Delete Holding</h3>
				<p className="mt-2 text-sm text-slate-600">ARe you sure want to delete this holding?</p>

				<div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
					<button
						type="button"
						onClick={closeHandler}
						className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={onConfirm}
						className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-300"
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	)
}

export default DeleteHoldingDialog
