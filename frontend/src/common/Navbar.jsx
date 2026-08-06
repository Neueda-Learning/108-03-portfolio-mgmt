import { useContext, useEffect, useMemo, useState } from 'react'
import UserContext from '../context/UserContext.jsx'

function Navbar({ pageTitle = 'Dashboard' }) {
    const { users = [], selectedUser, setSelectedUser } = useContext(UserContext)

    const [activeUserId, setActiveUserId] = useState(
        selectedUser?.id != null
            ? String(selectedUser.id)
            : selectedUser?.userId != null
                ? String(selectedUser.userId)
                : users[0]?.id != null
                    ? String(users[0].id)
                    : users[0]?.userId != null
                        ? String(users[0].userId)
                        : '',
    )

    useEffect(() => {
        const nextId =
            selectedUser?.id != null
                ? String(selectedUser.id)
                : selectedUser?.userId != null
                    ? String(selectedUser.userId)
                    : ''

        if (nextId) setActiveUserId(nextId)
    }, [selectedUser])

    const profileName = useMemo(() => {
        const selected = users.find(
            (user) => String(user.id ?? user.userId) === activeUserId,
        )
        return selected?.name || selectedUser?.name || 'User'
    }, [activeUserId, selectedUser, users])

    const profileInitials = useMemo(() => {
        const initials = profileName
            .split(' ')
            .filter(Boolean)
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()

        return initials || 'U'
    }, [profileName])

    return (
        <header className="grid min-h-[92px] grid-cols-[1.2fr_1fr_auto] items-center gap-5 border-b border-[#dce6f2] bg-gradient-to-r from-[#f8fcff] via-[#eef5ff] to-[#f7fbff] px-6 py-[18px] shadow-[0_8px_18px_-14px_rgba(15,23,42,0.3)] max-[900px]:grid-cols-1 max-[900px]:gap-3 max-[900px]:p-4 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
            <div>
                <p className="m-0 text-[11px] font-bold uppercase tracking-[0.14em] text-[#3b5f82] dark:text-indigo-300">WealthMate</p>
                <h1 className="m-0 mt-1 text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-slate-900 max-[900px]:text-2xl dark:text-slate-100">
                    {pageTitle}
                </h1>
            </div>

            <div className="flex flex-col gap-[7px]">
                <label htmlFor="userScope" className="text-xs font-semibold text-[#3c4f65] dark:text-slate-300">
                    Active User
                </label>
                <select
                    id="userScope"
                    className="rounded-[14px] border border-[#c8d6e7] bg-white px-3.5 py-2.5 text-sm font-semibold leading-tight text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-[border-color,box-shadow,transform] duration-200 hover:border-[#9ab4d1] focus:border-[#2f5f93] focus:outline-none focus:ring-4 focus:ring-[#2f5f93]/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-500"
                    value={activeUserId}
                    disabled={users.length === 0}
                    onChange={(event) => {
                        const nextId = event.target.value
                        setActiveUserId(nextId)
                        const selected = users.find((user) => String(user.id ?? user.userId) === nextId)
                        if (selected && setSelectedUser) {
                            setSelectedUser(selected)
                        }
                    }}
                >
                    {users.map((user) => (
                        <option key={String(user.id ?? user.userId)} value={String(user.id ?? user.userId)}>
                            {user.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center justify-end max-[900px]:justify-start">
                <div className="inline-flex items-center gap-3 rounded-[15px] border border-[#cedaea] bg-white px-3 py-2 shadow-[0_4px_10px_-8px_rgba(15,23,42,0.35)] dark:border-slate-600 dark:bg-slate-800">
                    <span
                        className="inline-grid h-[42px] w-[42px] place-items-center rounded-full bg-gradient-to-br from-[#2a63d8] to-[#1749ad] text-[13px] font-bold tracking-[0.03em] text-white"
                        aria-hidden="true"
                    >
                        {profileInitials}
                    </span>
                    <strong className="text-sm font-bold text-slate-900 dark:text-slate-100">{profileName}</strong>
                </div>
            </div>
        </header>
    )
}

export default Navbar
