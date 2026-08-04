import { FiTrendingDown, FiTrendingUp } from 'react-icons/fi'

function SummaryCard({
title,
value,
icon,
change,
isPositive,
iconBgColor = 'bg-slate-100',
}) {
const Icon = icon
const trendColor = isPositive ? 'text-emerald-600' : 'text-rose-600'
const trendBg = isPositive ? 'bg-emerald-50' : 'bg-rose-50'
const TrendIcon = isPositive ? FiTrendingUp : FiTrendingDown

return (
<article className="group relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:p-5">
<div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 opacity-80" />

<div className="flex items-start justify-between gap-3">
<div>
<p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{title}</p>
<p className="mt-2 text-2xl font-bold leading-none text-slate-900 sm:text-3xl">{value}</p>
</div>

<div
className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${iconBgColor} text-xl text-slate-800 shadow-sm sm:h-14 sm:w-14`}
>
{Icon ? <Icon /> : null}
</div>
</div>

<div className="mt-4 inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-semibold sm:mt-5">
<span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 ${trendBg} ${trendColor}`}>
<TrendIcon className="text-base" />
{change}
</span>
<span className="text-xs font-medium text-slate-500">vs last period</span>
</div>
</article>
)
}

export default SummaryCard