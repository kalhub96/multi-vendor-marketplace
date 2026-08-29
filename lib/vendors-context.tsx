"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { Vendor, VerificationStatus } from "@/types"

type VendorsContextType = {
  vendors: Vendor[]
  updateVerificationStatus: (vendorId: string, status: VerificationStatus) => Promise<void>
  getVendorByUserId: (userId: string) => Vendor | undefined
  refetchVendors: () => Promise<void>
  loaded: boolean
}

const VendorsContext = createContext<VendorsContextType | null>(null)

// CONVERT A DATABASE ROW INTO OUR APP'S Vendor TYPE
function mapRowToVendor(row: {
  id: string
  user_id: string
  store_name: string
  description: string | null
  logo: string | null
  verification_status: string
  created_at: string
}): Vendor {
  return {
    id: row.id,
    userId: row.user_id,
    storeName: row.store_name,
    description: row.description ?? "",
    logo: row.logo ?? "",
    verificationStatus: row.verification_status as VerificationStatus,
    createdAt: row.created_at,
  }
}

export function VendorsProvider({ children }: { children: React.ReactNode }) {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loaded, setLoaded] = useState(false)

  const fetchVendors = async () => {
    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Failed to fetch vendors:", error.message)
      setVendors([])
    } else {
      setVendors(data.map(mapRowToVendor))
    }
    setLoaded(true)
  }

  useEffect(() => {
    fetchVendors()
  }, [])

  const updateVerificationStatus = async (
    vendorId: string,
    status: VerificationStatus
  ) => {
    const { error } = await supabase
      .from("vendors")
      .update({ verification_status: status })
      .eq("id", vendorId)

    if (error) {
      console.error("Failed to update verification status:", error.message)
      return
    }

    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId ? { ...v, verificationStatus: status } : v
      )
    )
  }

  const getVendorByUserId = (userId: string) => {
    return vendors.find((v) => v.userId === userId)
  }

  return (
    <VendorsContext.Provider
      value={{
        vendors,
        updateVerificationStatus,
        getVendorByUserId,
        refetchVendors: fetchVendors,
        loaded,
      }}
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