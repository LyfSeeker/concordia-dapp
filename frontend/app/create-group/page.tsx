"use client"

import { useRouter } from "next/navigation"
import { CreateGroupForm } from "@/components/create-group-form"
import { SparkleBackground } from "@/components/sparkle-background"
import { useAccount } from "wagmi"
import { useEffect, useState } from "react"
import { WalletConnection } from "@/components/wallet-connection"
import { Menu, X } from "lucide-react"

export default function CreateGroupPage() {
  const router = useRouter()
  const { isConnected, address } = useAccount()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Redirect to home if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/")
    }
  }, [isConnected, router])

  const handleGroupCreated = (groupData: {
    name: string
    description: string
    targetAmount: number
    numMembers: number
    contributionFrequency: "weekly" | "monthly"
    lockDuration: number
  }) => {
    // In a real app, you'd send this data to your backend/smart contract
    // For now, we'll just log it and redirect to the dashboard.
    console.log("Group created with data:", groupData)
    // Pass group data via query param to simulate adding it to userGroups on dashboard
    const encodedGroupData = encodeURIComponent(JSON.stringify(groupData))
    router.push(`/?tab=dashboard&newGroup=${encodedGroupData}`)
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-concordia-dark-blue relative flex items-center justify-center">
        <SparkleBackground />
        <div className="text-center text-white z-10">
          <h2 className="text-3xl font-bold mb-4">{"Please connect your wallet to create a group."}</h2>
          <p className="text-white/70">{"Redirecting to home page..."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-concordia-dark-blue relative">
      <SparkleBackground />
      {/* Navigation */}
      <nav className="border-b border-concordia-light-purple/20 bg-concordia-dark-blue/95 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Logo */}
            <div className="relative">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10"
              >
                <defs>
                  <linearGradient id="logoGradientNew" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F042FF" />
                    <stop offset="100%" stopColor="#7226FF" />
                  </linearGradient>
                  <filter id="glowNew">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Main "C" shape - abstract and interconnected */}
                <path
                  d="M20 2C11.1634 2 4 9.16344 4 18C4 26.8366 11.1634 34 20 34C28.8366 34 36 26.8366 36 18C36 9.16344 28.8366 2 20 2ZM20 6C26.6274 6 32 11.3726 32 18C32 24.6274 26.6274 30 20 30C13.3726 30 8 24.6274 8 18C8 11.3726 13.3726 6 20 6Z"
                  fill="url(#logoGradientNew)"
                  opacity="0.1"
                />
                <path
                  d="M20 10C14.4772 10 10 14.4772 10 20C10 25.5228 14.4772 30 20 30C25.5228 30 30 25.5228 30 20C30 14.4772 25.5228 10 20 10ZM20 14C23.3137 14 26 16.6863 26 20C26 23.3137 23.3137 26 20 26C16.6863 26 14 23.3137 14 20C14 16.6863 16.6863 14 20 14Z"
                  fill="url(#logoGradientNew)"
                  opacity="0.2"
                />
                {/* Interlocking elements */}
                <path
                  d="M20 10 L20 14 M20 26 L20 30 M10 20 L14 20 M26 20 L30 20"
                  stroke="url(#logoGradientNew)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.6"
                />
                <circle cx="20" cy="20" r="4" fill="url(#logoGradientNew)" filter="url(#glowNew)" />
                <circle cx="20" cy="20" r="2" fill="white" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-concordia-pink/30 to-concordia-light-purple/30 rounded-lg blur-md -z-10"></div>
            </div>
            <span className="text-white font-orbitron font-bold text-2xl tracking-wider uppercase">CONCORDIA</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => router.push("/")}
              className="font-medium transition-colors text-white/80 hover:text-concordia-pink"
            >
              {"Home"}
            </button>
            <button
              onClick={() => isConnected ? router.push("/?tab=dashboard") : null}
              className={
                "font-medium transition-colors " +
                "text-white/80 hover:text-concordia-pink" +
                (!isConnected ? " opacity-50 cursor-not-allowed" : "")
              }
              title={!isConnected ? "Connect wallet to access dashboard" : ""}
            >
              {"Dashboard"}
            </button>
            <button
              className="font-medium transition-colors text-concordia-pink"
            >
              {"Create Group"}
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <WalletConnection />
            
            {/* Mobile menu button */}
            {isClient && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white hover:text-concordia-pink transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isClient && mobileMenuOpen && (
          <div className="md:hidden border-t border-concordia-light-purple/20 bg-concordia-dark-blue/95">
            <div className="px-4 py-4 space-y-3">
              <button
                onClick={() => {
                  router.push("/")
                  setMobileMenuOpen(false)
                }}
                className="block w-full text-left py-2 px-3 rounded-lg transition-colors text-white/80 hover:text-concordia-pink hover:bg-concordia-pink/10"
              >
                {"Home"}
              </button>
              <button
                onClick={() => {
                  if (isConnected) {
                    router.push("/?tab=dashboard")
                    setMobileMenuOpen(false)
                  }
                }}
                className={
                  "block w-full text-left py-2 px-3 rounded-lg transition-colors " +
                  "text-white/80 hover:text-concordia-pink hover:bg-concordia-pink/10" +
                  (!isConnected ? " opacity-50 cursor-not-allowed" : "")
                }
                title={!isConnected ? "Connect wallet to access dashboard" : ""}
              >
                {"Dashboard"}
              </button>
              <button
                className="block w-full text-left py-2 px-3 rounded-lg transition-colors text-concordia-pink bg-concordia-pink/10"
              >
                {"Create Group"}
              </button>
            </div>
          </div>
        )}
      </nav>
      <div className="container mx-auto px-4 py-8 z-10">
        <CreateGroupForm onGroupCreated={handleGroupCreated} />
      </div>
      {/* Footer - Copied from app/page.tsx for consistency */}
      <footer className="border-t border-concordia-light-purple/20 bg-concordia-purple/10 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-10"
                  >
                    <defs>
                      <linearGradient id="footerLogoGradientNew" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F042FF" />
                        <stop offset="100%" stopColor="#7226FF" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M16 1C8.26801 1 2 7.26801 2 15C2 22.732 8.26801 29 16 29C23.732 29 30 22.732 30 15C30 7.26801 23.732 1 16 1ZM16 4C21.5228 4 26 8.47715 26 15C26 21.5228 21.5228 26 16 26C10.4772 26 6 21.5228 6 15C6 8.47715 10.4772 4 16 4Z"
                      fill="url(#footerLogoGradientNew)"
                      opacity="0.1"
                    />
                    <path
                      d="M16 8C12.6863 8 10 10.6863 10 14C10 17.3137 12.6863 20 16 20C19.3137 20 22 17.3137 22 14C22 10.6863 19.3137 8 16 8ZM16 11C17.6569 11 19 12.3431 19 14C19 15.6569 17.6569 17 16 17C14.3431 17 13 15.6569 13 14C13 12.3431 14.3431 11 16 11Z"
                      fill="url(#footerLogoGradientNew)"
                      opacity="0.2"
                    />
                    <path
                      d="M16 8 L16 11 M16 17 L16 20 M8 14 L11 14 M21 14 L24 14"
                      stroke="url(#footerLogoGradientNew)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      opacity="0.6"
                    />
                    <circle cx="16" cy="14" r="2" fill="url(#footerLogoGradientNew)" />
                    <circle cx="16" cy="14" r="1" fill="white" />
                  </svg>
                </div>
                <span className="text-white font-orbitron font-bold text-xl tracking-wider uppercase">CONCORDIA</span>
              </div>
              <p className="text-white/70">
                {"Empowering friends to save money together through blockchain technology."}
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{"Product"}</h4>
              <div className="space-y-2">
                <button
                  onClick={() => router.push("/")}
                  className="block text-white/70 hover:text-concordia-pink transition-colors"
                >
                  {"Features"}
                </button>
                <button
                  onClick={() => router.push("/create-group")}
                  className="block text-white/70 hover:text-concordia-pink transition-colors"
                >
                  {"Create Group"}
                </button>
                <button
                  onClick={() => router.push("/?tab=dashboard")}
                  className="block text-white/70 hover:text-concordia-pink transition-colors"
                >
                  {"Dashboard"}
                </button>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{"Community"}</h4>
              <div className="space-y-2">
                <a href="#" className="block text-white/70 hover:text-concordia-pink transition-colors">
                  {"Discord"}
                </a>
                <a href="#" className="block text-white/70 hover:text-concordia-pink transition-colors">
                  {"Twitter"}
                </a>
                <a href="#" className="block text-white/70 hover:text-concordia-pink transition-colors">
                  {"Telegram"}
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{"Resources"}</h4>
              <div className="space-y-2">
                <a href="#" className="block text-white/70 hover:text-concordia-pink transition-colors">
                  {"Documentation"}
                </a>
                <a href="#" className="block text-white/70 hover:text-concordia-pink transition-colors">
                  {"Smart Contracts"}
                </a>
                <a href="#" className="block text-white/70 hover:text-concordia-pink transition-colors">
                  {"Security"}
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-concordia-light-purple/20 mt-8 pt-8 text-center">
            <p className="text-white/70">{"© 2024 CONCORDIA. Built on opBNB. All rights reserved."}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
