"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut } from "lucide-react"

export function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")

  const connectWallet = async () => {
    // Simulate wallet connection
    // In real implementation, you'd use Wagmi hooks here
    try {
      // Mock connection
      const mockAddress = "0x1234...5678"
      setAddress(mockAddress)
      setIsConnected(true)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress("")
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
  }

  if (!isConnected) {
    return (
      <Button
        onClick={connectWallet}
        className="bg-gradient-to-r from-[#F042FF] to-[#7226FF] hover:from-[#F042FF]/80 hover:to-[#7226FF]/80 text-white"
      >
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-[#7226FF] text-[#7226FF] hover:bg-[#7226FF]/10 bg-transparent">
          <Wallet className="mr-2 h-4 w-4" />
          {address}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#010030] border-[#7226FF]/30">
        <DropdownMenuItem onClick={copyAddress} className="text-white hover:bg-[#7226FF]/20 cursor-pointer">
          <Copy className="mr-2 h-4 w-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem className="text-white hover:bg-[#7226FF]/20 cursor-pointer">
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuItem onClick={disconnectWallet} className="text-red-400 hover:bg-red-400/20 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
