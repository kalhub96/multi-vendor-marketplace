"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useOrders } from "@/lib/orders-context"
import { useVendors } from "@/lib/vendors-context"
import { OrderStatus } from "@/types"
import toast from "react-hot-toast"

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-yellow-900 text-yellow-300",
  processing: "bg-blue-900 text-blue-300",
  shipped: "bg-purple-900 text-purple-300",
  delivered: "bg-green-900 text-green-300",
  cancelled: "bg-red-900 text-red-300",
}

// WHAT THE NEXT STATUS SHOULD BE, AND THE BUTTON LABEL FOR IT
const nextStatusMap: Partial<Record<OrderStatus, { next: OrderStatus; label: string }>> = {
  pending: { next: "processing", label: "Mark as Processing" },
  processing: { next: "shipped", label: "Mark as Shipped" },
  shipped: { next: "delivered", label: "Mark as Delivered" },
}

const filterTabs: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
]

export default function VendorOrdersPage() {
  const router = useRouter()
  const { currentUser, loaded } = useAuth()
  const { getOrdersByVendor, updateOrderStatus } = useOrders()
  const { getVendorByUserId } = useVendors()
  const [activeFilter, setActiveFilter] = useState<OrderStatus | "all">("all")

  // AUTH CHECK
  useEffect(() => {
    if (!loaded) return
    if (!currentUser) {
      router.push("/login")
      return
    }
    if (currentUser.role !== "vendor") {
      router.push("/")
    }
  }, [currentUser, loaded, router])

  if (!loaded || !currentUser) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-foreground-secondary">Loading orders...</p>
      </main>
    )
  }

  // FIND THIS VENDOR'S STORE
  const vendorStore = getVendorByUserId(currentUser.id)

  const vendorOrders = vendorStore
    ? getOrdersByVendor(vendorStore.id).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : []

  const filteredOrders =
    activeFilter === "all"
      ? vendorOrders
      : vendorOrders.filter((o) => o.status === activeFilter)

  // ONLY SHOW ITEMS FROM THIS VENDOR WITHIN AN ORDER
  const getVendorItems = (order: (typeof vendorOrders)[number]) =>
    vendorStore
      ? order.items.filter((item) => item.product.vendorId === vendorStore.id)
      : []

  const handleAdvanceStatus = async (orderId: string, currentStatus: OrderStatus) => {
    const next = nextStatusMap[currentStatus]
    if (!next) return
    await updateOrderStatus(orderId, next.next)
    toast.success(`Order marked as ${next.next}`)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* HEADER */}
      <section className="bg-background-secondary py-10 px-8">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/vendor/dashboard"
            className="text-foreground-secondary hover:text-green-400 text-sm transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mt-2">Orders</h1>
          <p className="text-foreground-secondary mt-1">
            {vendorOrders.length} order(s) containing your products
          </p>
        </div>
      </section>

      {/* FILTER TABS */}
      <section className="bg-background-secondary border-t border-border px-8 py-4">
        <div className="max-w-5xl mx-auto flex gap-3 overflow-x-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveFilter(tab.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === tab.value
                  ? "bg-green-400 text-gray-900"
                  : "bg-background-tertiary text-foreground-secondary hover:opacity-80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-8 py-10">

        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 text-foreground-secondary">
            No orders found for this filter
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredOrders.map((order) => {
              const vendorItems = getVendorItems(order)
              const vendorSubtotal = vendorItems.reduce(
                (sum, item) => sum + item.product.price * 160 * item.quantity,
                0
              )
              const action = nextStatusMap[order.status]
              const isCancelled = order.status === "cancelled"

              return (
                <div
                  key={order.id}
                  className={`bg-background-secondary rounded-xl p-6 ${isCancelled ? "opacity-60" : ""}`}
                >
                  {/* ORDER HEADER */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                    <div>
                      <p className="font-semibold">
                        Order #{order.id.replace("order_", "")}
                      </p>
                      <p className="text-foreground-secondary text-sm mt-1">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-foreground-secondary text-sm mt-1">
                        Buyer: {order.shippingInfo?.fullName || "Unknown"}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusStyles[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* VENDOR'S ITEMS IN THIS ORDER */}
<div className="flex flex-col gap-3 mb-4">
  {vendorItems.map((item) => (
    <div
      key={item.product.id}
      className="flex items-center justify-between bg-background-tertiary rounded-lg p-3 sm:p-4 gap-3"
    >
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-background-secondary shrink-0">
          {item.product.image && item.product.image.startsWith("data:") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-foreground-secondary text-xs">
              Img
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-medium truncate">{item.product.name}</p>
          <p className="text-foreground-secondary text-sm">
            Qty: {item.quantity}
          </p>
        </div>
      </div>
      <p className="text-green-400 font-bold text-sm sm:text-base whitespace-nowrap">
        ETB {(item.product.price * 160 * item.quantity).toFixed(2)}
      </p>
    </div>
  ))}
</div>

                  {/* SHIPPING INFO */}
                  <div className="bg-background-tertiary rounded-lg p-4 mb-4">
                    <p className="text-foreground-secondary text-xs uppercase tracking-wide mb-2">
                      Shipping To
                    </p>
                    <p className="text-sm">{order.shippingInfo?.fullName || "N/A"}</p>
                    <p className="text-sm text-foreground-secondary">{order.shippingInfo?.phone || "N/A"}</p>
                    <p className="text-sm text-foreground-secondary">
                        {order.shippingInfo?.address || "N/A"}, {order.shippingInfo?.city || "N/A"}
                    </p>
                  </div>

                  {/* FOOTER — SUBTOTAL + ACTION */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <p className="text-foreground-secondary">
                      Your items total:{" "}
                      <span className="text-foreground font-bold">
                        ETB {vendorSubtotal.toFixed(2)}
                      </span>
                    </p>

                    {isCancelled ? (
                      <span className="text-red-400 text-sm font-medium">
                        Order was cancelled by buyer
                      </span>
                    ) : action ? (
                      <button
                        type="button"
                        onClick={() => handleAdvanceStatus(order.id, order.status)}
                        className="bg-green-400 text-gray-900 font-semibold px-5 py-2 rounded-full hover:bg-green-300 transition-colors text-sm"
                      >
                        {action.label}
                      </button>
                    ) : (
                      <span className="text-green-400 text-sm font-medium">
                        ✓ Delivered
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}