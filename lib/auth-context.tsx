"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { User } from "@/types"

type AuthContextType = {
    currentUser: User | null
    login: (User: User) => void
    logout: () => void
    loaded: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode}) {
    const [currentUser, setCurrentUser] = useState<User| null>(null)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        try{
            const stored = localStorage.getItem("currentUser")
            if (stored) setCurrentUser(JSON.parse(stored))
        } catch {
           setCurrentUser(null)
        }
        setLoaded(true)
    }, [])

    
    // LOGIN — SAVE USER TO STATE AND LOCALSTORAGE
    const login = (user: User) => {
    localStorage.setItem("currentUser", JSON.stringify(user))
    setCurrentUser(user)
  }

  // LOGOUT — CLEAR USER FROM STATE AND LOCALSTORAGE
  const logout = () => {
    localStorage.removeItem("currentUser")
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loaded }}>
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