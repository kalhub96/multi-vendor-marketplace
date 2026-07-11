"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useOrders } from "@/lib/orders-context"
import { OrderStatus } from "@/types"

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-yellow-900 text-yellow-300",
  processing: "bg-blue-900 text-blue-300",
  shipped: "bg-purple-900 text-purple-300",
  delivered: "bg-green-900 text-green-300",
  cancelled: "bg-red-900 text-red-300",
}

export default function MyOrdersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const showSuccess = searchParams.get("success") === "true"
  const { currentUser, loaded } = useAuth()
  const { getOrdersByBuyer, cancelOrder } = useOrders()
  const [confirmingCancel, setConfirmingCancel] = useState<string | null>(null)

  // AUTH CHECK
  useEffect(() => {
    if (!loaded) return
    if (!currentUser) {
      router.push("/login")
    }
  }, [currentUser, loaded, router])

  if (!loaded || !currentUser) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Loading orders...</p>
      </main>
    )
  }

  const myOrders = getOrdersByBuyer(currentUser.id).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const canCancel = (status: OrderStatus) =>
    status === "pending" || status === "processing"

  const handleCancelClick = (orderId: string) => {
    setConfirmingCancel(orderId)
  }

  const handleConfirmCancel = (orderId: string) => {
    cancelOrder(orderId)
    setConfirmingCancel(null)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* HEADER */}
      <section className="bg-gray-900 py-10 px-8 text-center">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-gray-400 mt-2">
          {myOrders.length === 0
            ? "You haven't placed any orders yet"
            : `${myOrders.length} order(s) placed`}
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-8 py-12">
        {showSuccess && (
            <div className="bg-green-900/50 border border-green-500 text-green-300 px-6 py-4 rounded-lg mb-8">
                ✓ Your order has been placed successfully!
                </div>
            )}

          {myOrders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-6">📦</p>
            <p className="text-gray-400 mb-6">
              Your order history will show up here
            </p>
            <Link
              href="/products"
              className="bg-green-400 text-gray-900 font-semibold px-6 py-3 rounded-full hover:bg-green-300 transition-colors"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {myOrders.map((order) => (
              <div key={order.id} className="bg-gray-900 rounded-xl p-6">

                {/* ORDER HEADER */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
                  <div>
                    <p className="font-semibold">
                      Order #{order.id.replace("order_", "")}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* ORDER ITEMS */}
                <div className="flex flex-col gap-3 mb-4">
                  {order.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between bg-gray-800 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700 shrink-0">
                          {item.product.image && item.product.image.startsWith("data:") ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                              Img
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-gray-400 text-sm">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-green-400 font-bold">
                        ETB {(item.product.price * 160 * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* ORDER FOOTER */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <p className="text-gray-400">
                    Total:{" "}
                    <span className="text-white font-bold">
                      ETB {order.totalAmount.toFixed(2)}
                    </span>
                  </p>

                  {canCancel(order.status) && (
                    confirmingCancel === order.id ? (
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 text-sm">
                          Cancel this order?
                        </span>
                        <button
                          type="button"
                          onClick={() => handleConfirmCancel(order.id)}
                          className="text-red-400 hover:text-red-300 text-sm font-semibold transition-colors"
                        >
                          Yes, Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingCancel(null)}
                          className="text-gray-400 hover:text-white text-sm transition-colors"
                        >
                          Keep Order
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleCancelClick(order.id)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                      >
                        Cancel Order
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}