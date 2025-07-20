"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAccount, useContractRead } from "wagmi"
import { opBNBTestnet } from "wagmi/chains"
import { 
  Gift, 
  Coins, 
  Sparkles, 
  Copy, 
  CheckCircle, 
  Crown,
  Star,
  Zap,
  Trophy,
  Wallet,
  ExternalLink,
  Eye,
  Heart
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// AuraRedemptionNFT Contract ABI (simplified)
const AURA_REDEMPTION_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "getRedemptionCodesForAddress",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "codes",
        "type": "string[]"
      },
      {
        "internalType": "uint256[]",
        "name": "tokenIds",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "code",
        "type": "string"
      }
    ],
    "name": "checkCodeStatus",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isValid",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isRedeemed",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Contract address (deployed on opBNB testnet)
const AURA_REDEMPTION_CONTRACT = "0x338E8AF72E83C131B07162BDd2ACA599D53Ce3e7"

interface NFTToken {
  code: string;
  tier: number;
  auraAmount: number;
  tokenId: number;
  isRedeemed: boolean;
  metadata?: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string;
    }>;
  };
}

export function NFTWalletDisplay() {
  const { address, isConnected, chainId } = useAccount()
  const { toast } = useToast()
  
  const [userNFTs, setUserNFTs] = useState<NFTToken[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedNFT, setSelectedNFT] = useState<NFTToken | null>(null)

  // Check if connected to correct network
  const isWrongNetwork = isConnected && chainId !== opBNBTestnet.id

  // Contract reads
  const { data: userRedemptionData, refetch } = useContractRead({
    address: AURA_REDEMPTION_CONTRACT as `0x${string}`,
    abi: AURA_REDEMPTION_ABI,
    functionName: 'getRedemptionCodesForAddress',
    args: [address as `0x${string}`],
    enabled: isConnected && !!address,
  })

  // Load user's NFT tokens
  useEffect(() => {
    if (userRedemptionData && address) {
      const [codes, tokenIds] = userRedemptionData
      const nftTokens: NFTToken[] = codes.map((code: string, index: number) => {
        const tier = Math.floor(Math.random() * 4) + 1 // Random tier for demo
        const auraAmount = tier === 1 ? 100 : tier === 2 ? 250 : tier === 3 ? 500 : 1000
        
        return {
          code,
          tier,
          auraAmount,
          tokenId: Number(tokenIds[index]),
          isRedeemed: false,
          metadata: generateNFTMetadata(code, tier, auraAmount)
        }
      })
      setUserNFTs(nftTokens)
    }
  }, [userRedemptionData, address])

  const generateNFTMetadata = (code: string, tier: number, auraAmount: number) => {
    const tierNames = ["Basic", "Silver", "Gold", "Platinum"]
    const tierColors = ["#6B7280", "#C0C0C0", "#FFD700", "#E5E4E2"]
    const tierIcons = ["⭐", "🥈", "🥇", "💎"]
    
    return {
      name: `${tierNames[tier - 1]} Aura Redemption Code`,
      description: `A rare ${tierNames[tier - 1].toLowerCase()} tier Aura redemption code worth ${auraAmount} Aura Points.`,
      image: `data:image/svg+xml;base64,${btoa(`
        <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:${tierColors[tier - 1]};stop-opacity:1" />
              <stop offset="100%" style="stop-color:#1F2937;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="300" height="300" fill="url(#grad1)" rx="20"/>
          <text x="150" y="120" font-family="Arial" font-size="60" text-anchor="middle" fill="white">${tierIcons[tier - 1]}</text>
          <text x="150" y="180" font-family="Arial" font-size="24" text-anchor="middle" fill="white">${tierNames[tier - 1]}</text>
          <text x="150" y="210" font-family="Arial" font-size="18" text-anchor="middle" fill="white">${auraAmount} Aura</text>
          <text x="150" y="250" font-family="monospace" font-size="12" text-anchor="middle" fill="white">${code}</text>
        </svg>
      `)}`,
      attributes: [
        { trait_type: "Tier", value: tierNames[tier - 1] },
        { trait_type: "Aura Points", value: auraAmount.toString() },
        { trait_type: "Rarity", value: tier === 1 ? "Common" : tier === 2 ? "Uncommon" : tier === 3 ? "Rare" : "Legendary" },
        { trait_type: "Code", value: code }
      ]
    }
  }

  const getTierInfo = (tier: number) => {
    const tiers = {
      1: { name: "Basic", color: "bg-gray-500/20 border-gray-500/30", icon: "⭐", gradient: "from-gray-500 to-gray-600" },
      2: { name: "Silver", color: "bg-silver-500/20 border-silver-500/30", icon: "🥈", gradient: "from-silver-400 to-silver-600" },
      3: { name: "Gold", color: "bg-yellow-500/20 border-yellow-500/30", icon: "🥇", gradient: "from-yellow-400 to-yellow-600" },
      4: { name: "Platinum", color: "bg-purple-500/20 border-purple-500/30", icon: "💎", gradient: "from-purple-400 to-purple-600" }
    }
    return tiers[tier as keyof typeof tiers] || tiers[1]
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "📋 Code Copied!",
      description: "Redemption code copied to clipboard",
      duration: 2000,
    })
  }

  const viewOnExplorer = (tokenId: number) => {
    const url = `https://testnet.bscscan.com/token/${AURA_REDEMPTION_CONTRACT}?a=${tokenId}`
    window.open(url, "_blank")
  }

  const refreshNFTs = async () => {
    setIsLoading(true)
    await refetch()
    setIsLoading(false)
    toast({
      title: "🔄 NFTs Refreshed!",
      description: "Your NFT collection has been updated",
      duration: 2000,
    })
  }

  if (!isConnected) {
    return (
      <Card className="bg-concordia-dark-blue border-concordia-light-purple/30">
        <CardContent className="p-8 text-center">
          <Wallet className="h-16 w-16 text-concordia-pink mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h3>
          <p className="text-white/70">Connect your wallet to view your NFT collection</p>
        </CardContent>
      </Card>
    )
  }

  if (isWrongNetwork) {
    return (
      <Card className="bg-concordia-dark-blue border-concordia-light-purple/30">
        <CardContent className="p-8 text-center">
          <Zap className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Wrong Network</h3>
          <p className="text-white/70">Please switch to opBNB Testnet to view your NFTs</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          <Gift className="inline-block mr-2 h-8 w-8 text-concordia-pink" />
          My NFT Collection
        </h2>
        <p className="text-white/80 max-w-2xl mx-auto">
          Your beautiful Aura redemption code NFTs. Each NFT represents a unique redemption code with different tier values.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-concordia-purple/20 border-concordia-light-purple/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-concordia-pink">{userNFTs.length}</div>
            <div className="text-white/70 text-sm">Total NFTs</div>
          </CardContent>
        </Card>
        <Card className="bg-concordia-purple/20 border-concordia-light-purple/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {userNFTs.filter(nft => !nft.isRedeemed).length}
            </div>
            <div className="text-white/70 text-sm">Available</div>
          </CardContent>
        </Card>
        <Card className="bg-concordia-purple/20 border-concordia-light-purple/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400">
              {userNFTs.filter(nft => nft.isRedeemed).length}
            </div>
            <div className="text-white/70 text-sm">Redeemed</div>
          </CardContent>
        </Card>
        <Card className="bg-concordia-purple/20 border-concordia-light-purple/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-concordia-pink">
              {userNFTs.reduce((total, nft) => total + nft.auraAmount, 0)}
            </div>
            <div className="text-white/70 text-sm">Total Aura</div>
          </CardContent>
        </Card>
      </div>

      {/* NFT Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Your NFT Collection</h3>
          <Button
            onClick={refreshNFTs}
            disabled={isLoading}
            variant="outline"
            className="border-concordia-light-purple/50 text-concordia-light-purple hover:bg-concordia-light-purple/20"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {userNFTs.length === 0 ? (
          <Card className="bg-concordia-dark-blue border-concordia-light-purple/30">
            <CardContent className="p-8 text-center">
              <Gift className="h-16 w-16 text-concordia-pink/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No NFTs Found</h3>
              <p className="text-white/70">You don't have any Aura redemption NFTs yet. Redeem some codes to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userNFTs.map((nft) => {
              const tierInfo = getTierInfo(nft.tier)
              return (
                <Card
                  key={nft.tokenId}
                  className={`${tierInfo.color} backdrop-blur-sm hover:scale-105 transition-all duration-300 cursor-pointer group`}
                  onClick={() => setSelectedNFT(nft)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge className={`bg-gradient-to-r ${tierInfo.gradient} text-white border-0`}>
                        {tierInfo.icon} {tierInfo.name}
                      </Badge>
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            copyToClipboard(nft.code)
                          }}
                          className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            viewOnExplorer(nft.tokenId)
                          }}
                          className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* NFT Image */}
                      <div className="relative">
                        <img
                          src={nft.metadata?.image}
                          alt={nft.metadata?.name}
                          className="w-full h-48 object-cover rounded-lg border border-white/20"
                        />
                        <div className="absolute top-2 right-2">
                          {nft.isRedeemed ? (
                            <Badge className="bg-red-500 text-white">Redeemed</Badge>
                          ) : (
                            <Badge className="bg-green-500 text-white">Available</Badge>
                          )}
                        </div>
                      </div>

                      {/* NFT Info */}
                      <div className="space-y-2">
                        <h4 className="text-white font-semibold text-lg">{nft.metadata?.name}</h4>
                        <p className="text-white/70 text-sm">{nft.metadata?.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Coins className="h-4 w-4 text-concordia-pink" />
                            <span className="text-white font-semibold">{nft.auraAmount} Aura</span>
                          </div>
                          <span className="text-white/60 text-sm">#{nft.tokenId}</span>
                        </div>

                        {/* Code Display */}
                        <div className="bg-concordia-dark-blue/50 rounded-lg p-3">
                          <p className="text-white/80 text-sm font-mono text-center">{nft.code}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="bg-concordia-dark-blue border-concordia-light-purple/30 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">NFT Details</CardTitle>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedNFT(null)}
                  className="text-white/70 hover:text-white"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <img
                src={selectedNFT.metadata?.image}
                alt={selectedNFT.metadata?.name}
                className="w-full h-64 object-cover rounded-lg"
              />
              
              <div className="space-y-3">
                <h3 className="text-white font-semibold text-xl">{selectedNFT.metadata?.name}</h3>
                <p className="text-white/70">{selectedNFT.metadata?.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-concordia-purple/20 p-3 rounded-lg">
                    <div className="text-white/70 text-sm">Aura Points</div>
                    <div className="text-white font-bold">{selectedNFT.auraAmount}</div>
                  </div>
                  <div className="bg-concordia-purple/20 p-3 rounded-lg">
                    <div className="text-white/70 text-sm">Token ID</div>
                    <div className="text-white font-bold">#{selectedNFT.tokenId}</div>
                  </div>
                </div>

                <div className="bg-concordia-dark-blue/50 p-3 rounded-lg">
                  <div className="text-white/70 text-sm mb-2">Redemption Code</div>
                  <div className="text-white font-mono text-center">{selectedNFT.code}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-white/70 text-sm">Attributes</div>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedNFT.metadata?.attributes.map((attr, index) => (
                      <div key={index} className="bg-concordia-purple/20 p-2 rounded">
                        <div className="text-white/70 text-xs">{attr.trait_type}</div>
                        <div className="text-white text-sm font-semibold">{attr.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => copyToClipboard(selectedNFT.code)}
                    className="flex-1 bg-concordia-pink hover:bg-concordia-pink/80"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                  <Button
                    onClick={() => viewOnExplorer(selectedNFT.tokenId)}
                    variant="outline"
                    className="flex-1 border-concordia-light-purple/50 text-concordia-light-purple"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Explorer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 