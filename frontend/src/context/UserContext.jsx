import { createContext, useState } from 'react'

const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
  },
  {
    id: 3,
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
  },
]

const defaultUserContextValue = {
  users,
  selectedUser: users[0],
  setSelectedUser: () => {},
}

const UserContext = createContext(defaultUserContextValue)

export const UserProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState(users[0])

  return (
    <UserContext.Provider value={{ users, selectedUser, setSelectedUser }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContext
