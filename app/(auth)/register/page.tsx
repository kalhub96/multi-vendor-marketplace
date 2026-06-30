"use client"

import { useState } from "react"
import Link from "next/link"
import { UserRole } from "@/types"

export default function RegisterPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState<UserRole>("buyer")
    const [storeName, setStoreName] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleRegister = () => {
        setError("")

        if (!name || !email || !password){
            setError("Please fill in all fields")
            return
        }

        if(!email.includes("@")){
            setError("Please enter a valid email")
            return
        }

        if (role === "vendor" && !storeName){
            setError("Please enter your store name")
            return
        }
        setLoading(true)

        setTimeout(() => {
            const newUser ={
                id: 'user_${Date.now()}',
                name,
                email,
                role,
                createdAt: new Date().toISOString(),
            }

            localStorage.setItem("currentUser", JSON.stringify(newUser))

            if (role === "vendor"){
                window.location.href = "/vendor/dashbored"
            }else {
                window.location.href = "/"
            }

            setLoading(false)
        },1000)
    }

    return(
        <main className="min-h-screen bg-gray-950 text-white flex item-center justify-center px-4 py-12">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <Link
                    href="/"
                    className="text-green-400 font-bold text-2xl"
                    >
                        MultiMart
                    </Link>
                    <h1 className="text-2xl font-bold mt-4">Create an account</h1>
                    <p className="text-gray-400 mt-1">Join the marketplace today</p>
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-4">

                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">
                            I want to:
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                            onClick={() => setRole("buyer")}
                            className={`py-3 rounded-lg font-medium text-sm transition-colors ${ role === "buyer" ? "bg-green-400 text-gray-900" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
                            >
                                🛍️ Shop / Buy
                            </button>
                            <button
                            onClick={() => setRole("vendor")}
                            className={'py-3 rounded-lg font-medium text-sm transition-colors ${role === "vendor" ? "bg-green-400 text-gray-900" : "bg-gray-800 text-gray-300 hove:bg-gray-700"}'}
                            >
                                🏪 Sell / Vendor
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">
                            Full Name
                        </label>
                        <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full Name"
                        className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-green-400 placeholder-gray-500"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">
                            Password
                        </label>
                        <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-500"
                        />
                    </div>

                    {role === "vendor" && (
                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">
                                Store Name
                            </label>
                            <input 
                            type="text"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                            placeholder="Your store name"
                            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-500"
                            />
                        </div>
                    )}

                    <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full bg-green-400 text-gray-900 font-bold py-3 rounded-lg hover:bg-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </div>
                <p className="text-center text-gray-400 text-sm mt-6">
                    Already have an account?{""}
                    <Link
                    href="/login"
                    className="text-green-400 hover:underline font-medium"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </main>
    )
}
