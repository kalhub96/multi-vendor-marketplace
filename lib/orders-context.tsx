"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { Order, OrderStatus } from "@/types"
import { orders as initialOrders } from "@/data/orders"

type OrdersContextType = {
  orders: Order[]
  createOrder: (order: Omit<Order, "id" | "createdAt">) => Order
  cancelOrder: (orderId: string) => void
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  getOrdersByBuyer: (buyerId: string) => Order[]
  getOrdersByVendor: (vendorId: string) => Order[]
  loaded: boolean
}

const OrdersContext = createContext<OrdersContextType | null>(null)

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loaded, setLoaded] = useState(false)

  // LOAD ORDERS FROM LOCALSTORAGE OR USE MOCK DATA
  useEffect(() => {
    try {
      const stored = localStorage.getItem("orders")
      if (stored) {
        setOrders(JSON.parse(stored))
      } else {
        setOrders(initialOrders)
        localStorage.setItem("orders", JSON.stringify(initialOrders))
      }
    } catch {
      setOrders(initialOrders)
    }
    setLoaded(true)
  }, [])

  // SAVE TO LOCALSTORAGE WHENEVER ORDERS CHANGE
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("orders", JSON.stringify(orders))
    }
  }, [orders, loaded])

  // CREATE A NEW ORDER
const createOrder = (orderData: Omit<Order, "id" | "createdAt">) => {
  const newOrder: Order = {
    ...orderData,
    id: `order_${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  setOrders((prev) => [newOrder, ...prev])
  return newOrder
}

  // CANCEL AN ORDER
  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "cancelled" as OrderStatus } : o
      )
    )
  }

  // UPDATE ORDER STATUS (used by vendor order management later)
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    )
  }

  // GET ALL ORDERS FOR A SPECIFIC BUYER
  const getOrdersByBuyer = (buyerId: string) => {
    return orders.filter((o) => o.buyerId === buyerId)
  }

  // GET ALL ORDERS CONTAINING PRODUCTS FROM A SPECIFIC VENDOR
  const getOrdersByVendor = (vendorId: string) => {
    return orders.filter((o) =>
      o.items.some((item) => item.product.vendorId === vendorId)
    )
  }

  return (
   <OrdersContext.Provider
  value={{
    orders,
    createOrder,
    cancelOrder,
    updateOrderStatus,
    getOrdersByBuyer,
    getOrdersByVendor,
    loaded,
  }}
>
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider")
  }
  return context
}