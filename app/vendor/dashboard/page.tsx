"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User } from "@/types"
import { useVendors } from "@/lib/vendors-context"
import { useProducts } from "@/lib/products-context"
import { useAuth } from "@/lib/auth-context"
import { useRatings } from "@/lib/ratings-context"
import { useOrders } from "@/lib/orders-context"
import { Skeleton } from "@/components/skeleton"
import { AnimatedNumber } from "@/components/animated-number"
import { motion } from "framer-motion"


export default function VendorDashboredPage() {
    const router = useRouter()
    const { currentUser, loaded } = useAuth()
    const { products } = useProducts()
    const { getVendorByUserId } = useVendors()
    const { getVendorAverage, ratings } = useRatings()
    const { orders } = useOrders()
    

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
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <section className="bg-gray-900 py-10 px-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-6 flex flex-col gap-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
        <Skeleton className="h-40 w-full rounded-xl" />
      </section>
    </main>
  )
}

    // find the vendor's store info
    const vendorStore = currentUser ? getVendorByUserId(currentUser.id) : undefined

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
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    Welcome back, {vendorStore?.storeName || currentUser?.name}
                    {vendorStore?.verificationStatus === "verified" && (
                        <span className="text-green-400 text-xl" title="Verified Store">✓</span>
                    )}
                </h1>
                <p className="text-gray-400 mt-2">
                    Here's what's happening with your store today
                </p>
            </div>
        </section>
        {vendorStore && vendorStore.verificationStatus !== "verified" && (
          <section className="max-w-6xl mx-auto px-8 pt-6">
            <div className="bg-yellow-900/50 border border-yellow-500 text-yellow-300 px-6 py-4 rounded-lg flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="font-semibold">Get your store verified</p>
                <p className="text-sm mt-1">
                  Verified stores build more trust with buyers.
                </p>
              </div>
              <Link
                href="/vendor/verify-id"
                className="bg-yellow-400 text-gray-900 font-semibold px-5 py-2 rounded-full hover:bg-yellow-300 transition-colors text-sm whitespace-nowrap"
              >
                Verify Now
              </Link>
            </div>
          </section>
        )}

        <section className="max-w-6xl mx-auto px-8 py-10">

            {/* STATS GRID */}
            {/* STATS GRID */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0 }}
      className="bg-gray-900 rounded-xl p-6"
    >
        <p className="text-gray-400 text-sm mb-2">Total Products</p>
        <p className="text-3xl font-bold text-green-400">
            <AnimatedNumber value={vendorProducts.length} />
        </p>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-gray-900 rounded-xl p-6"
    >
        <p className="text-gray-400 text-sm mb-2">Total Orders</p>
        <p className="text-3xl font-bold text-green-400">
          <AnimatedNumber value={orders.length} />
        </p>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-gray-900 rounded-xl p-6"
    >
        <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
        <p className="text-3xl font-bold text-green-400">
            <AnimatedNumber value={totalRevenue} prefix="ETB " />
        </p>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-gray-900 rounded-xl p-6"
    >
        <p className="text-gray-400 text-sm mb-2">Store Rating</p>
        <p className="text-3xl font-bold text-green-400">
            {getVendorAverage("vendor_1") > 0
              ? <><AnimatedNumber value={getVendorAverage("vendor_1")} decimals={1} /> ★</>
              : "No ratings yet"}
        </p>
        <p className="text-gray-500 text-xs mt-1">
            {ratings.filter((r) => r.vendorId === "vendor_1").length} reviews
        </p>
    </motion.div>
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
