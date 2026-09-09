"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { User } from "@/types"

type AuthContextType = {
  currentUser: User | null
  register: (email: string, password: string, name: string, role: "buyer" | "vendor") => Promise<{ error: string | null }>
  login: (email: string, password: string) => Promise<{ error: string | null; user: User | null }>
  logout: () => Promise<void>
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

// FETCH THE public.users PROFILE ROW FOR A GIVEN AUTH USER ID
async function fetchProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single()

  if (error || !data) return null
  return mapRowToUser(data)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loaded, setLoaded] = useState(false)

  // ON MOUNT — CHECK IF THERE'S ALREADY A LOGGED-IN SUPABASE SESSION
  useEffect(() => {
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        setCurrentUser(profile)
      }

      setLoaded(true)
    }

    loadSession()

    // LISTEN FOR AUTH CHANGES (login/logout from anywhere in the app)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id)
          setCurrentUser(profile)
        } else {
          setCurrentUser(null)
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // REGISTER — CREATES A REAL SUPABASE AUTH ACCOUNT
  // The database trigger automatically creates the matching public.users row
  const register = async (
    email: string,
    password: string,
    name: string,
    role: "buyer" | "vendor"
  ): Promise<{ error: string | null }> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
      },
    })

    if (error) {
      return { error: error.message }
    }

    if (!data.user) {
      return { error: "Something went wrong creating your account" }
    }

    return { error: null }
  }

  // LOGIN — REAL PASSWORD VERIFICATION VIA SUPABASE AUTH
  const login = async (
    email: string,
    password: string
  ): Promise<{ error: string | null; user: User | null }> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: "Invalid email or password", user: null }
    }

    if (!data.user) {
      return { error: "Login failed", user: null }
    }

    const profile = await fetchProfile(data.user.id)

    if (!profile) {
      return { error: "Could not load your profile", user: null }
    }

    if (profile.status === "banned") {
      await supabase.auth.signOut()
      return { error: "This account has been banned. Contact support for help.", user: null }
    }

    setCurrentUser(profile)
    return { error: null, user: profile }
  }

  // LOGOUT — CLEAR THE REAL SUPABASE SESSION
  const logout = async () => {
    await supabase.auth.signOut()
    setCurrentUser(null)
  }

  // UPDATE USER PROFILE (name/email) — NOT PASSWORD, that's handled separately
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

    setCurrentUser({ ...currentUser, ...updates })
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, register, login, logout, updateUser, loaded }}
    >
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