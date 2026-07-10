"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { User } from "@/types"
import { users as initialUsers } from "@/data/users"

type UsersContextType = {
    users: User[]
    banUser: (userId: string) => void
    unbanUser: (userId: string) => void
    suspendUser: (userId: string) => void
    activateUser: (userId: string) => void
    getUserById: (userId: string) => User | undefined
    loaded: boolean
}

const UsersContext = createContext<UsersContextType | null>(null)

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [loaded, setLoaded] = useState(false)

useEffect(() => {
    try {
        const stored = localStorage.getItem("allUsers")
        if (stored) {
            setUsers(JSON.parse(stored))
        } else {
            setUsers(initialUsers)
            localStorage.setItem("allUsers",JSON.stringify(initialUsers))
        }
    } catch {
        setUsers(initialUsers)
    }
    setLoaded(true)
}, [])

useEffect(() => {
    if (loaded){
        localStorage.setItem("allUsers", JSON.stringify(users))
    }
}, [users, loaded])

//  BAN A USER
const banUser = (userId: string) => {
    setUsers((prev) => 
        prev.map((u) => (u.id === userId ? {...u, status: "banned" }: u))
    )
}

// UNBAN A USER
const unbanUser = (userId: string) => {
    setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: "active"} : u))
    )
}

const suspendUser = (userId: string) => {
    setUsers((prev) =>
        prev.map((u) => (u.id === userId ? {...u, status: "suspended"} : u))
    )
}

// ACTIVATE — REMOVE SUSPENSION
const activateUser = (userId: string) => {
    setUsers((prev) => 
    prev.map((u) => (u.id === userId ? {...u, status: "active"} : u))
  )
}

// GET A SINGLE USER BY ID — used to check latest status anywhere in the app
const getUserById = (userId: string) => {
    return users.find((u) => u.id === userId)
}

return(
    <UsersContext.Provider
    value={{
        users,
        banUser,
        unbanUser,
        suspendUser,
        activateUser,
        getUserById,
        loaded,
    }}>
        {children}
    </UsersContext.Provider>
)
}

export function useUsers(){
    const context = useContext(UsersContext)
    if (!context) {
        throw new Error ("useUsers must be used within a UsersProvider")
    }
    return context
}

