import { createContext, useEffect, useMemo, useState } from 'react'
import { getUsers } from '../services/userService.js'

const toUserModel = (u) => ({
    ...u,
    id: u?.id ?? u?.userId,
    name: [u?.name, [u?.firstname, u?.lastname].filter(Boolean).join(' ').trim(), u?.email].find(Boolean) || 'User',
})

const defaultUserContextValue = {
    users: [],
    selectedUser: null,
    setSelectedUser: () => {},
}

const UserContext = createContext(defaultUserContextValue)

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await getUsers()
                const mappedUsers = (Array.isArray(data) ? data : []).map(toUserModel).filter((u) => u.id != null)
                setUsers(mappedUsers)
            } catch (error) {
                console.error('Failed to load users', error)
                setUsers([])
            }
        }

        loadUsers()
    }, [])

    useEffect(() => {
        if (users.length === 0) {
            setSelectedUser(null)
            return
        }

        setSelectedUser((prev) => {
            if (!prev) return users[0]
            const prevId = prev?.id ?? prev?.userId
            return users.find((u) => String(u.id) === String(prevId)) || users[0]
        })
    }, [users])

    const value = useMemo(
        () => ({
            users,
            selectedUser,
            setSelectedUser,
        }),
        [users, selectedUser],
    )

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export default UserContext
