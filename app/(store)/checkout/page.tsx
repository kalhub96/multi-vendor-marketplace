"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { useOrders } from "@/lib/orders-context"
import { PaymentMethod } from "@/types"

const paymentOptions: { value: PaymentMethod; label: string; hint: string }[] = [
  { value: "telebirr", label: "Telebirr", hint: "Pay instantly with Telebirr wallet" },
  { value: "chapa", label: "Chapa", hint: "Pay with card or bank via Chapa" },
  { value: "cash_on_delivery", label: "Cash on Delivery", hint: "Pay when your order arrives" },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { currentUser, loaded: authLoaded } = useAuth()
  const { cartItems, cartTotal, clearCart, loaded: cartLoaded } = useCart()
  const { createOrder } = useOrders()

  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [address, setAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("telebirr")
  const [formError, setFormError] = useState("")
  const [processing, setProcessing] = useState(false)

  // AUTH CHECK
  useEffect(() => {
    if (!authLoaded) return
    if (!currentUser) {
      router.push("/login")
    }
  }, [currentUser, authLoaded, router])

  // PRE-FILL NAME FROM ACCOUNT
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.name)
    }
  }, [currentUser])

  // REDIRECT IF CART IS EMPTY
  useEffect(() => {
    if (cartLoaded && cartItems.length === 0 && !processing) {
      router.push("/cart")
    }
  }, [cartLoaded, cartItems, router, processing])

  if (!authLoaded || !cartLoaded || !currentUser || cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Loading checkout...</p>
      </main>
    )
  }

  const handlePlaceOrder = () => {
    setFormError("")

    if (!fullName.trim() || !phone.trim() || !city.trim() || !address.trim()) {
      setFormError("Please fill in all shipping details")
      return
    }

    if (phone.trim().length < 9) {
      setFormError("Please enter a valid phone number")
      return
    }

    setProcessing(true)

    // SIMULATE PAYMENT PROCESSING
    setTimeout(() => {
      createOrder({
        buyerId: currentUser.id,
        items: cartItems,
        totalAmount: cartTotal,
        status: "pending",
        shippingInfo: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          city: city.trim(),
          address: address.trim(),
        },
        paymentMethod,
      })

      clearCart()
      router.push("/orders?success=true")
    }, 1800)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* HEADER */}
      <section className="bg-gray-900 py-10 px-8 text-center">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-gray-400 mt-2">
          Complete your order in a few steps
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT — FORM */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {formError && (
              <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">
                {formError}
              </div>
            )}

            {/* SHIPPING INFO */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-400 mb-1 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0911223344"
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Addis Ababa"
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-400 mb-1 block">
                    Delivery Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, landmark, house number..."
                    rows={2}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4">Payment Method</h2>
              <div className="flex flex-col gap-3">
                {paymentOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                      paymentMethod === option.value
                        ? "border-green-400 bg-gray-800"
                        : "border-gray-800 bg-gray-800/50 hover:bg-gray-800"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === option.value}
                      onChange={() => setPaymentMethod(option.value)}
                      className="w-4 h-4 accent-green-400"
                    />
                    <div>
                      <p className="font-medium">{option.label}</p>
                      <p className="text-gray-400 text-sm">{option.hint}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT — ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-xl p-6 sticky top-6">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              <div className="flex flex-col gap-3 mb-4 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex-1 pr-2">
                      <p className="font-medium line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-green-400 font-semibold whitespace-nowrap">
                      ETB {(item.product.price * 160 * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-800 pt-4 flex flex-col gap-2">
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Subtotal</span>
                  <span>ETB {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-gray-800">
                  <span>Total</span>
                  <span className="text-green-400">
                    ETB {cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={processing}
                className="w-full bg-green-400 text-gray-900 font-bold py-4 rounded-full hover:bg-green-300 transition-colors mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {processing ? "Processing Payment..." : "Place Order"}
              </button>

              <Link
                href="/cart"
                className="block text-center text-gray-400 hover:text-white mt-4 text-sm transition-colors"
              >
                ← Back to Cart
              </Link>
            </div>
          </div>

        </div>
      </section>
    </main>
  )
}