"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface SparkleProps {
  id: number
  style: React.CSSProperties
  color: string
}

const Sparkle: React.FC<SparkleProps> = ({ id, style, color }) => {
  return (
    <div
      key={id}
      className={cn(
        "absolute rounded-full opacity-0",
        "animate-twinkle",
        color,
      )}
      style={style}
    />
  )
}

// Simple seeded random function for consistent values
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function SparkleBackground() {
  const [isClient, setIsClient] = React.useState(false)
  const numSparkles = 20

  // Only render on client to avoid hydration mismatch
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // Memoize sparkle styles with seeded random for consistency
  const sparkleStyles = React.useMemo(() => {
    if (!isClient) return []
    
    const colors = [
      "bg-concordia-pink/60",
      "bg-concordia-light-purple/60", 
      "bg-concordia-pink/40",
      "bg-concordia-light-purple/40"
    ]

    return Array.from({ length: numSparkles }).map((_, i) => {
      const seed = i * 123.456 // Use index as seed for consistent values
      const top = seededRandom(seed) * 100 + "%"
      const left = seededRandom(seed + 1) * 100 + "%"
      const size = seededRandom(seed + 2) * 4 + 1
      const animationDelay = seededRandom(seed + 3) * 6 + "s"
      const animationDuration = seededRandom(seed + 4) * 3 + 2 + "s"
      const colorIndex = Math.floor(seededRandom(seed + 5) * colors.length)
      const color = colors[colorIndex]

      return {
        style: {
          top,
          left,
          width: size + "px",
          height: size + "px",
          animationDelay,
          animationDuration,
        },
        color,
      }
    })
  }, [isClient]) // Only regenerate when client state changes

  // Don't render anything on server
  if (!isClient) {
    return null
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {sparkleStyles.map((sparkle, i) => (
        <Sparkle key={i} id={i} style={sparkle.style} color={sparkle.color} />
      ))}
    </div>
  )
}
