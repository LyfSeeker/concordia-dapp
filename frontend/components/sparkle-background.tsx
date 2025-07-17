"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface SparkleProps {
  id: number
  style: React.CSSProperties
}

const Sparkle: React.FC<SparkleProps> = ({ id, style }) => {
  const colors = [
    "bg-concordia-pink/60", // higher opacity
    "bg-concordia-light-purple/60",
    "bg-concordia-pink/40",
    "bg-concordia-light-purple/40"
  ]
  const randomColor = colors[Math.floor(Math.random() * colors.length)]

  return (
    <div
      key={id}
      className={cn(
        "absolute rounded-full opacity-0",
        "animate-twinkle",
        randomColor,
      )}
      style={style}
    />
  )
}

export function SparkleBackground() {
  const numSparkles = 50 // Reduced number for better performance

  const generateSparkleStyle = () => {
    const top = Math.random() * 100 + "%"
    const left = Math.random() * 100 + "%"
    const size = Math.random() * 6 + 2 // Larger size between 2px and 8px
    const animationDelay = Math.random() * 8 + "s" // Longer delay up to 8 seconds
    const animationDuration = Math.random() * 4 + 3 + "s" // Duration between 3 and 7 seconds

    return {
      top,
      left,
      width: size + "px",
      height: size + "px",
      animationDelay,
      animationDuration,
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {Array.from({ length: numSparkles }).map((_, i) => (
        <Sparkle key={i} id={i} style={generateSparkleStyle()} />
      ))}
    </div>
  )
}
