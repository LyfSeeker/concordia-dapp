"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Wallet, ChevronDown } from "lucide-react"
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi"
import { opBNBTestnet } from "wagmi/chains"

export function WalletConnection() {
  const { address, isConnected, chainId } = useAccount()
  const { connect, connectors, error, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()

  const requiredChainId = opBNBTestnet.id
  const isWrongNetwork = isConnected && chainId !== requiredChainId

  const handleConnect = () => {
    try {
      const metaMaskConnector = connectors.find((connector) => connector.name === "MetaMask")

      if (metaMaskConnector) {
        connect({ connector: metaMaskConnector })
      } else {
        console.warn("MetaMask connector not found, attempting to connect with first available connector.")
        if (connectors.length > 0) {
          connect({ connector: connectors[0] })
        } else {
          console.error("No connectors available.")
        }
      }
    } catch (err) {
      console.error("Failed to connect wallet:", err)
    }
  }

  const handleDisconnect = () => {
    disconnect()
  }

  if (isPending) {
    return (
      <Button disabled className="bg-gradient-to-r from-[#F042FF] to-[#7226FF] text-white font-semibold px-6 py-2">
        {"Connecting..."}
      </Button>
    )
  }

  if (isWrongNetwork) {
    return (
      <div className="flex flex-col items-end space-y-2">
        <Button
          onClick={() => switchChain({ chainId: requiredChainId })}
          className="bg-red-500 hover:bg-red-700 text-white font-semibold px-6 py-2"
        >
          <Wallet className="mr-2 h-4 w-4" />
          {"Switch to opBNB Testnet"}
        </Button>
        <p className="text-red-400 text-xs max-w-[200px] text-right break-words leading-tight">
          {"Please switch to opBNB Testnet to continue."}
        </p>
      </div>
    )
  }

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="border-concordia-light-purple text-concordia-light-purple hover:bg-concordia-light-purple/10 bg-transparent font-semibold"
          >
            <Wallet className="mr-2 h-4 w-4" />
            {address.slice(0, 6) + "..." + address.slice(-4)}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-concordia-dark-blue border-concordia-light-purple/30">
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(address)}
            className="text-white hover:bg-concordia-light-purple/20 cursor-pointer"
          >
            {"Copy Address"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => window.open("https://testnet.bscscan.com/address/" + address, "_blank")}
            className="text-white hover:bg-concordia-light-purple/20 cursor-pointer"
          >
            {"View on Explorer"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDisconnect} className="text-red-400 hover:bg-red-400/20 cursor-pointer">
            {"Disconnect"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="flex flex-col items-end space-y-2">
      <Button
        onClick={handleConnect}
        className="bg-gradient-to-r from-[#F042FF] via-[#7226FF] to-[#F042FF] hover:from-[#F042FF]/90 hover:via-[#7226FF]/90 hover:to-[#F042FF]/90 text-white font-semibold px-6 py-2 shadow-md"
      >
        <Wallet className="mr-2 h-4 w-4" />
        {"Connect MetaMask"}
      </Button>
      {error && (
        <p className="text-red-400 text-xs max-w-[200px] text-right break-words leading-tight">
          {error.message}
        </p>
      )}
    </div>
  )
} 