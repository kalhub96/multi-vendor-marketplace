"use client"

import Link from "next/link"
import { useProducts } from "@/lib/products-context"
import { motion } from "framer-motion"

export default function Home() {
  const { products } = useProducts()

  return (
    <main>
      <section className="bg-emerald-500 text-gray-900 py-20 px-8 text-center overflow-hidden relative">
        <motion.div
        className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full"
        animate={{y: [0,20,0]}}
        transition={{duration:6, repeat: Infinity, ease: "easeInOut"}}/>
          <motion.div
          className="absolute -bottom-16 -right-10 w-56 h-56 bg-white/10 rounded-full"
          animate={{y: [0,20,0]}}
          transition={{duration:7, repeat: Infinity, ease: "easeInOut"}}/>
          <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
          className="text-4xl font-bold mb-4 relative">
            Welcome to multiMart
          </motion.div>

          <motion.p
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6, delay: 0.15}}
          className="text-lg mb-8 relative">
            Shop from the best vendors all one place
          </motion.p>

          <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{ duration: 0.6, delay: 0.3}}
          className="relative">
            <Link href="/products">
            <motion.span
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.97}}
            className="inline-block bg-gray-900 text-white font-semibold px-6 py-3 rounded-full hover:bg-gray-800 transition-colors cursor-pointer">
              Shop Now
            </motion.span>
            </Link>
          </motion.div>
      </section>
      
      <section className="py-16 px-8">
        <motion.h2
        initial={{ opacity: 0, y: 10}}
        whileInView={{ opacity: 1, y: 0}}
        viewport={{once: true}}
        transition={{duration: 0.5}}
        className="text-2xl font-bold mb-8 text-center">
          Featured Products
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20}}
            whileInView={{ opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.4, delay: index*0.05}}
            className="text-2xl font-bold mb-8 text-center"
            >
              <Link
              href={`/products/${product.id}`}
              className="block border rounded-lg p-4 hover:shadow-lg transition-shadow group">

                <div className="bg-gray-100 h-48 rounded-md mb-4 flex items-center justify-center overflow-hidden">
                  {product.image && product.image.startsWith("data:") ? (
                    <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"/>
                  ) : (
                    <span className="text-gray-400">N0 Image Yet</span>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  )
}