function HoldingRow({ holding, onDelete, onEdit }) {
    const formatCurrency = (value) => {
        const numeric = Number(value)
        if (Number.isNaN(numeric)) return value ?? '-'
        return `₹${numeric.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
    }

    const formatNumber = (value) => {
        const numeric = Number(value)
        if (Number.isNaN(numeric)) return value ?? '-'
        return numeric.toLocaleString()
    }

    const profitLoss = Number(holding?.profitLoss)
    const profitLossClass = Number.isNaN(profitLoss)
        ? 'text-slate-700'
        : profitLoss >= 0
            ? 'text-emerald-600'
            : 'text-rose-600'

    return (
        <tr className="transition-colors duration-150 hover:bg-slate-50">
            <td className="border-b border-slate-100 px-3 py-3.5 text-sm font-semibold text-slate-900">
                {holding?.asset ?? '-'}
            </td>
            <td className="border-b border-slate-100 px-3 py-3.5 text-sm text-slate-700">{holding?.type ?? '-'}</td>
            <td className="border-b border-slate-100 px-3 py-3.5 text-right text-sm text-slate-700">{formatNumber(holding?.quantity)}</td>
            <td className="border-b border-slate-100 px-3 py-3.5 text-right text-sm text-slate-700">{formatCurrency(holding?.buyPrice)}</td>
            <td className="border-b border-slate-100 px-3 py-3.5 text-right text-sm text-slate-700">{formatCurrency(holding?.currentPrice)}</td>
            <td className="border-b border-slate-100 px-3 py-3.5 text-right text-sm font-semibold text-slate-900">{formatCurrency(holding?.marketValue)}</td>
            <td className={`border-b border-slate-100 px-3 py-3.5 text-right text-sm font-semibold ${profitLossClass}`}>
                {formatCurrency(holding?.profitLoss)}
            </td>
            <td className="border-b border-slate-100 px-3 py-3.5 text-right">
                <button
                    type="button"
                    onClick={() => onEdit?.(holding)}
                    className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50"
                >
                    Edit
                </button>
            </td>
            <td className="border-b border-slate-100 px-3 py-3.5 text-right">
                <button
                    type="button"
                    onClick={() => onDelete?.(holding)}
                    className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                >
                    Delete
                </button>
            </td>
        </tr>
    )
}

export default HoldingRow
