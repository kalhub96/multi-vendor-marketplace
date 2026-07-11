"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { CartItem, Product } from "@/types"
import { useAuth } from "@/lib/auth-context"

type CartContextType = {
    cartItems: CartItem[]
    addToCart: (product: Product, quantity: number) => void
    removeFromCart: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    clearCart: () => void
    cartCount: number
    cartTotal: number
    loaded: boolean
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, loaded: authLoaded } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  // BUILD A CART KEY SPECIFIC TO THE LOGGED-IN USER
  // Guests (not logged in) share a temporary "guest" cart
  const getCartKey = (userId: string | undefined) =>
    userId ? `cart_${userId}` : "cart_guest"

  // LOAD THE CORRECT CART WHENEVER THE LOGGED-IN USER CHANGES
  useEffect(() => {
    if (!authLoaded) return

    try {
      const key = getCartKey(currentUser?.id)
      const stored = localStorage.getItem(key)
      setCartItems(stored ? JSON.parse(stored) : [])
    } catch {
      setCartItems([])
    }
    setLoaded(true)
  }, [currentUser, authLoaded])

  // SAVE TO THE CORRECT USER'S KEY EVERY TIME CART CHANGES
  useEffect(() => {
    if (loaded && authLoaded) {
      const key = getCartKey(currentUser?.id)
      localStorage.setItem(key, JSON.stringify(cartItems))
    }
  }, [cartItems, loaded, authLoaded, currentUser])

    const addToCart = (product: Product, quantity: number) => {
        setCartItems((prev) => {
            const existing= prev.find(item => item.product.id === product.id)

            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } 
                return [...prev, { product, quantity }]
        })
    }

    const removeFromCart = (productId: string) => {
        setCartItems((prev) => prev.filter(item => item.product.id !== productId))
    }

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) return
        setCartItems((prev) =>
            prev.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
            )
        )
    }

    const clearCart = () => setCartItems([])

    const cartCount =cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const cartTotal = cartItems.reduce(
        (sum, item) => sum + item.product.price * 160 * item.quantity, 0
    )

    return (
        <CartContext.Provider
        value={{ 
            cartItems, 
            addToCart, 
            removeFromCart, 
            updateQuantity, 
            clearCart, 
            cartCount, 
            cartTotal,
            loaded,
            }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}