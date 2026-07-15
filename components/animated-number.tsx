"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"

type AnimatedNumberProps = {
  value: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
}

export function AnimatedNumber({
  value,
  duration = 1,
  decimals = 0,
  prefix = "",
  suffix = "",
}: AnimatedNumberProps) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) =>
    latest.toFixed(decimals)
  )
  const [display, setDisplay] = useState("0")

  useEffect(() => {
    const controls = animate(count, value, { duration })
    const unsubscribe = rounded.on("change", (latest) => {
      setDisplay(latest)
    })
    return () => {
      controls.stop()
      unsubscribe()
    }
  }, [value])

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}