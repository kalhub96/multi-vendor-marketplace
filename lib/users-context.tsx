"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { User, VerificationStatus } from "@/types"

type UsersContextType = {
  users: User[]
  banUser: (userId: string) => Promise<void>
  unbanUser: (userId: string) => Promise<void>
  suspendUser: (userId: string) => Promise<void>
  activateUser: (userId: string) => Promise<void>
  getUserById: (userId: string) => User | undefined
  refetchUsers: () => Promise<void>
  loaded: boolean
}

const UsersContext = createContext<UsersContextType | null>(null)

// CONVERT A DATABASE ROW (snake_case) INTO OUR APP'S User TYPE (camelCase)
function mapRowToUser(row: {
  id: string
  name: string
  email: string
  role: string
  status: string
  created_at: string
}): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role as User["role"],
    status: row.status as User["status"],
    createdAt: row.created_at,
  }
}

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [loaded, setLoaded] = useState(false)

  // FETCH ALL USERS FROM SUPABASE
  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Failed to fetch users:", error.message)
      setUsers([])
    } else {
      setUsers(data.map(mapRowToUser))
    }
    setLoaded(true)
  }

  // LOAD ON MOUNT
  useEffect(() => {
    fetchUsers()
  }, [])

  // UPDATE A USER'S STATUS IN THE DATABASE, THEN UPDATE LOCAL STATE
  const updateStatus = async (userId: string, status: string) => {
    const { error } = await supabase
      .from("users")
      .update({ status })
      .eq("id", userId)

    if (error) {
      console.error("Failed to update user status:", error.message)
      return
    }

    // UPDATE LOCAL STATE SO THE UI REFLECTS THE CHANGE INSTANTLY
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: status as User["status"] } : u
      )
    )
  }

  const banUser = (userId: string) => updateStatus(userId, "banned")
  const unbanUser = (userId: string) => updateStatus(userId, "active")
  const suspendUser = (userId: string) => updateStatus(userId, "suspended")
  const activateUser = (userId: string) => updateStatus(userId, "active")

  const getUserById = (userId: string) => {
    return users.find((u) => u.id === userId)
  }

  return (
    <UsersContext.Provider
      value={{
        users,
        banUser,
        unbanUser,
        suspendUser,
        activateUser,
        getUserById,
        refetchUsers: fetchUsers,
        loaded,
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}

export function useUsers() {
  const context = useContext(UsersContext)
  if (!context) {
    throw new Error("useUsers must be used within a UsersProvider")
  }
  return context
}