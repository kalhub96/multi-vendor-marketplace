"use client"

import Link from "next/link"
import { useCart } from "@/lib/cart-context"

export default function CartBadge() {
  const { cartCount } = useCart()

  return (
    <Link href="/cart" className="relative hover:text-green-400 transition-colors">
      🛒
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-green-400 text-gray-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </Link>
  )
}