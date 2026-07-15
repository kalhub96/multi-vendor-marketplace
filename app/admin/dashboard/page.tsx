"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { vendors } from "@/data/users"
import { useProducts } from "@/lib/products-context"
import { useUsers } from "@/lib/users-context"
import { useOrders } from "@/lib/orders-context"
import { useAuth } from "@/lib/auth-context"
import toast from "react-hot-toast"
import { Skeleton } from "@/components/skeleton"
import { AnimatedNumber } from "@/components/animated-number"
import { motion, AnimatePresence } from "framer-motion"

export default function AdminDashboardPage() {
 const router = useRouter()
 const { currentUser, loaded } = useAuth()
 const { products: allProducts, deleteProduct } = useProducts()
 const { users, banUser, unbanUser, suspendUser, activateUser } = useUsers()
 const { orders } = useOrders()
 const [activeTab, setActiveTab] = useState<"overview" | "vendors" | "products">("overview")

  // AUTH CHECK — ADMIN ONLY
  useEffect(() => {
    if (!loaded) return
    if (!currentUser) {
      router.push("/login")
      return
    }
    if (currentUser.role !== "admin") {
      router.push("/")
    }
  }, [currentUser, loaded, router])

 if (!loaded || !currentUser) {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <section className="bg-gray-900 py-10 px-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-56" />
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-8 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-6 flex flex-col gap-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </section>
    </main>
  )
}

  const handleDeleteProduct = (productId: string) => {
  deleteProduct(productId)
}

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      <section className="bg-gray-900 py-10 px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-green-400 text-sm font-medium mb-1">
            Admin Panel
          </p>
          <h1 className="text-3xl font-bold">
            Welcome, {currentUser?.name}
          </h1>
          <p className="text-gray-400 mt-2">
            Full marketplace overview and controls
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 py-10">

        {/* STATS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0 }}
            className="bg-gray-900 rounded-xl p-6"
          >
            <p className="text-gray-400 text-sm mb-2">Total Users</p>
            <p className="text-3xl font-bold text-green-400">
              <AnimatedNumber value={users.length} />
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-gray-900 rounded-xl p-6"
          >
            <p className="text-gray-400 text-sm mb-2">Total Vendors</p>
            <p className="text-3xl font-bold text-green-400">
              <AnimatedNumber value={vendors.length} />
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-gray-900 rounded-xl p-6"
          >
            <p className="text-gray-400 text-sm mb-2">Total Products</p>
            <p className="text-3xl font-bold text-green-400">
              <AnimatedNumber value={allProducts.length} />
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-gray-900 rounded-xl p-6"
          >
            <p className="text-gray-400 text-sm mb-2">Total Orders</p>
            <p className="text-3xl font-bold text-green-400">
              <AnimatedNumber value={orders.length} />
            </p>
          </motion.div>
        </div>

        <div className="flex gap-3 mb-8">
          {(["overview", "vendors", "products"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-green-400 text-gray-900"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* RECENT USERS */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">All Users</h2>
              <div className="flex flex-col gap-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col gap-3 bg-gray-800 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                          user.role === "admin"
                            ? "bg-purple-900 text-purple-300"
                            : user.role === "vendor"
                            ? "bg-blue-900 text-blue-300"
                            : "bg-gray-700 text-gray-300"
                        }`}>
                          {user.role}
                        </span>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                          user.status === "banned"
                            ? "bg-red-900 text-red-300"
                            : user.status === "suspended"
                            ? "bg-yellow-900 text-yellow-300"
                            : "bg-green-900 text-green-300"
                        }`}>
                          {user.status}
                        </span>
                      </div>
                    </div>

                    {/* MODERATION CONTROLS — don't show for admins */}
                    {user.role !== "admin" && (
                      <div className="flex gap-2 pt-2 border-t border-gray-700">
                        {user.status === "banned" ? (
                          <button
                            type="button"
                            onClick={() => {
                              unbanUser(user.id)
                              toast.success(`${user.name} unbanned`)
                            }}
                            className="text-xs font-medium text-green-400 hover:text-green-300 transition-colors"
                          >
                            Unban User
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              banUser(user.id)
                              toast.success(`${user.name} banned`)
                            }}
                            className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
                          >
                            Ban User
                          </button>
                        )}

                        {user.status === "suspended" ? (
                          <button
                            type="button"
                            onClick={() => {
                              activateUser(user.id)
                              toast.success(`${user.name} reactivated`)
                            }}
                            className="text-xs font-medium text-green-400 hover:text-green-300 transition-colors"
                          >
                            Remove Suspension
                          </button>
                        ) : (
                          user.status !== "banned" && (
                            <button
                              type="button"
                              onClick={() => {
                                suspendUser(user.id)
                                toast.success(`${user.name} suspended`)
                              }}
                              className="text-xs font-medium text-yellow-400 hover:text-yellow-300 transition-colors"
                            >
                              Suspend User
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* PLATFORM STATS */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Platform Stats</h2>
              <div className="flex flex-col gap-3">

                <div className="flex justify-between items-center bg-gray-800 rounded-lg p-4">
                  <span className="text-gray-400">Total Revenue (Delivered)</span>
                  <span className="text-green-400 font-bold">
                    ETB{" "}
                    {orders
                      .filter((o) => o.status === "delivered")
                      .reduce((sum, o) => sum + o.totalAmount, 0)
                      .toFixed(0)}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-gray-800 rounded-lg p-4">
                  <span className="text-gray-400">Revenue In Progress</span>
                  <span className="text-blue-400 font-bold">
                    ETB{" "}
                    {orders
                      .filter((o) => ["pending", "processing", "shipped"].includes(o.status))
                      .reduce((sum, o) => sum + o.totalAmount, 0)
                      .toFixed(0)}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-gray-800 rounded-lg p-4">
                  <span className="text-gray-400">Avg Product Price</span>
                  <span className="text-green-400 font-bold">
                    ETB{" "}
                    {allProducts.length > 0
                      ? (
                          allProducts.reduce((sum, p) => sum + p.price * 160, 0) /
                          allProducts.length
                        ).toFixed(0)
                      : "0"}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-gray-800 rounded-lg p-4">
                  <span className="text-gray-400">Total Stock Units</span>
                  <span className="text-green-400 font-bold">
                    {allProducts.reduce((sum, p) => sum + p.stock, 0)}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-gray-800 rounded-lg p-4">
                  <span className="text-gray-400">Categories</span>
                  <span className="text-green-400 font-bold">
                    {new Set(allProducts.map((p) => p.category)).size}
                  </span>
                </div>

                <div className="border-t border-gray-800 my-1" />

                <div className="flex justify-between items-center bg-gray-800 rounded-lg p-4">
                  <span className="text-gray-400">Pending Orders</span>
                  <span className="text-yellow-400 font-bold">
                    {orders.filter((o) => o.status === "pending").length}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-gray-800 rounded-lg p-4">
                  <span className="text-gray-400">Processing Orders</span>
                  <span className="text-blue-400 font-bold">
                    {orders.filter((o) => o.status === "processing").length}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-gray-800 rounded-lg p-4">
                  <span className="text-gray-400">Shipped Orders</span>
                  <span className="text-purple-400 font-bold">
                    {orders.filter((o) => o.status === "shipped").length}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-gray-800 rounded-lg p-4">
                  <span className="text-gray-400">Delivered Orders</span>
                  <span className="text-green-400 font-bold">
                    {orders.filter((o) => o.status === "delivered").length}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-gray-800 rounded-lg p-4">
                  <span className="text-gray-400">Cancelled Orders</span>
                  <span className="text-red-400 font-bold">
                    {orders.filter((o) => o.status === "cancelled").length}
                  </span>
                </div>

                <div className="border-t border-gray-800 my-1" />

                <div className="flex justify-between items-center bg-gray-800 rounded-lg p-4">
                  <span className="text-gray-400">Active Users</span>
                  <span className="text-green-400 font-bold">
                    {users.filter((u) => u.status === "active").length}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-gray-800 rounded-lg p-4">
                  <span className="text-gray-400">Suspended Users</span>
                  <span className="text-yellow-400 font-bold">
                    {users.filter((u) => u.status === "suspended").length}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-gray-800 rounded-lg p-4">
                  <span className="text-gray-400">Banned Users</span>
                  <span className="text-red-400 font-bold">
                    {users.filter((u) => u.status === "banned").length}
                  </span>
                </div>

              </div>
            </div>
          </motion.div>
        )}

        {/* VENDORS TAB */}
        {activeTab === "vendors" && (
          <motion.div
            key="vendors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 rounded-xl overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gray-800 text-gray-400 text-sm font-medium">
              <span>Store Name</span>
              <span>Owner</span>
              <span>Products</span>
            </div>
            {vendors.map((vendor) => {
              const owner = users.find((u) => u.id === vendor.userId)
              const vendorProductCount = allProducts.filter(
                (p) => p.vendorId === vendor.id
              ).length
              return (
                <div
                  key={vendor.id}
                  className="grid grid-cols-3 gap-4 px-6 py-4 border-t border-gray-800 items-center hover:bg-gray-800/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{vendor.storeName}</p>
                    <p className="text-gray-400 text-sm line-clamp-1">
                      {vendor.description}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">{owner?.name}</p>
                    <p className="text-gray-400 text-sm">{owner?.email}</p>
                  </div>
                  <span className="text-green-400 font-bold">
                    {vendorProductCount} products
                  </span>
                </div>
              )
            })}
          </motion.div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <motion.div
            key="products"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 rounded-xl overflow-hidden"
          >
            <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-gray-800 text-gray-400 text-sm font-medium">
              <span className="col-span-2">Product</span>
              <span>Category</span>
              <span>Price</span>
              <span>Stock</span>
            </div>
            {allProducts.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-5 gap-4 px-6 py-4 border-t border-gray-800 items-center hover:bg-gray-800/50 transition-colors"
              >
                <div className="col-span-2">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-gray-400 text-sm line-clamp-1">
                    {product.description}
                  </p>
                </div>
                <span className="text-green-400 text-sm capitalize">
                  {product.category}
                </span>
                <span className="font-medium">
                  ETB {(product.price * 160).toFixed(0)}
                </span>
                <div className="flex items-center justify-between">
                  <span className={product.stock > 0 ? "text-white" : "text-red-400"}>
                    {product.stock}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-400 hover:text-red-300 text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

      </section>
    </main>
  )
}