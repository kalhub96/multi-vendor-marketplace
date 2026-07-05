import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import{ CartProvider } from "@/lib/cart-context"

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
        <CartProvider>
        <Navbar />
        {children}
        </CartProvider>
      </body>
    </html>
  )
}