"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { Order, OrderStatus, CartItem, Product, ProductCategory } from "@/types"

type OrdersContextType = {
  orders: Order[]
  createOrder: (order: Omit<Order, "id" | "createdAt">) => Promise<Order | null>
  cancelOrder: (orderId: string) => Promise<void>
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>
  getOrdersByBuyer: (buyerId: string) => Order[]
  getOrdersByVendor: (vendorId: string) => Order[]
  refetchOrders: () => Promise<void>
  loaded: boolean
}

const OrdersContext = createContext<OrdersContextType | null>(null)

// SHAPE OF WHAT SUPABASE RETURNS WHEN WE JOIN order_items + products
type OrderRowWithItems = {
  id: string
  buyer_id: string
  total_amount: number
  status: string
  shipping_full_name: string
  shipping_phone: string
  shipping_city: string
  shipping_address: string
  payment_method: string
  created_at: string
  order_items: {
    id: string
    quantity: number
    price_at_purchase: number
    products: {
      id: string
      vendor_id: string
      name: string
      description: string | null
      price: number
      image: string | null
      category: string
      stock: number
      created_at: string
    } | null
  }[]
}

// CONVERT A JOINED DATABASE ROW INTO OUR APP'S Order TYPE
function mapRowToOrder(row: OrderRowWithItems): Order {
  const items: CartItem[] = row.order_items
    .filter((item) => item.products !== null)
    .map((item) => {
      const p = item.products!
      const product: Product = {
        id: p.id,
        vendorId: p.vendor_id,
        name: p.name,
        description: p.description ?? "",
        price: p.price,
        image: p.image ?? "",
        category: p.category as ProductCategory,
        stock: p.stock,
        createdAt: p.created_at,
      }
      return { product, quantity: item.quantity }
    })

  return {
    id: row.id,
    buyerId: row.buyer_id,
    items,
    totalAmount: row.total_amount,
    status: row.status as OrderStatus,
    shippingInfo: {
      fullName: row.shipping_full_name,
      phone: row.shipping_phone,
      city: row.shipping_city,
      address: row.shipping_address,
    },
    paymentMethod: row.payment_method as Order["paymentMethod"],
    createdAt: row.created_at,
  }
}

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loaded, setLoaded] = useState(false)

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*, products(*))")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Failed to fetch orders:", error.message)
      setOrders([])
    } else {
      setOrders((data as unknown as OrderRowWithItems[]).map(mapRowToOrder))
    }
    setLoaded(true)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // CREATE A NEW ORDER — INSERT ORDER, THEN INSERT ITS ITEMS
  const createOrder = async (
    orderData: Omit<Order, "id" | "createdAt">
  ): Promise<Order | null> => {
    // STEP 1 — INSERT THE ORDER ITSELF
    const { data: orderRow, error: orderError } = await supabase
      .from("orders")
      .insert({
        buyer_id: orderData.buyerId,
        total_amount: orderData.totalAmount,
        status: orderData.status,
        shipping_full_name: orderData.shippingInfo.fullName,
        shipping_phone: orderData.shippingInfo.phone,
        shipping_city: orderData.shippingInfo.city,
        shipping_address: orderData.shippingInfo.address,
        payment_method: orderData.paymentMethod,
      })
      .select()
      .single()

    if (orderError || !orderRow) {
      console.error("Failed to create order:", orderError?.message)
      return null
    }

    // STEP 2 — INSERT ALL THE ORDER ITEMS, LINKED TO THAT ORDER
    const itemsToInsert = orderData.items.map((item) => ({
      order_id: orderRow.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price_at_purchase: item.product.price,
    }))

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsToInsert)

    if (itemsError) {
      console.error("Failed to create order items:", itemsError.message)
      return null
    }

    // BUILD THE COMPLETE ORDER OBJECT FOR LOCAL STATE
    const newOrder: Order = {
      id: orderRow.id,
      buyerId: orderRow.buyer_id,
      items: orderData.items,
      totalAmount: orderRow.total_amount,
      status: orderRow.status as OrderStatus,
      shippingInfo: orderData.shippingInfo,
      paymentMethod: orderRow.payment_method as Order["paymentMethod"],
      createdAt: orderRow.created_at,
    }

    setOrders((prev) => [newOrder, ...prev])
    return newOrder
  }

  // UPDATE ORDER STATUS (used by both cancel and vendor status progression)
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)

    if (error) {
      console.error("Failed to update order status:", error.message)
      return
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    )
  }

  const cancelOrder = (orderId: string) =>
    updateOrderStatus(orderId, "cancelled")

  const getOrdersByBuyer = (buyerId: string) => {
    return orders.filter((o) => o.buyerId === buyerId)
  }

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
        refetchOrders: fetchOrders,
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