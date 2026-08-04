import { Outlet, useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const titleByPath = {
	'/': 'Dashboard',
	'/holdings': 'Holdings',
	'/performance': 'Performance',
	'/settings': 'Settings',
}

function Layout() {
	const location = useLocation()

	const pageTitle = useMemo(() => titleByPath[location.pathname] || 'Dashboard', [location.pathname])

  return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950">
			<Sidebar />

			<div className="ml-64 min-h-screen max-[980px]:ml-0">
				<Navbar pageTitle={pageTitle} />

				<main className="p-5">
					<Outlet />
				</main>
			</div>
     </div>
  )
}

export default Layout
