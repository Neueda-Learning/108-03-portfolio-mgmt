const badgeClassByCluster = {
    BALANCED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    MODERATE: 'bg-amber-50 text-amber-700 border-amber-200',
    VOLATILE: 'bg-rose-50 text-rose-700 border-rose-200',
    UNKNOWN: 'bg-slate-100 text-slate-700 border-slate-300',
}

const normalizeCluster = (cluster) => String(cluster ?? 'UNKNOWN').trim().toUpperCase()

const formatPercent = (decimalValue) => `${(Number(decimalValue ?? 0) * 100).toFixed(2)}%`

const recommendationText = (cluster, annualReturn) => {
    const c = normalizeCluster(cluster)
    const r = Number(annualReturn ?? 0)

    if (c === 'UNKNOWN') return 'Insufficient data'
    if (r < 0) return 'Review'
    if (c === 'BALANCED' && r >= 0) return 'Hold'
    if (c === 'MODERATE' && r >= 0) return 'Hold'
    if (c === 'VOLATILE') return 'Review'
    return 'Review'
}

function PortfolioRecommendation({ rows = [], isLoading = false }) {
    return (
        <section className="w-full h-full xl:h-[420px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 flex flex-col">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Portfolio Recommendation</h3>
            </div>

            <div className="mt-3 min-h-0 flex-1 overflow-x-auto">
                <div className="h-full overflow-y-auto rounded-xl border border-slate-100">
                    <table className="min-w-[760px] w-full border-separate border-spacing-0">
                        <thead className="sticky top-0 bg-white">
                            <tr>
                                <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Asset (Ticker)</th>
                                <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Risk Cluster</th>
                                <th className="border-b border-slate-200 px-3 py-2 text-right text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Volatility (%)</th>
                                <th className="border-b border-slate-200 px-3 py-2 text-right text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Annual Return (%)</th>
                                <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Recommendation</th>
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-3 py-8 text-center text-sm text-slate-500">
                                        Loading recommendations...
                                    </td>
                                </tr>
                            ) : rows.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-3 py-8 text-center text-sm text-slate-500">
                                        No recommendation data available.
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row, index) => {
                                    const cluster = normalizeCluster(row.cluster)
                                    const badgeClass = badgeClassByCluster[cluster] || badgeClassByCluster.UNKNOWN

                                    return (
                                        <tr key={`${row.ticker}-${index}`} className="transition-colors duration-150 hover:bg-slate-50">
                                            <td className="border-b border-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-900">
                                                {row.ticker}
                                            </td>
                                            <td className="border-b border-slate-100 px-3 py-2.5 text-sm">
                                                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeClass}`}>
                                                    {cluster.charAt(0) + cluster.slice(1).toLowerCase()}
                                                </span>
                                            </td>
                                            <td className="border-b border-slate-100 px-3 py-2.5 text-right text-sm text-slate-700">
                                                {formatPercent(row.volatility)}
                                            </td>
                                            <td className="border-b border-slate-100 px-3 py-2.5 text-right text-sm text-slate-700">
                                                {formatPercent(row.annual_return)}
                                            </td>
                                            <td className="border-b border-slate-100 px-3 py-2.5 text-sm text-slate-700">
                                                {recommendationText(row.cluster, row.annual_return)}
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}

export default PortfolioRecommendation