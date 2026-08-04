import { useMemo } from 'react'
import {
CartesianGrid,
Line,
LineChart,
ResponsiveContainer,
Tooltip,
XAxis,
YAxis,
} from 'recharts'

function PortfolioChart({ chartData = [] }) {
const data = useMemo(() => {
return chartData
.map((point) => ({
date: point?.date ?? point?.data ?? '',
value: Number(point?.value) || 0,
}))
.filter((point) => point.date)
}, [chartData])

return (
<section className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
<div className="flex items-center justify-between">
<h3 className="text-lg font-semibold text-slate-900">Portfolio Performance</h3>
</div>

<div className="mt-4 h-64 w-full sm:h-72 lg:h-80">
<ResponsiveContainer width="100%" height="100%">
<LineChart data={data} margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
<CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
<XAxis
dataKey="date"
tick={{ fill: '#64748b', fontSize: 12 }}
tickLine={false}
axisLine={{ stroke: '#cbd5e1' }}
/>
<YAxis
tick={{ fill: '#64748b', fontSize: 12 }}
tickLine={false}
axisLine={{ stroke: '#cbd5e1' }}
tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
/>
<Tooltip
formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Portfolio Value']}
labelFormatter={(label) => `Date: ${label}`}
contentStyle={{
borderRadius: '12px',
border: '1px solid #cbd5e1',
boxShadow: '0 8px 20px -12px rgba(15, 23, 42, 0.35)',
}}
/>
<Line
type="monotone"
dataKey="value"
stroke="#2563eb"
strokeWidth={3}
dot={{ r: 3, fill: '#2563eb', strokeWidth: 0 }}
activeDot={{ r: 5, fill: '#1d4ed8' }}
/>
</LineChart>
</ResponsiveContainer>
</div>
</section>
)
}

export default PortfolioChart