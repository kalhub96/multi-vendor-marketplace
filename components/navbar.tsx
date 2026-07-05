import Link from "next/link"
import CartBadge from "@/components/cart-badge"

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-8 py-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto">

        <Link href="/" className="text-green-400 font-bold text-xl">
          MultiMart
        </Link>

        <input
          type="text"
          placeholder="Search products, vendors, or categories..."
          className="hidden md:block w-96 px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <div className="flex items-center gap-6">
          <Link href="/products" className="hover:text-green-400 transition-colors">
            Marketplace
          </Link>
          <Link href="/vendor/dashboard" className="hover:text-green-400 transition-colors">
            Vendor
          </Link>
          <Link href="/admin/dashboard" className="hover:text-green-400 transition-colors">
            Dashboard
          </Link>

          <CartBadge />

          <Link href="/login" className="hover:text-green-400 transition-colors">
            Log In
          </Link>
          <Link
            href="/register"
            className="bg-green-400 text-gray-900 font-semibold px-4 py-2 rounded-full hover:bg-green-300 transition-colors"
          >
            Become a Seller
          </Link>
        </div>
      </div>
    </nav>
  )
}