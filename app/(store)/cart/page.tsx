"use client"

import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import toast from "react-hot-toast"

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, loaded } = useCart()

  if (!loaded) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-foreground-secondary">Loading cart...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">

      <section className="bg-background-secondary py-10 px-8 text-center">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <p className="text-foreground-secondary mt-2">
          {cartItems.length === 0
            ? "Your cart is empty"
            : `${cartItems.length} item(s) in your cart`}
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-8 py-12">

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-6">🛒</p>
            <p className="text-foreground-secondary mb-6">
              You haven't added anything yet
            </p>
            <Link
              href="/products"
              className="bg-green-400 text-gray-900 font-semibold px-6 py-3 rounded-full hover:bg-green-300 transition-colors"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-8">

            <div className="flex flex-col gap-4">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-background-secondary rounded-xl p-4 sm:p-6 flex flex-col gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-background-tertiary w-20 h-20 sm:w-24 sm:h-24 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-foreground-secondary text-xs">No Image</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-green-400 text-xs uppercase tracking-wide">
                        {item.product.category}
                      </span>
                      <h3 className="font-semibold text-base sm:text-lg mt-1 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-foreground-secondary font-bold mt-1">
                        ETB {(item.product.price * 160).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 bg-background-tertiary rounded-full px-4 py-2 w-fit">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="text-foreground-secondary hover:text-foreground font-bold text-lg"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="text-foreground-secondary hover:text-foreground font-bold text-lg"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-foreground font-bold">
                      ETB {(item.product.price * 160 * item.quantity).toFixed(2)}
                    </p>
                    <button
                      type="button"
                      onClick={() => {removeFromCart(item.product.id)
                        toast.success("Item removed from cart")
                      }}
                      className="text-red-400 text-sm hover:text-red-300 mt-1 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-background-secondary rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="flex justify-between text-foreground-secondary mb-2">
                <span>Subtotal</span>
                <span>ETB {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-foreground-secondary mb-2">
                <span>Shipping</span>
                <span className="text-green-400">Free</span>
              </div>
              <div className="border-t border-border my-4" />
              <div className="flex justify-between text-foreground font-bold text-xl mb-6">
                <span>Total</span>
                <span className="text-green-400">ETB {cartTotal.toFixed(2)}</span>
              </div>
              <Link
              href="/checkout"
              className="block text-center w-full bg-green-400 text-gray-900 font-bold py-4 rounded-full hover:bg-green-300 transition-colors text-lg">
                Proceed to Checkout
              </Link>
              <Link
                href="/products"
                className="block text-center text-foreground-secondary hover:text-foreground mt-4 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>

          </div>
        )}
      </section>
    </main>
  )
}