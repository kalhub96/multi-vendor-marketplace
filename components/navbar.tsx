import Link from "next/link"
import CartBadge from "@/components/cart-badge"
import AuthButton from "@/components/auth-button"

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
          <Link 
          href="/products" 
          className="hover:text-green-400 transition-colors">
            Marketplace
          </Link>
          
          <CartBadge />

          <AuthButton />
        </div>
      </div>
    </nav>
  )
}