"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useVendors } from "@/lib/vendors-context"

export default function VerifyIdPage() {
  const router = useRouter()
  const { currentUser, loaded } = useAuth()
  const { getVendorByUserId, updateVerificationStatus } = useVendors()

  const [imagePreview, setImagePreview] = useState<string>("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<{ is_document: boolean; confidence: number } | null>(null)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // AUTH CHECK
  useEffect(() => {
    if (!loaded) return
    if (!currentUser) {
      router.push("/login")
      return
    }
    if (currentUser.role !== "vendor") {
      router.push("/")
    }
  }, [currentUser, loaded, router])

  if (!loaded || !currentUser) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </main>
    )
  }

  const vendor = getVendorByUserId(currentUser.id)

  // HANDLE IMAGE SELECTION
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    setError("")
    setResult(null)
    setImageFile(file)

    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // SUBMIT THE IMAGE FOR VERIFICATION
  const handleVerify = async () => {
    if (!imageFile || !vendor) return

    setUploading(true)
    setError("")
    setResult(null)

    try {
      // BUILD A FORM DATA OBJECT — THIS IS HOW WE SEND FILES OVER HTTP
      const formData = new FormData()
      formData.append("image", imageFile)

      const response = await fetch("http://localhost:5000/verify-id", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Verification request failed")
      }

      const data = await response.json()
      setResult(data)

      // UPDATE VENDOR STATUS BASED ON THE PREDICTION
      // We require reasonably high confidence before auto-approving
      if (data.is_document && data.confidence >= 70) {
        updateVerificationStatus(vendor.id, "verified")
      } else {
        updateVerificationStatus(vendor.id, "rejected")
      }
    } catch (err) {
      console.error(err)
      setError(
        "Could not reach the verification service. Make sure the ML server is running on port 5000."
      )
    } finally {
      setUploading(false)
    }
  }

  const handleReset = () => {
    setImagePreview("")
    setImageFile(null)
    setResult(null)
    setError("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* HEADER */}
      <section className="bg-gray-900 py-10 px-8">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/vendor/dashboard"
            className="text-gray-400 hover:text-green-400 text-sm transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mt-2">Verify Your Identity</h1>
          <p className="text-gray-400 mt-1">
            Upload a photo of your ID document to get a verified badge on your store
          </p>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-8 py-10">

        {/* CURRENT STATUS */}
        {vendor && (
          <div className="mb-6">
            <span className={`text-sm font-semibold px-4 py-2 rounded-full capitalize inline-block ${
              vendor.verificationStatus === "verified"
                ? "bg-green-900 text-green-300"
                : vendor.verificationStatus === "pending"
                ? "bg-blue-900 text-blue-300"
                : vendor.verificationStatus === "rejected"
                ? "bg-red-900 text-red-300"
                : "bg-gray-800 text-gray-300"
            }`}>
              Current status: {vendor.verificationStatus}
            </span>
          </div>
        )}

        {vendor?.verificationStatus === "verified" ? (
          // ALREADY VERIFIED — NOTHING MORE TO DO
          <div className="bg-green-900/50 border border-green-500 rounded-xl p-6 text-center">
            <p className="text-4xl mb-3">✓</p>
            <p className="text-green-300 font-semibold text-lg">
              Your account is verified!
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Buyers can see your verified badge on your store.
            </p>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl p-6">

            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            {/* UPLOAD AREA */}
            {imagePreview ? (
              <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="ID preview"
                  className="w-full h-full object-cover"
                />
                {!uploading && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="absolute top-2 right-2 bg-gray-900/80 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750 border-2 border-dashed border-gray-700 transition-colors mb-4">
                <span className="text-4xl mb-2">🪪</span>
                <span className="text-gray-400 text-sm">
                  Click to upload your ID document
                </span>
                <span className="text-gray-600 text-xs mt-1">
                  PNG or JPG
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}

            {/* RESULT DISPLAY */}
            {result && (
              <div className={`px-4 py-3 rounded-lg mb-4 text-sm ${
                result.is_document && result.confidence >= 70
                  ? "bg-green-900/50 border border-green-500 text-green-300"
                  : "bg-red-900/50 border border-red-500 text-red-300"
              }`}>
                <p className="font-semibold">
                  {result.is_document && result.confidence >= 70
                    ? "✓ Document verified!"
                    : "✗ Could not verify this image"}
                </p>
                <p className="mt-1">
                  Model confidence: {result.confidence}%
                  {" — "}
                  {result.is_document ? "detected as a document" : "not detected as a document"}
                </p>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="button"
              onClick={handleVerify}
              disabled={!imageFile || uploading}
              className="w-full bg-green-400 text-gray-900 font-bold py-3 rounded-full hover:bg-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Verifying..." : "Submit for Verification"}
            </button>

            <p className="text-gray-500 text-xs mt-4 text-center">
              This is an automated check. For this demo, any clear document-style image will be accepted.
            </p>
          </div>
        )}

      </section>
    </main>
  )
}