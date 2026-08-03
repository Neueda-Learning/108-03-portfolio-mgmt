import './Sidebar.css'
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

const defaultMarket = [
	{ name: 'NIFTY 50', value: '+0.84%' },
	{ name: 'SENSEX', value: '+0.67%' },
	{ name: 'BANK NIFTY', value: '+1.14%' },
]

function Sidebar({ menuItems = defaultMenuItems, marketItems = defaultMarket }) {
	return (
		<aside className="pm-sidebar" aria-label="Sidebar Navigation">
			<div className="pm-sidebar__brand">
				<span className="pm-sidebar__brand-mark" aria-hidden="true">
					<FiPieChart />
				</span>
				<div>
					<p className="pm-sidebar__brand-title">Portfolio</p>
					<p className="pm-sidebar__brand-subtitle">Manager</p>
				</div>
			</div>

			<nav className="pm-sidebar__nav" aria-label="Primary">
				{menuItems.map((item) => (
					<NavLink
						key={item.to}
						to={item.to}
						end={item.to === '/'}
						className={({ isActive }) =>
							`pm-sidebar__item${isActive ? ' is-active' : ''}`
						}
					>
						<span className="pm-sidebar__item-icon" aria-hidden="true">
							<item.icon />
						</span>
						<span className="pm-sidebar__item-label">{item.label}</span>
					</NavLink>
				))}
			</nav>

			<section className="pm-sidebar__market" aria-label="Market Status">
				<p className="pm-sidebar__market-title">Market Status</p>
				<div className="pm-sidebar__market-list">
					{marketItems.map((item) => (
						<div key={item.name} className="pm-sidebar__market-item">
							<span>{item.name}</span>
							<strong className="is-positive">{item.value}</strong>
						</div>
					))}
				</div>
			</section>
		</aside>
	)
}

export default Sidebar
