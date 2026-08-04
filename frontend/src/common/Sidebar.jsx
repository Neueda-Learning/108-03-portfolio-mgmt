import { NavLink } from 'react-router-dom'
import {
	FiActivity,
	FiBarChart2,
	FiGrid,
	FiPieChart,
	FiPlusSquare,
	FiRepeat,
	FiSettings,
} from 'react-icons/fi'

const defaultMenuItems = [
	{ to: '/', label: 'Dashboard', icon: FiGrid },
	{ to: '/holdings', label: 'Holdings', icon: FiPieChart },
	{ to: '/performance', label: 'Performance', icon: FiActivity },
	{ to: '/add-asset', label: 'Add Asset', icon: FiPlusSquare },
	{ to: '/transactions', label: 'Transactions', icon: FiRepeat },
	{ to: '/reports', label: 'Reports', icon: FiBarChart2 },
	{ to: '/settings', label: 'Settings', icon: FiSettings },
]

const defaultMarketItems = [
	{ name: 'NIFTY 50', value: '+0.84%' },
	{ name: 'SENSEX', value: '+0.67%' },
	{ name: 'BANK NIFTY', value: '+1.14%' },
]

function Sidebar({ menuItems = defaultMenuItems, marketItems = defaultMarketItems }) {
	return (
		<aside
			className="fixed left-0 top-0 flex h-screen w-[232px] flex-col rounded-r-xl border border-[#edf0f4] border-r-[#e4e7ec] bg-white px-3.5 pb-4 pt-[30px]"
			aria-label="Sidebar Navigation"
		>
			<div className="flex items-center gap-3 border-b border-[#f1f3f6] px-2 pb-3.5">
				<span
					className="inline-grid size-9 place-items-center rounded-full bg-gradient-to-br from-[#8d36ff] to-[#5f1fd4] text-lg text-white"
					aria-hidden="true"
				>
					<FiPieChart />
				</span>
				<div>
					<p className="m-0 text-[15px] font-bold text-slate-900">Portfolio</p>
					<p className="m-0 mt-0.5 text-xs text-slate-500">Manager</p>
				</div>
			</div>

			<nav className="mt-5 flex flex-col gap-2" aria-label="Primary">
				{menuItems.map((item) => (
					<NavLink
						key={item.to}
						to={item.to}
						end={item.to === '/'}
						className={({ isActive }) =>
							[
								'flex items-center gap-2.5 rounded-xl border border-transparent px-3 py-3 text-sm transition-colors',
								isActive
									? 'bg-[#efe7ff] text-[#6e33d4] border-[#dfd1ff] font-semibold'
									: 'bg-transparent text-gray-700 hover:bg-[#f4f0ff] hover:border-[#ebe3ff] hover:text-slate-900 font-medium',
							].join(' ')
						}
					>
						<span className="inline-grid size-[18px] place-items-center" aria-hidden="true">
							<item.icon />
						</span>
						<span className="leading-none">{item.label}</span>
					</NavLink>
				))}
			</nav>

			<section
				className="mt-auto rounded-xl border border-[#eceff4] bg-white p-4 shadow-[0_8px_16px_-14px_rgba(15,23,42,0.35)]"
				aria-label="Market Status"
			>
				<p className="m-0 text-[13px] font-bold text-slate-900">Market Status</p>
				<div className="mt-2.5 flex flex-col gap-2.5">
					{marketItems.map((item) => (
						<div key={item.name} className="flex items-center justify-between text-[13px] text-slate-600">
							<span>{item.name}</span>
							<strong
								className={
									item.value.startsWith('-') ? 'font-bold text-red-500' : 'font-bold text-green-600'
								}
							>
								{item.value}
							</strong>
						</div>
					))}
				</div>
			</section>
		</aside>
	)
}

export default Sidebar
