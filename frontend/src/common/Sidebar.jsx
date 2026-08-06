import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
    FiActivity,
    FiGrid,
    FiPieChart,
    FiSettings,
} from 'react-icons/fi'

const defaultMenuItems = [
    { to: '/', label: 'Dashboard', icon: FiGrid },
    { to: '/holdings', label: 'Holdings', icon: FiPieChart },
    { to: '/performance', label: 'Performance', icon: FiActivity },
    { to: '/settings', label: 'Settings', icon: FiSettings },
]

const defaultMarketItems = [
    { name: 'NIFTY 50', percentage: 0.84 },
    { name: 'SENSEX', percentage: 0.67 },
    { name: 'BANK NIFTY', percentage: 1.14 },
]

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const randomDelta = () => Math.random() * 0.3 - 0.15 // -0.15 to +0.15

function Sidebar({ menuItems = defaultMenuItems, marketItems }) {
    const [liveMarketItems, setLiveMarketItems] = useState(defaultMarketItems)

    useEffect(() => {
        // if external marketItems is provided, do not simulate
        if (Array.isArray(marketItems) && marketItems.length > 0) return

        const timer = setInterval(() => {
            setLiveMarketItems((prev) =>
                prev.map((item) => ({
                    ...item,
                    percentage: Number(clamp(item.percentage + randomDelta(), -2, 2).toFixed(2)),
                })),
            )
        }, 5000)

        return () => clearInterval(timer)
    }, [marketItems])

    const displayedMarketItems =
        Array.isArray(marketItems) && marketItems.length > 0
            ? marketItems.map((item) => {
                    const raw = String(item?.value ?? '0').replace('%', '')
                    const parsed = Number(raw)
                    return {
                        name: item?.name ?? '-',
                        percentage: Number.isNaN(parsed) ? 0 : parsed,
                    }
              })
            : liveMarketItems

    return (
        <aside
            className="fixed left-0 top-0 flex h-screen w-[232px] flex-col rounded-r-xl border border-[#edf0f4] border-r-[#e4e7ec] bg-white px-3.5 pb-4 pt-[30px] dark:border-slate-700 dark:border-r-slate-700 dark:bg-slate-900"
            aria-label="Sidebar Navigation"
        >
            <div className="flex items-center gap-3 border-b border-[#f1f3f6] px-2 pb-3.5 dark:border-slate-700">
                <span
                    className="inline-grid size-9 place-items-center rounded-full bg-gradient-to-br from-[#8d36ff] to-[#5f1fd4] text-lg text-white"
                    aria-hidden="true"
                >
                    <FiPieChart />
                </span>
                <div>
                    <p className="m-0 text-[15px] font-bold text-slate-900 dark:text-slate-100">Portfolio</p>
                    <p className="m-0 mt-0.5 text-xs text-slate-500 dark:text-slate-400">Manager</p>
                </div>
            </div>

            <nav className="mt-5 flex flex-col gap-2" aria-label="Primary">
                <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                    Menu
                </p>

                {menuItems.map((item) => (
                    <NavLink key={item.to} to={item.to} end={item.to === '/'}>
                        {({ isActive }) => (
                            <span
                                className={[
                                    'group relative flex items-center gap-2.5 rounded-xl border px-3 py-3 text-sm transition-all duration-200',
                                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300',
                                    isActive
                                        ? 'border-[#dfd1ff] bg-[#efe7ff] font-semibold text-[#6e33d4] shadow-sm'
                                        : 'border-transparent bg-transparent font-medium text-gray-700 hover:border-[#ebe3ff] hover:bg-[#f4f0ff] hover:text-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100',
                                ].join(' ')}>
                                <span
                                    className={[
                                        'absolute left-1.5 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full transition-opacity',
                                        isActive ? 'bg-violet-500 opacity-100' : 'opacity-0 group-hover:opacity-40',
                                    ].join(' ')}>
                                    <span aria-hidden="true" />
                                </span>
                                <span className="inline-grid size-[18px] place-items-center" aria-hidden="true">
                                    <item.icon />
                                </span>
                                <span className="leading-none">{item.label}</span>
                            </span>
                        )}
                    </NavLink>
                ))}
            </nav>

            <section
                className="mt-auto rounded-xl border border-[#eceff4] bg-white p-4 shadow-[0_8px_16px_-14px_rgba(15,23,42,0.35)] dark:border-slate-700 dark:bg-slate-900"
                aria-label="Market Status"
            >
                <p className="m-0 text-[13px] font-bold text-slate-900 dark:text-slate-100">Market Status</p>
                <div className="mt-2.5 flex flex-col gap-2.5">
                    {displayedMarketItems.map((item) => {
                        const isNegative = item.percentage < 0
                        const value = `${isNegative ? '' : '+'}${item.percentage.toFixed(2)}%`

                        return (
                            <div key={item.name} className="flex items-center justify-between text-[13px] text-slate-600 dark:text-slate-300">
                                <span>{item.name}</span>
                                <strong className={isNegative ? 'font-bold text-red-500' : 'font-bold text-green-600'}>
                                    {value}
                                </strong>
                            </div>
                        )
                    })}
                </div>
            </section>
        </aside>
    )
}

export default Sidebar
