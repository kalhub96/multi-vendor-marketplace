"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SearchBar() {
    const router = useRouter()
    const [query, setQuery] = useState("")

    //HANDLE SEARCH SUBMIT
    const handleSearch = () => {
        if (query.trim() === "") {
            router.push("/products")
            return
        }
        router.push(`/products?search=${encodeURIComponent(query.trim())}`)
    }

    //HANDLE KEY ENTERY
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter"){
            handleSearch()
        }
    }

    return(
        <div className="hidden md:block relative w-96">
            <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products, vendors, or categories..."
            className="w-full px-4 py-2 pr-10 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"/>

            <button
            type="button"
            onClick={handleSearch}
            className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors px-2">
                🔍
            </button>
        </div>
    )
}