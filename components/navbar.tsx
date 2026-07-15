"use client"

import { useState } from "react"
import Link from "next/link"
import CartBadge from "@/components/cart-badge"
import AuthButton from "@/components/auth-button"
import SearchBar from "@/components/search-bar"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-gray-900 text-white px-4 sm:px-8 py-4 relative">
      <div className="flex items-center justify-between max-w-6xl mx-auto">

        {/* LOGO */}
        <Link href="/" className="text-green-400 font-bold text-xl shrink-0">
          MultiMart
        </Link>

        {/* SEARCH BAR — hidden on mobile, shown on md+ */}
        <div className="hidden md:block">
          <SearchBar />
        </div>

        {/* DESKTOP RIGHT SIDE — hidden on mobile */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/products"
            className="hover:text-green-400 transition-colors"
          >
            Marketplace
          </Link>
          <CartBadge />
          <AuthButton />
        </div>

        {/* MOBILE RIGHT SIDE — cart + hamburger, hidden on md+ */}
        <div className="flex md:hidden items-center gap-4">
          <CartBadge />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-1"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              // X ICON
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // HAMBURGER ICON
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-800 flex flex-col gap-4 max-w-6xl mx-auto">
          <SearchBar />
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-green-400 transition-colors"
          >
            Marketplace
          </Link>
          <div onClick={() => setMobileMenuOpen(false)}>
            <AuthButton />
          </div>
        </div>
      )}
    </nav>
  )
}