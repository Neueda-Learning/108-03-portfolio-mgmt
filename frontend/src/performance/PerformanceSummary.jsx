function formatCurrency(value) {
	return new Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: 'INR',
		maximumFractionDigits: 0,
	}).format(value)
}

function PerformanceSummary({ invested, currentValue, profitLoss, profitLossPct, isUpdating = false }) {
	if (isUpdating) {
		return (
			<section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{[0, 1, 2, 3].map((item) => (
					<div
						key={item}
						className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
					>
						<div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
						<div className="mt-4 h-7 w-28 rounded bg-slate-200 dark:bg-slate-700" />
					</div>
				))}
			</section>
		)
	}

	const isProfit = profitLoss >= 0

	return (
		<section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
			<article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
				<p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">Invested</p>
				<p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(invested)}</p>
			</article>

			<article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
				<p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">Current Value</p>
				<p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(currentValue)}</p>
			</article>

			<article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
				<p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">Profit / Loss</p>
				<p className={`mt-2 text-2xl font-bold ${isProfit ? 'text-emerald-600' : 'text-rose-600'}`}>
					{formatCurrency(profitLoss)}
				</p>
			</article>

			<article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
				<p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">Profit/Loss %</p>
				<p className={`mt-2 text-2xl font-bold ${isProfit ? 'text-emerald-600' : 'text-rose-600'}`}>
					{profitLossPct.toFixed(2)}%
				</p>
			</article>
		</section>
	)
}

export default PerformanceSummary
