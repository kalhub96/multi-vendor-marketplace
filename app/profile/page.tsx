"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useUsers } from "@/lib/users-context"
import { vendors } from "@/data/users"
import { orders } from "@/data/orders"
import { useRatings } from "@/lib/ratings-context"

export default function ProfilePage() {
  const router = useRouter()
  const { currentUser, loaded, updateUser, logout } = useAuth()
  const { getUserById } = useUsers()
  const { getVendorAverage } = useRatings()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [saved, setSaved] = useState(false)
  const [formError, setFormError] = useState("")

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordSaved, setPasswordSaved] = useState(false)

  // AUTH CHECK
  useEffect(() => {
    if (!loaded) return
    if (!currentUser) {
      router.push("/login")
    }
  }, [currentUser, loaded, router])

  // POPULATE FORM WITH CURRENT USER DATA
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name)
      setEmail(currentUser.email)
    }
  }, [currentUser])

  if (!loaded || !currentUser) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Loading profile...</p>
      </main>
    )
  }

  const liveUser = getUserById(currentUser.id)
  const vendorStore = vendors.find((v) => v.userId === currentUser.id)
  const myOrders = orders.filter((o) => o.buyerId === currentUser.id)
  const totalSpent = myOrders.reduce((sum, o) => sum + o.totalAmount, 0)

  // SAVE PROFILE CHANGES
  const handleSaveProfile = () => {
    setFormError("")
    setSaved(false)

    if (!name.trim() || !email.trim()) {
      setFormError("Name and email cannot be empty")
      return
    }

    if (!email.includes("@")) {
      setFormError("Please enter a valid email")
      return
    }

    updateUser({ name: name.trim(), email: email.trim() })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  // SAVE PASSWORD (MOCK — no real backend yet)
  const handleSavePassword = () => {
    setPasswordError("")
    setPasswordSaved(false)

    if (!newPassword || !confirmPassword) {
      setPasswordError("Please fill in both password fields")
      return
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    // NOTE: no real password storage yet — this is a mock UI flow
    setPasswordSaved(true)
    setNewPassword("")
    setConfirmPassword("")
    setTimeout(() => setPasswordSaved(false), 2500)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* HEADER */}
      <section className="bg-gray-900 py-10 px-8">
        <div className="max-w-3xl mx-auto flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-green-400 text-gray-900 flex items-center justify-center font-bold text-2xl shrink-0">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{currentUser.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                currentUser.role === "admin"
                  ? "bg-purple-900 text-purple-300"
                  : currentUser.role === "vendor"
                  ? "bg-blue-900 text-blue-300"
                  : "bg-gray-700 text-gray-300"
              }`}>
                {currentUser.role}
              </span>
              {liveUser && (
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                  liveUser.status === "banned"
                    ? "bg-red-900 text-red-300"
                    : liveUser.status === "suspended"
                    ? "bg-yellow-900 text-yellow-300"
                    : "bg-green-900 text-green-300"
                }`}>
                  {liveUser.status}
                </span>
              )}
            </div>
            <p className="text-gray-500 text-xs mt-2">
              Member since {new Date(currentUser.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-8 py-10 flex flex-col gap-8">

        {/* SUSPENSION / BAN NOTICE */}
        {liveUser && liveUser.status !== "active" && (
          <div className={`px-6 py-4 rounded-lg border ${
            liveUser.status === "banned"
              ? "bg-red-900/50 border-red-500 text-red-300"
              : "bg-yellow-900/50 border-yellow-500 text-yellow-300"
          }`}>
            <p className="font-semibold capitalize">Account {liveUser.status}</p>
            <p className="text-sm mt-1">
              {liveUser.status === "banned"
                ? "Your account has been banned. Contact support for help."
                : "Some actions are restricted while your account is suspended."}
            </p>
          </div>
        )}

        {/* ROLE-SPECIFIC INFO */}
        {currentUser.role === "buyer" && (
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4">Your Activity</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-green-400">
                  {myOrders.length}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-green-400">
                  ETB {totalSpent.toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        )}

        {currentUser.role === "vendor" && vendorStore && (
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4">Your Store</h2>
            <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{vendorStore.storeName}</p>
                <p className="text-gray-400 text-sm mt-1">
                  {vendorStore.description}
                </p>
              </div>
              <p className="text-green-400 font-bold">
                {getVendorAverage(vendorStore.id) > 0
                  ? `${getVendorAverage(vendorStore.id).toFixed(1)} ★`
                  : "No ratings"}
              </p>
            </div>
            <Link
              href="/vendor/dashboard"
              className="text-green-400 text-sm hover:underline mt-4 inline-block"
            >
              Go to Vendor Dashboard →
            </Link>
          </div>
        )}

        {currentUser.role === "admin" && (
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-lg font-bold mb-2">Admin Access</h2>
            <p className="text-gray-400 text-sm">
              You have full administrative permissions across the marketplace.
            </p>
            <Link
              href="/admin/dashboard"
              className="text-green-400 text-sm hover:underline mt-4 inline-block"
            >
              Go to Admin Panel →
            </Link>
          </div>
        )}

        {/* EDIT PROFILE FORM */}
        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4">Edit Profile</h2>

          {formError && (
            <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">
              {formError}
            </div>
          )}
          {saved && (
            <div className="bg-green-900/50 border border-green-500 text-green-300 px-4 py-3 rounded-lg mb-4 text-sm">
              ✓ Profile updated successfully
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <button
              type="button"
              onClick={handleSaveProfile}
              className="bg-green-400 text-gray-900 font-semibold px-6 py-3 rounded-full hover:bg-green-300 transition-colors self-start"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* CHANGE PASSWORD */}
        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4">Change Password</h2>

          {passwordError && (
            <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">
              {passwordError}
            </div>
          )}
          {passwordSaved && (
            <div className="bg-green-900/50 border border-green-500 text-green-300 px-4 py-3 rounded-lg mb-4 text-sm">
              ✓ Password updated successfully
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-500"
              />
            </div>
            <button
              type="button"
              onClick={handleSavePassword}
              className="bg-gray-800 text-white font-semibold px-6 py-3 rounded-full hover:bg-gray-700 transition-colors self-start"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* DANGER ZONE */}
        <div className="bg-gray-900 rounded-xl p-6 border border-red-900/50">
          <h2 className="text-lg font-bold mb-2">Account</h2>
          <p className="text-gray-400 text-sm mb-4">
            Log out of your MultiMart account on this device.
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 font-medium text-sm transition-colors"
          >
            Logout
          </button>
        </div>

      </section>
    </main>
  )
}