import { useMemo, useState } from 'react'
import './Navbar.css'

function Navbar({
	pageTitle,
	users,
	activeUserId,
	onUserChange,
}) {
	const [showProfileMenu, setShowProfileMenu] = useState(false)

	const activeLabel = useMemo(() => {
		if (activeUserId === 'all') {
			return 'All Users (Aggregated)'
		}

		const active = users.find((user) => user.id === activeUserId)
		return active ? active.name : 'Select user'
	}, [activeUserId, users])

	return (
		<header className="pm-navbar">
			<div className="pm-navbar__left">
				<p className="pm-navbar__eyebrow">WealthMate</p>
				<h1 className="pm-navbar__title">{pageTitle}</h1>
			</div>

			<div className="pm-navbar__center">
				<label htmlFor="userScope" className="pm-navbar__label">
					Active User
				</label>
				<select
					id="userScope"
					className="pm-navbar__select"
					value={activeUserId}
					onChange={(event) => onUserChange(event.target.value)}
				>
					<option value="all">All Users (Aggregated)</option>
					{users.map((user) => (
						<option key={user.id} value={user.id}>
							{user.name}
						</option>
					))}
				</select>
			</div>

			<div className="pm-navbar__right">
				<div className="pm-profile">
					<button
						type="button"
						className="pm-profile__trigger"
						onClick={() => setShowProfileMenu((open) => !open)}
						aria-expanded={showProfileMenu}
						aria-haspopup="menu"
					>
						<span className="pm-avatar" aria-hidden="true">
							DU
						</span>
						<span className="pm-profile__text">
							<strong>Demo User</strong>
							<small>{activeLabel}</small>
						</span>
						<span className="pm-profile__chevron" aria-hidden="true">
							▾
						</span>
					</button>

					{showProfileMenu && (
						<div className="pm-profile__menu" role="menu" aria-label="Profile menu">
							<button type="button">My Profile</button>
							<button type="button">Settings</button>
							<button type="button">Help</button>
						</div>
					)}
				</div>
			</div>
		</header>
	)
}

export default Navbar
