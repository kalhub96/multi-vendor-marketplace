"use client"

import Link from "next/link"
import { useState } from "react"

export default function Navbar() {
    const [cartCount, setCartCount] = useState(0)

    return (
        <nav className="bg-gray-900 text-white px-8 py-4">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
                <Link href="/" className="text-green-400 font-bold text-xl">
                MEGASSOUK
                </Link>

                <input
                type="text"
                placeholder="Search product, vendors, or categories..."
                className="hidden md:block w-96 px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400" 
                />
                <div className="flex items-center gap-6">
                    <Link href="/product" className="hover:text-green-400 transition-colors">
                    Marketplace
                    </Link>
                    <Link href="/vendor/dashboard" className="hover:text-green-400 transition-colors">
                    Vendor
                    </Link>
                    <Link href="/admin/dashboard" className="hover:text-green-400 transition-colors">
                    Dashboard
                    </Link>

                    <Link href="/cart" className="relative hover:text-green-400 transition-colors">
                    🛒
                    <span className="absolute -top-2 -right-2 bg-green-400 text-gray-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                    </span>
                    </Link>

                    <Link href="/login" className="hover:text-green-400 transition-colors">
                    Log In
                    </Link>
                    <Link href="/register" className="bg-green-400 text-gray-900 font-semibold px-4 py-2 rounded-full hover:bg-green-300 transition-colors">
                    Become a Seller
                    </Link>
                </div>
            </div>

        </nav>
    )
}