"use client"

import { useState } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther } from "viem"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, AlertCircle, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"

// Mock contract ABI - replace with your actual contract ABI
const CONCORDIA_CONTRACT_ABI = [
  {
    inputs: [
      { name: "_contributionAmount", type: "uint256" },
      { name: "_duration", type: "uint256" },
      { name: "_members", type: "address[]" },
    ],
    name: "createGroup",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ name: "_groupId", type: "uint256" }],
    name: "contribute",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ name: "_groupId", type: "uint256" }],
    name: "withdrawFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const

// Mock contract address - replace with your deployed contract
const CONCORDIA_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890" as const

interface SmartContractIntegrationProps {
  contributionAmount: string
  duration: string
  onSuccess?: () => void
}

export function SmartContractIntegration({ contributionAmount, duration, onSuccess }: SmartContractIntegrationProps) {
  const { address } = useAccount()
  const [isCreating, setIsCreating] = useState(false)
  const [txHash, setTxHash] = useState<string>("")
  const [showErrorDetails, setShowErrorDetails] = useState(false)

  const { writeContract, data: hash, error, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Helper function to format error messages
  const formatErrorMessage = (error: any) => {
    if (!error) return ""
    
    // Extract user-friendly message
    let userMessage = error.message || "Transaction failed"
    
    // Handle common error patterns
    if (userMessage.includes("User rejected")) {
      return "Transaction was cancelled by user"
    }
    if (userMessage.includes("insufficient funds")) {
      return "Insufficient funds for transaction"
    }
    if (userMessage.includes("gas")) {
      return "Gas estimation failed - please try again"
    }
    
    // Truncate very long messages
    if (userMessage.length > 100) {
      return userMessage.substring(0, 100) + "..."
    }
    
    return userMessage
  }

  // Helper function to extract technical details
  const getErrorDetails = (error: any) => {
    if (!error) return null
    
    const details: { [key: string]: string } = {}
    
    // Extract request arguments if available
    if (error.request) {
      details["Request Arguments"] = JSON.stringify(error.request, null, 2)
    }
    
    // Extract contract call details if available
    if (error.contractCall) {
      details["Contract Call"] = JSON.stringify(error.contractCall, null, 2)
    }
    
    // Extract version info
    if (error.version) {
      details["Version"] = error.version
    }
    
    // Extract any other technical details
    if (error.cause) {
      details["Cause"] = error.cause.toString()
    }
    
    return Object.keys(details).length > 0 ? details : null
  }

  const handleCreateGroup = async () => {
    if (!address || !contributionAmount || !duration) return

    try {
      setIsCreating(true)
      setShowErrorDetails(false) // Reset error details when starting new transaction

      // Convert duration to seconds (mock conversion)
      const durationInSeconds =
        duration === "1-month"
          ? 30 * 24 * 60 * 60
          : duration === "3-months"
            ? 90 * 24 * 60 * 60
            : duration === "6-months"
              ? 180 * 24 * 60 * 60
              : 365 * 24 * 60 * 60

      // For now, just the creator is in the group - they can invite others later
      const members = [address]

      writeContract({
        address: CONCORDIA_CONTRACT_ADDRESS,
        abi: CONCORDIA_CONTRACT_ABI,
        functionName: "createGroup",
        args: [parseEther(contributionAmount), BigInt(durationInSeconds), members],
        value: parseEther(contributionAmount), // Initial contribution
      })

      if (hash) {
        setTxHash(hash)
      }
    } catch (err) {
      console.error("Error creating group:", err)
    } finally {
      setIsCreating(false)
    }
  }

  const handleContribute = async (groupId: number, amount: string) => {
    if (!address) return

    try {
      writeContract({
        address: CONCORDIA_CONTRACT_ADDRESS,
        abi: CONCORDIA_CONTRACT_ABI,
        functionName: "contribute",
        args: [BigInt(groupId)],
        value: parseEther(amount),
      })
    } catch (err) {
      console.error("Error contributing:", err)
    }
  }

  if (isConfirmed && onSuccess) {
    onSuccess()
  }

  return (
    <div className="space-y-4">
      {/* Transaction Status */}
      {(isPending || isConfirming || isConfirmed || error) && (
        <Card className="bg-concordia-purple/20 border-concordia-light-purple/30 backdrop-blur-sm">
          <CardContent className="p-4 max-h-96 overflow-y-auto">
            {isPending && (
              <div className="flex items-center space-x-3">
                <Loader2 className="h-5 w-5 text-concordia-pink animate-spin" />
                <div>
                  <div className="text-white font-semibold">{"Transaction Pending"}</div>
                  <div className="text-white/70 text-sm">{"Please confirm in your wallet"}</div>
                </div>
              </div>
            )}

            {isConfirming && (
              <div className="flex items-center space-x-3">
                <Loader2 className="h-5 w-5 text-concordia-light-purple animate-spin" />
                <div>
                  <div className="text-white font-semibold">{"Confirming Transaction"}</div>
                  <div className="text-white/70 text-sm">{"Waiting for blockchain confirmation"}</div>
                </div>
              </div>
            )}

            {isConfirmed && (
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div className="flex-1">
                  <div className="text-white font-semibold">{"Transaction Confirmed!"}</div>
                  <div className="text-white/70 text-sm">{"Your savings group has been created"}</div>
                </div>
                {hash && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-concordia-light-purple/50 text-concordia-light-purple hover:bg-concordia-light-purple/10 bg-transparent"
                    onClick={() => window.open("https://testnet.bscscan.com/tx/" + hash, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {error && (
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-semibold">{"Transaction Failed"}</div>
                    <div className="text-white/70 text-sm break-words leading-tight">
                      {formatErrorMessage(error)}
                    </div>
                  </div>
                </div>
                
                {/* Technical Details - Collapsible */}
                {getErrorDetails(error) && (
                  <div className="ml-8">
                    <button
                      onClick={() => setShowErrorDetails(!showErrorDetails)}
                      className="flex items-center space-x-2 text-white/60 hover:text-white/80 text-xs transition-colors"
                    >
                      {showErrorDetails ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                      <span>{"Technical Details"}</span>
                    </button>
                    
                    {showErrorDetails && (
                      <div className="mt-2 space-y-2">
                        {Object.entries(getErrorDetails(error)!).map(([key, value]) => (
                          <div key={key} className="bg-red-500/10 border border-red-500/20 rounded p-3">
                            <div className="text-red-400 font-medium text-xs mb-1">{key}</div>
                            <div className="text-white/70 text-xs font-mono break-all leading-relaxed max-h-32 overflow-y-auto">
                              {value}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Group Button */}
      <Button
        onClick={handleCreateGroup}
        disabled={!address || !contributionAmount || !duration || isPending || isConfirming}
        className="w-full bg-gradient-to-r from-concordia-pink to-concordia-light-purple hover:from-concordia-pink/80 hover:to-concordia-light-purple/80 text-white py-6 text-lg font-semibold"
      >
        {isPending || isConfirming ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {isPending ? "Confirm in Wallet" : "Creating Group..."}
          </>
        ) : (
          "Create Group on Blockchain"
        )}
      </Button>

      {/* Contract Info - Removed the display of the mock contract address */}
      <Card className="bg-concordia-light-purple/10 border-concordia-light-purple/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-semibold text-sm">{"Network"}</div>
              <div className="text-white/70 text-xs font-mono">{"opBNB Testnet"}</div>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">{"Active"}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
