import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import{ CartProvider } from "@/lib/cart-context"
import { RatingsProvider } from "@/lib/ratings-context"
import { AuthProvider } from "@/lib/auth-context"
import { ProductsProvider } from "@/lib/products-context"
import { UsersProvider } from "@/lib/users-context"
import { OrdersProvider } from "@/lib/orders-context"
import { VendorsProvider } from "@/lib/vendors-context"
import { Toaster } from "react-hot-toast"

const geistSans = Geist({
  variable: "--font-geist-sans", 
  subsets:["latin"],
}) 

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "MultiMart — Ethiopian Marketplace",
  description: "Shop from the best vendors all in one place",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #374151",
          },
          success: {
            iconTheme: {
              primary: "#4ade80",
              secondary: "#1f2937",
            },
          },
        }}/>
        <AuthProvider>
  <UsersProvider>
    <VendorsProvider>
      <ProductsProvider>
        <OrdersProvider>
          <CartProvider>
            <RatingsProvider>
              <Navbar />
              {children}
            </RatingsProvider>
          </CartProvider>
        </OrdersProvider>
      </ProductsProvider>
    </VendorsProvider>
  </UsersProvider>
</AuthProvider>
      </body>
    </html>
  )
}