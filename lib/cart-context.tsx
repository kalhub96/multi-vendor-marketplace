"use client"

import { createContext, useContext, useState, useEffect} from "react";
import { CartItem, Product } from "@/types";

type CartContextType = {
    cartItems: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem("cart");
            if (stored) setCartItems(JSON.parse(stored));
        } catch {
            setCartItems([]);
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems))
    }, [cartItems])

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
                return [...prev, { product, quantity }];
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
            cartTotal
            }}
            >
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