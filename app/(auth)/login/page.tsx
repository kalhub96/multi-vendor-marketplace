"use client"

import { use , useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { users } from "@/data/users"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = () => {
        console.log("CLICKED")
        setError("")

        if (!email || !password) {
                setError("please fill in all fields")
                return
        }
        if (!email.includes("@")) {
            setError("please enter a vaild email")
            return
        }

        setLoading(true)
        setTimeout(() => {
        const user = users.find((u) => u.email === email)

        if (!user) {
            setError("no account found with this email")
            setLoading(false)
            return
        }

        localStorage.setItem("currentUser", JSON.stringify(user))

        if (user.role === "admin"){
            router.push("/admin/dashboard")
        }else if (user.role === "vendor"){
            router.push("/vendor/dashboard")
        }
        else{
            router.push("/")
        }

        setLoading(false)
    },1000)
}

return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">

            <div className="bg-gray-900 rounded-2xl p-8">

                <div className="text-center mb-8">
                    <Link href="/" 
                    className="text-green-400 font-bold text-2xl">
                        MultiMart
                    </Link>
                    <h1 className="text-2xl font-bold mt-4">Welcome back</h1>
                    <p className="text-gray-400 mt-1">Sign in to your account</p>
                </div>
                
                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-300 -px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={(e) => {
                    e.preventDefault()
                    handleLogin()
                    }}
                    className="flex flex-col gap-4"
                    >
                        <div>
                            <label className="test-sm text-gray-400 mb-1 block">
                                Email Address
                            </label>
                            <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-500"
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
                            placeholder="••••••••"
                            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-500"
                            />
                        </div>
                        <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-400 text-gray-900 font-bold py-3 rounded-lg hover:bg-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? "signin in..." : "sign in"}
                        </button>
                    </form>
                {/* MOCK USER HINTS */}
                <div className="mt-6 bg-gray-800 rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-2 font-medium">
                        Test accounts:
                    </p>
                    <p className="text-xs text-gray-500">
                        Buyer: john@example.com
                    </p>
                    <p className="text-xs text-gray-500">
                        Vendor: sarah@example.com
                    </p>
                    <p className="text-xs text-gray-500">
                        Admin: admin@example.com
                    </p>
                </div>
                <p className="text-center text-gray-400 text-sm mt-6">
                        Don't have an account?{" "}
                    <Link
                    href="/register"
                    className="text-green-400 hover:underline font-medium"
                    >
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    </main>
)
}