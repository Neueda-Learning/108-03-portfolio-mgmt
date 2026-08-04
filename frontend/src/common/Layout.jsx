import { Outlet, useLocation } from 'react-router-dom'
import { useMemo, useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const demoUsers = [
	{ id: 'u1', name: 'User 1' },
	{ id: 'u2', name: 'User 2' },
	{ id: 'u3', name: 'User 3' },
	{ id: 'u4', name: 'User 4' },
]

const titleByPath = {
	'/': 'Dashboard',
	'/holdings': 'Holdings',
	'/performance': 'Performance',
	'/add-asset': 'Add Asset',
	'/transactions': 'Transactions',
	'/reports': 'Reports',
	'/settings': 'Settings',
}

function Layout() {
	const [activeUserId, setActiveUserId] = useState('all')
	const location = useLocation()

	const pageTitle = useMemo(() => titleByPath[location.pathname] || 'Dashboard', [location.pathname])

	return (
		<div className="min-h-screen bg-slate-50">
			<Sidebar />

			<div className="ml-64 min-h-screen max-[980px]:ml-0">
				<Navbar
					pageTitle={pageTitle}
					users={demoUsers}
					activeUserId={activeUserId}
					onUserChange={setActiveUserId}
				/>

				<main className="p-5">
					<Outlet />
				</main>
			</div>
		</div>
	)
}

export default Layout
