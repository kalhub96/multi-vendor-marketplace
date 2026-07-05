"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function AuthButton() {
  const router = useRouter()
  const { currentUser, logout, loaded } = useAuth()

  // HANDLE LOGOUT
  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // PREVENT HYDRATION MISMATCH
  if (!loaded) return null

  // LOGGED OUT STATE
  if (!currentUser) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="hover:text-green-400 transition-colors"
        >
          Log In
        </Link>
        <Link
          href="/register"
          className="bg-green-400 text-gray-900 font-semibold px-4 py-2 rounded-full hover:bg-green-300 transition-colors"
        >
          Become a Seller
        </Link>
      </div>
    )
  }

  // LOGGED IN STATE
  return (
    <div className="flex items-center gap-4">

      {/* ROLE SPECIFIC LINK */}
      {currentUser.role === "vendor" && (
        <Link
          href="/vendor/dashboard"
          className="hover:text-green-400 transition-colors text-sm"
        >
          Vendor Portal
        </Link>
      )}
      {currentUser.role === "admin" && (
        <Link
          href="/admin/dashboard"
          className="hover:text-green-400 transition-colors text-sm"
        >
          Admin Panel
        </Link>
      )}

      {/* PROFILE LINK */}
      <Link
        href="/profile"
        className="flex items-center gap-2 hover:text-green-400 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-green-400 text-gray-900 flex items-center justify-center font-bold text-sm">
          {currentUser.name.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm hidden lg:block">
          Hi, {currentUser.name.split(" ")[0]}
        </span>
      </Link>

      {/* LOGOUT BUTTON */}
      <button
        type="button"
        onClick={handleLogout}
        className="text-sm text-gray-400 hover:text-red-400 transition-colors"
      >
        Logout
      </button>
    </div>
  )
}