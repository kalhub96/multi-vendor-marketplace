"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User } from "@/types"
import { vendors } from "@/data/users"
import { orders } from "@/data/orders"
import { useProducts } from "@/lib/products-context"
import { useAuth } from "@/lib/auth-context"

export default function VendorDashboredPage() {
    const router = useRouter()
    const { currentUser, loaded } = useAuth()
    const { products } = useProducts()

    useEffect(() => {
        console.log("VENDOR DASHBOARD CHECK:", { loaded, currentUser })
        if (!loaded) return
        if (!currentUser) {
            console.log("REDIRECTING — no currentUser")
            router.push("/login")
            return
        }
        if (currentUser.role !== "vendor"){
            console.log("REDIRECTING — wrong role:", currentUser.role)
            router.push("/")
        }
    }, [currentUser, loaded, router])

    if (!loaded || !currentUser) {
        return(
            <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
                <p className="text-gray-400">Loading dashboard...</p>
            </main>
        )
    }

    // find the vendor's store info
    const vendorStore = vendors.find((v) => v.userId === currentUser?.id)

    // find the vendor's product
    const vendorProducts = products.filter((p) => p.vendorId === "vendor_1")

    const totalRevenue = vendorProducts.reduce(
        (sum, p) => sum + p.price * 160 * Math.max(0, 50 - p.stock),
        0
    )

    return (
    <main className="min-h-screen bg-gray-950 text-white">

        {/* HEADER */}
        <section className="bg-gray-900 py-10 px-8">
            <div className="max-w-6xl mx-auto">
                <p className="text-green-400 text-sm font-medium mb-1">
                    Vendor Dashboard
                </p>
                <h1 className="text-3xl font-bold">
                    Welcome back, {vendorStore?.storeName || currentUser?.name}
                </h1>
                <p className="text-gray-400 mt-2">
                    Here's what's happening with your store today
                </p>
            </div>
        </section>

        <section className="max-w-6xl mx-auto px-8 py-10">

            {/* STATS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-gray-900 rounded-xl p-6">
                    <p className="text-gray-400 text-sm mb-2">Total Products</p>
                    <p className="text-3xl font-bold text-green-400">
                        {vendorProducts.length}
                    </p>
                </div>
                <div className="bg-gray-900 rounded-xl p-6">
                    <p className="text-gray-400 text-sm mb-2">Total Orders</p>
                    <p className="text-3xl font-bold text-green-400">{orders.length}</p>
                </div>
                <div className="bg-gray-900 rounded-xl p-6">
                    <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-400">
                        ETB {totalRevenue.toFixed(0)}
                    </p>
                </div>
                <div className="bg-gray-900 rounded-xl p-6">
                    <p className="text-gray-400 text-sm mb-2">Store Rating</p>
                    <p className="text-3xl font-bold text-green-400">4.8 ★</p>
                </div>
            </div>

            <div className="flex flex-row items-center gap-4 mb-10 flex-wrap">
                <Link
                href="/vendor/products"
                className="bg-green-400 text-gray-900 font-semibold px-6 py-3 rounded-full hover:bg-green-300 transition-colors">
                    Manage Products
                </Link>
                <Link
                href="/vendor/orders"
                className="bg-gray-800 text-white font-semibold px-6 py-3 rounded-full hover:bg-gray-700 transition-colors">
                    View Orders
                </Link>
                <Link
                href="/products"
                className="bg-gray-800 text-white font-semibold px-6 py-3 rounded-full hover:bg-gray-700 transition-colors">
                    View Storefront
                </Link>
            </div>

            {/* YOUR PRODUCTS — outside the grid */}
            <div className="bg-gray-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Your Products</h2>
                    <Link
                        href="/vendor/products"
                        className="text-green-400 text-sm hover:underline"
                    >
                        View all →
                    </Link>
                </div>
                <div className="flex flex-col gap-3">
                    {vendorProducts.slice(0, 5).map((product) => (
                        <div
                            key={product.id}
                            className="flex items-center justify-between bg-gray-800 rounded-lg p-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-gray-700 w-12 h-12 rounded-lg flex items-center justify-center text-xs text-gray-500">
                                    Img
                                </div>
                                <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-gray-400 text-sm">
                                        {product.stock} in stock
                                    </p>
                                </div>
                            </div>
                            <p className="text-green-400 font-bold">
                                ETB {(product.price * 160).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    </main>
)
}
