"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { User } from "@/types"

type AuthContextType = {
  currentUser: User | null
  login: (user: User) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => Promise<void>
  loaded: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loaded, setLoaded] = useState(false)

  // LOAD SAVED SESSION FROM LOCALSTORAGE, THEN REFRESH FROM DATABASE
  useEffect(() => {
    const loadSession = async () => {
      try {
        const stored = localStorage.getItem("currentUser")
        if (!stored) {
          setLoaded(true)
          return
        }

        const savedUser: User = JSON.parse(stored)

        // RE-FETCH THIS USER FROM SUPABASE TO GET THEIR LATEST STATUS
        // (in case they were banned/suspended since their last visit)
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", savedUser.id)
          .single()

        if (error || !data) {
          // USER NO LONGER EXISTS — CLEAR THE STALE SESSION
          localStorage.removeItem("currentUser")
          setCurrentUser(null)
        } else {
          const freshUser = mapRowToUser(data)
          setCurrentUser(freshUser)
          localStorage.setItem("currentUser", JSON.stringify(freshUser))
        }
      } catch {
        setCurrentUser(null)
      }
      setLoaded(true)
    }

    loadSession()
  }, [])

  // LOGIN — SAVE SESSION TO STATE AND LOCALSTORAGE
  const login = (user: User) => {
    localStorage.setItem("currentUser", JSON.stringify(user))
    setCurrentUser(user)
  }

  // LOGOUT — CLEAR SESSION FROM STATE AND LOCALSTORAGE
  const logout = () => {
    localStorage.removeItem("currentUser")
    setCurrentUser(null)
  }

  // UPDATE USER — SAVE TO SUPABASE, THEN UPDATE SESSION
  const updateUser = async (updates: Partial<User>) => {
    if (!currentUser) return

    const dbUpdates: {
      name?: string
      email?: string
      role?: string
      status?: string
    } = {}
    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.email !== undefined) dbUpdates.email = updates.email
    if (updates.role !== undefined) dbUpdates.role = updates.role
    if (updates.status !== undefined) dbUpdates.status = updates.status

    const { error } = await supabase
      .from("users")
      .update(dbUpdates)
      .eq("id", currentUser.id)

    if (error) {
      console.error("Failed to update user:", error.message)
      return
    }

    const updated = { ...currentUser, ...updates }
    setCurrentUser(updated)
    localStorage.setItem("currentUser", JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, updateUser, loaded }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}