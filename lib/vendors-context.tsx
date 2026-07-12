"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { Vendor, VerificationStatus } from "@/types"
import { vendors as initialVendors } from "@/data/users"

type VendorsContextType = {
  vendors: Vendor[]
  updateVerificationStatus: (vendorId: string, status: VerificationStatus) => void
  getVendorByUserId: (userId: string) => Vendor | undefined
  loaded: boolean
}

const VendorsContext = createContext<VendorsContextType | null>(null)

export function VendorsProvider({ children }: { children: React.ReactNode }) {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loaded, setLoaded] = useState(false)

  // LOAD VENDORS FROM LOCALSTORAGE OR USE MOCK DATA
  useEffect(() => {
    try {
      const stored = localStorage.getItem("vendors")
      if (stored) {
        setVendors(JSON.parse(stored))
      } else {
        setVendors(initialVendors)
        localStorage.setItem("vendors", JSON.stringify(initialVendors))
      }
    } catch {
      setVendors(initialVendors)
    }
    setLoaded(true)
  }, [])

  // SAVE TO LOCALSTORAGE WHENEVER VENDORS CHANGE
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("vendors", JSON.stringify(vendors))
    }
  }, [vendors, loaded])

  // UPDATE A VENDOR'S VERIFICATION STATUS
  const updateVerificationStatus = (vendorId: string, status: VerificationStatus) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, verificationStatus: status } : v))
    )
  }

  // GET A VENDOR BY THEIR USER ACCOUNT ID
  const getVendorByUserId = (userId: string) => {
    return vendors.find((v) => v.userId === userId)
  }

  return (
    <VendorsContext.Provider
      value={{ vendors, updateVerificationStatus, getVendorByUserId, loaded }}
    >
      {children}
    </VendorsContext.Provider>
  )
}

export function useVendors() {
  const context = useContext(VendorsContext)
  if (!context) {
    throw new Error("useVendors must be used within a VendorsProvider")
  }
  return context
}