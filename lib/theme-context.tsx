"use client"

import { createContext, useContext, useState, useEffect } from "react"

type Theme = "light" | "dark" | "system"
type ResolvedTheme = "light" | "dark"

type ThemeContextType = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  loaded: boolean
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system")
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark")
  const [loaded, setLoaded] = useState(false)

  // DETECT SYSTEM PREFERENCE
  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === "undefined") return "dark"
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  }

  // LOAD SAVED THEME PREFERENCE ON MOUNT
  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme") as Theme | null
      const initialTheme = stored || "system"
      setThemeState(initialTheme)

      const resolved =
        initialTheme === "system" ? getSystemTheme() : initialTheme
      setResolvedTheme(resolved)
    } catch {
      setThemeState("system")
      setResolvedTheme(getSystemTheme())
    }
    setLoaded(true)
  }, [])

  // APPLY THE RESOLVED THEME TO THE <html> TAG
  useEffect(() => {
    if (!loaded) return
    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(resolvedTheme)
  }, [resolvedTheme, loaded])

  // LISTEN FOR SYSTEM PREFERENCE CHANGES (only matters when theme === "system")
  useEffect(() => {
    if (!loaded) return
    if (theme !== "system") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = () => {
      setResolvedTheme(getSystemTheme())
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, loaded])

  // SET THEME — SAVES PREFERENCE AND RESOLVES IMMEDIATELY
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem("theme", newTheme)

    const resolved = newTheme === "system" ? getSystemTheme() : newTheme
    setResolvedTheme(resolved)
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, loaded }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}