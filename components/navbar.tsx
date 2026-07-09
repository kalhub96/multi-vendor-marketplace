import Link from "next/link"
import CartBadge from "@/components/cart-badge"
import AuthButton from "@/components/auth-button"
import SearchBar from "@/components/search-bar"

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-8 py-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto">

        <Link href="/" className="text-green-400 font-bold text-xl">
          MultiMart
        </Link>

        <SearchBar />

        <div className="flex items-center gap-6">
          <Link
            href="/products"
            className="hover:text-green-400 transition-colors"
          >
            Marketplace
          </Link>

          <CartBadge />

          <AuthButton />
        </div>

      </div>
    </nav>
  )
}