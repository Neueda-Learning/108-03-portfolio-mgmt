import { useMemo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const DEFAULT_COLORS = ['#2563EB', '#0EA5E9', '#14B8A6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6']

function AssetAllocationChart({ data = [] }) {
const chartData = useMemo(() => {
return data
.map((item) => ({
name: item?.name,
value: Number(item?.value) || 0,
}))
.filter((item) => item.name && item.value > 0)
}, [data])

const totalValue = useMemo(() => {
return chartData.reduce((acc, item) => acc + item.value, 0)
}, [chartData])

return (
<section className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
<h3 className="text-lg font-semibold text-slate-900">Asset Allocation</h3>

<div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(260px,1fr)_1fr] lg:items-center">
<div className="h-64 w-full sm:h-72">
<ResponsiveContainer width="100%" height="100%">
<PieChart>
<Pie
data={chartData}
dataKey="value"
nameKey="name"
innerRadius="58%"
outerRadius="82%"
paddingAngle={2}
>
{chartData.map((entry, index) => (
<Cell key={`${entry.name}-${index}`} fill={DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
))}
</Pie>
<Tooltip
formatter={(value) => [value, 'Value']}
contentStyle={{ borderRadius: '12px', borderColor: '#cbd5e1' }}
/>
</PieChart>
</ResponsiveContainer>
</div>

<div className="space-y-2.5">
{chartData.length === 0 ? (
<p className="text-sm text-slate-500">No allocation data available.</p>
) : (
chartData.map((item, index) => {
const percentage = totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : '0.0'

return (
<div
key={item.name}
className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5"
>
<div className="flex items-center gap-2.5">
<span
className="h-3 w-3 rounded-full"
style={{ backgroundColor: DEFAULT_COLORS[index % DEFAULT_COLORS.length] }}
/>
<span className="text-sm font-medium text-slate-700">{item.name}</span>
</div>
<span className="text-sm font-semibold text-slate-900">{percentage}%</span>
</div>
)
})
)}
</div>
</div>
</section>
)
}

export default AssetAllocationChart