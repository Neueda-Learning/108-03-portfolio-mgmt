import { useContext, useEffect, useMemo, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import UserContext from '../context/UserContext.jsx'

function Navbar({ pageTitle = 'Dashboard' }) {
	const [showProfileMenu, setShowProfileMenu] = useState(false)
	const { users, selectedUser, setSelectedUser } = useContext(UserContext)
	const [activeUserId, setActiveUserId] = useState(
		selectedUser?.id != null ? String(selectedUser.id) : users[0]?.id != null ? String(users[0].id) : '',
	)

	useEffect(() => {
		if (selectedUser?.id != null) {
			setActiveUserId(String(selectedUser.id))
		}
	}, [selectedUser])

	const profileName = useMemo(() => {
		const selected = users.find((user) => String(user.id) === activeUserId)
		return selected?.name || selectedUser?.name || 'User'
	}, [activeUserId, selectedUser, users])

	const profileInitials = useMemo(() => {
		return profileName
			.split(' ')
			.map((part) => part[0])
			.join('')
			.slice(0, 2)
			.toUpperCase()
	}, [profileName])

	return (
		<header className="grid min-h-[92px] grid-cols-[1.2fr_1fr_auto] items-center gap-5 border-b border-[#dce6f2] bg-gradient-to-r from-[#f8fcff] via-[#eef5ff] to-[#f7fbff] px-6 py-[18px] shadow-[0_8px_18px_-14px_rgba(15,23,42,0.3)] max-[900px]:grid-cols-1 max-[900px]:gap-3 max-[900px]:p-4">
			<div>
				<p className="m-0 text-[11px] font-bold uppercase tracking-[0.14em] text-[#3b5f82]">WealthMate</p>
				<h1 className="m-0 mt-1 text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-slate-900 max-[900px]:text-2xl">
					{pageTitle}
				</h1>
			</div>

			<div className="flex flex-col gap-[7px]">
				<label htmlFor="userScope" className="text-xs font-semibold text-[#3c4f65]">
					Active User
				</label>
				<select
					id="userScope"
					className="rounded-[14px] border border-[#c8d6e7] bg-white px-3.5 py-2.5 text-sm font-semibold leading-tight text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-[border-color,box-shadow,transform] duration-200 hover:border-[#9ab4d1] focus:border-[#2f5f93] focus:outline-none focus:ring-4 focus:ring-[#2f5f93]/20"
					value={activeUserId}
					onChange={(event) => {
						setActiveUserId(event.target.value)
						const selected = users.find((user) => String(user.id) === event.target.value)
						if (selected && setSelectedUser) {
							setSelectedUser(selected)
						}
					}}
				>
					{users.map((user) => (
						<option key={user.id} value={String(user.id)}>
							{user.name}
						</option>
					))}
				</select>
			</div>

			<div className="flex items-center justify-end max-[900px]:justify-start">
				<div className="relative">
					<button
						type="button"
						className="inline-flex cursor-pointer items-center gap-3 rounded-[15px] border border-[#cedaea] bg-white px-3 py-2 shadow-[0_4px_10px_-8px_rgba(15,23,42,0.35)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-px hover:border-[#9bb3cd] hover:shadow-[0_10px_20px_-14px_rgba(15,23,42,0.55)] focus:border-[#2f5f93] focus:outline-none focus:ring-4 focus:ring-[#2f5f93]/15"
						onClick={() => setShowProfileMenu((open) => !open)}
						aria-expanded={showProfileMenu}
						aria-haspopup="menu"
					>
						<span
							className="inline-grid h-[42px] w-[42px] place-items-center rounded-full bg-gradient-to-br from-[#2a63d8] to-[#1749ad] text-[13px] font-bold tracking-[0.03em] text-white"
							aria-hidden="true"
						>
							{profileInitials}
						</span>
						<strong className="text-sm font-bold text-slate-900">{profileName}</strong>
						<FiChevronDown
							className={`text-[13px] text-[#5b6f87] transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`}
							aria-hidden="true"
						/>
					</button>

					{showProfileMenu && (
						<div
							className="absolute right-0 top-[calc(100%+10px)] z-30 grid w-48 gap-1.5 rounded-[14px] border border-[#d3dfed] bg-white p-2 shadow-[0_18px_30px_-20px_rgba(15,23,42,0.55)] max-[900px]:left-0 max-[900px]:right-auto"
							role="menu"
							aria-label="Profile menu"
						>
							<button
								type="button"
								className="cursor-pointer rounded-[10px] border-none bg-transparent px-[11px] py-[9px] text-left text-sm font-semibold text-slate-900 transition-colors duration-150 hover:bg-[#e8f1fd] hover:text-[#0d3b82] focus:bg-[#dceafc] focus:outline-none"
							>
								Profile
							</button>
						</div>
					)}
				</div>
			</div>
		</header>
	)
}

export default Navbar
