"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Users, Lock, Trophy, Target, ArrowRight, Shield, Coins, Wallet, ChevronDown } from "lucide-react"
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi"
import { opBNBTestnet } from "wagmi/chains"
import { GroupDashboard, type SavingsGroup } from "@/components/group-dashboard"
import { SmartContractIntegration } from "@/components/smart-contract-integration"
import { hybridStorageService, type GroupMetadata } from "@/lib/hybrid-storage"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SparkleBackground } from "@/components/sparkle-background"
import { AuraRewards } from "@/components/aura-rewards"
import { NFTWalletDisplay } from "@/components/nft-wallet-display"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Client-side only component to prevent hydration errors
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return <>{children}</>
}

function WalletConnection() {
  const { address, isConnected, chainId } = useAccount()
  const { connect, connectors, error, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()

  const requiredChainId = opBNBTestnet.id
  const isWrongNetwork = isConnected && chainId !== requiredChainId

  const handleConnect = async () => {
    try {
      console.log("🔗 Attempting to connect wallet...")
      console.log("Available connectors:", connectors.map(c => c.name))
      
      // Check if MetaMask is installed
      if (typeof window !== 'undefined' && !window.ethereum) {
        alert("MetaMask is not installed. Please install MetaMask extension first.")
        return
      }
      
      // Try to find MetaMask connector
      const metaMaskConnector = connectors.find((connector) => 
        connector.name === "MetaMask" || connector.name === "Injected" || connector.name === "Browser Wallet"
      )

      if (metaMaskConnector) {
        console.log("✅ Found MetaMask connector:", metaMaskConnector.name)
        const result = await connect({ connector: metaMaskConnector })
        console.log("🔗 Connection result:", result)
      } else {
        console.warn("⚠️ MetaMask connector not found, trying first available connector")
        if (connectors.length > 0) {
          console.log("🔄 Using first available connector:", connectors[0].name)
          const result = await connect({ connector: connectors[0] })
          console.log("🔗 Connection result:", result)
        } else {
          console.error("❌ No connectors available")
          alert("No wallet connectors available. Please install MetaMask.")
        }
      }
    } catch (err) {
      console.error("❌ Failed to connect wallet:", err)
      const errorMessage = err instanceof Error ? err.message : String(err)
      if (errorMessage.includes("User rejected")) {
        alert("Connection was rejected. Please try again and approve the connection in MetaMask.")
      } else if (errorMessage.includes("already pending")) {
        alert("Connection is already pending. Please check MetaMask for the connection request.")
      } else {
        alert("Failed to connect wallet. Please make sure MetaMask is installed and unlocked.")
      }
    }
  }

  const handleDisconnect = () => {
    try {
      console.log("🔌 Attempting to disconnect wallet...")
      
      // First try the proper disconnect
    disconnect()
      
      // Force clear any remaining connection state
      if (typeof window !== 'undefined') {
        // Clear any stored connection data
        localStorage.removeItem('wagmi.connected')
        localStorage.removeItem('wagmi.wallet')
        localStorage.removeItem('wagmi.account')
        
        // Clear ethereum listeners if available
        if (window.ethereum) {
          window.ethereum.removeAllListeners()
        }
      }
      
      // Clear user groups and redirect to home page
      setUserGroups([])
      setActiveTab("home")
      setAutoRedirectDone(false) // Reset redirect flag
      
      console.log("✅ Wallet disconnected successfully and redirected to home")
    } catch (error) {
      console.error("❌ Error disconnecting wallet:", error)
      // Even if disconnect fails, try to clear state and redirect
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('wagmi.connected')
          localStorage.removeItem('wagmi.wallet')
          localStorage.removeItem('wagmi.account')
        }
        // Still redirect to home page
        setUserGroups([])
        setActiveTab("home")
        setAutoRedirectDone(false)
      } catch (e) {
        console.error("❌ Error clearing storage:", e)
      }
    }
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
        <p className="text-red-400 text-xs max-w-xs text-right">{"Please switch to opBNB Testnet to continue."}</p>
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
          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault();
              handleDisconnect();
            }}
            className="text-red-400 hover:bg-red-400/20 cursor-pointer"
          >
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
        className="bg-gradient-to-r from-concordia-pink to-concordia-light-purple hover:from-concordia-pink/80 hover:to-concordia-light-purple/80 text-white font-semibold px-6 py-2 shadow-lg"
      >
        <Wallet className="mr-2 h-4 w-4" />
        {"Connect MetaMask"}
      </Button>
      {error && <p className="text-red-400 text-xs max-w-xs text-right">{error.message}</p>}
    </div>
  )
}

export default function HomePage() {
  const [teamName, setTeamName] = useState("")
  const [groupDescription, setGroupDescription] = useState("")
  const [contributionAmount, setContributionAmount] = useState("")
  const [duration, setDuration] = useState("")
  const [activeTab, setActiveTab] = useState("home")
  const { isConnected, address } = useAccount()
  const [userGroups, setUserGroups] = useState<SavingsGroup[]>([])
  const [isContributing, setIsContributing] = useState(false)
  const [withdrawalDate, setWithdrawalDate] = useState("")
  const [dueDay, setDueDay] = useState("")
  const [isLoadingGroups, setIsLoadingGroups] = useState(false)
  const [userAuraPoints, setUserAuraPoints] = useState(0)
  const { toast } = useToast()

  // New state to track if the automatic redirect has already occurred
  const [autoRedirectDone, setAutoRedirectDone] = useState(false)

  // Load groups from storage when wallet connects
  useEffect(() => {
    const loadGroups = async () => {
      if (!isConnected || !address) {
        console.log("🔌 Wallet not connected, skipping group load");
        setUserGroups([]);
        setIsLoadingGroups(false);
        return;
      }

      setIsLoadingGroups(true);
      try {
        console.log("🔄 Loading groups for wallet:", address);
        
        // Load all groups from hybrid storage
        const allGroups = await hybridStorageService.loadGroups();
        
        // Filter groups where the current user is either creator or member
        const userGroups = allGroups.filter((group: any) => {
          const isCreator = group.creator?.toLowerCase() === address.toLowerCase();
          const isMember = group.members?.some((member: any) => 
            member.address?.toLowerCase() === address.toLowerCase()
          );
          return isCreator || isMember;
        });

        console.log("👤 User's groups found:", userGroups.length);

        const formattedGroups: SavingsGroup[] = userGroups.map((group: any) => ({
          id: group.id,
          name: group.name || "Unnamed Group",
          goal: group.description || group.goal || "No description",
          targetAmount: group.targetAmount || 0,
          currentAmount: group.currentAmount || 0,
          contributionAmount: (group.targetAmount || 0) / 10,
          duration: group.duration,
          endDate: group.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          members: group.members ? group.members.map((member: any) => ({
            address: member.address,
            nickname: member.nickname || "Member",
            contributed: member.contributed || 0,
            auraPoints: member.auraPoints || 0,
            status: member.status || "active"
          })) : [],
          status: group.status || "active",
          nextContribution: group.nextContribution || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          createdBy: group.createdBy || group.creator || "",
          createdAt: group.createdAt || new Date().toISOString()
        }));
        
        setUserGroups(formattedGroups);
        console.log("✅ User's groups loaded from hybrid storage:", formattedGroups.length);
        
        // Show success message if groups were loaded
        if (formattedGroups.length > 0) {
          toast({
            title: "📊 Dashboard Loaded",
            description: `Found ${formattedGroups.length} group(s) from hybrid storage`,
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("❌ Error loading groups:", error);
        console.log("🔄 Starting with empty groups list due to error");
        setUserGroups([]);
        
        toast({
          title: "⚠️ Loading Error",
          description: "Failed to load groups. Please try refreshing the page.",
          duration: 5000,
        });
      } finally {
        setIsLoadingGroups(false);
      }
    };
    
    loadGroups();
  }, [isConnected, address, toast]);

  // Save groups using localStorage
  const saveGroup = async (groupData: any) => {
    try {
      console.log("💾 Saving group to localStorage:", groupData);
      
      // Convert to GroupMetadata format for hybrid storage
      const localGroupData: GroupMetadata = {
        id: groupData.id,
        name: groupData.name,
        description: groupData.description,
        creator: groupData.creator,
        contributionAmount: groupData.targetAmount,
        currentAmount: groupData.currentAmount,
        targetAmount: groupData.targetAmount,
        goal: groupData.description,
        duration: groupData.duration,
        endDate: groupData.withdrawalDate,
        withdrawalDate: groupData.withdrawalDate,
        isActive: true,
        status: "active",
        createdBy: groupData.creator,
        members: [
          {
            address: groupData.creator,
            nickname: "Creator",
            contributed: groupData.currentAmount,
            auraPoints: 10,
            status: "active",
            role: "creator",
            joinedAt: new Date().toISOString()
          }
        ],
        nextContribution: groupData.nextContribution,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Greenfield references (will be filled by hybrid storage service)
        greenfieldBucketId: "",
        greenfieldObjectKey: "",
        greenfieldDataHash: ""
      };

      // Save to hybrid storage
      const result = await hybridStorageService.saveGroup(localGroupData);
      
      if (result.success) {
        console.log("✅ Group saved to localStorage successfully");
        
        // Add the new group to the current list immediately
        const newGroup: SavingsGroup = {
          id: groupData.id,
          name: groupData.name,
          goal: groupData.description,
          targetAmount: groupData.targetAmount,
          currentAmount: groupData.currentAmount,
          contributionAmount: groupData.contributionAmount,
          duration: groupData.duration,
          endDate: groupData.withdrawalDate,
          members: [
            {
              address: groupData.creator,
              nickname: "Creator",
              contributed: groupData.currentAmount,
              auraPoints: 10,
              status: "active"
            }
          ],
          status: "active",
          nextContribution: groupData.nextContribution,
          createdBy: groupData.creator,
          createdAt: new Date().toISOString()
        };
        
        setUserGroups(prev => [...prev, newGroup]);
        console.log("✅ Group added to dashboard:", newGroup.id);
        
        toast({
          title: "✅ Group Created",
          description: "Group saved to localStorage successfully",
          duration: 3000,
        });
      } else {
        throw new Error(result.error || "Failed to save to localStorage");
      }
      
    } catch (error) {
      console.error("❌ Error saving group to localStorage:", error);
      
      toast({
        title: "❌ Save Failed",
        description: "Failed to save group to localStorage. Please try again.",
        duration: 5000,
      });
      
      // Still add to local state for immediate feedback
      const newGroup: SavingsGroup = {
        id: groupData.id,
        name: groupData.name,
        goal: groupData.description,
        targetAmount: groupData.targetAmount,
        currentAmount: groupData.currentAmount,
        contributionAmount: groupData.contributionAmount,
        duration: groupData.duration,
        endDate: groupData.withdrawalDate,
        members: [
          {
            address: groupData.creator,
            nickname: "Creator",
            contributed: groupData.currentAmount,
            auraPoints: 10,
            status: "active"
          }
        ],
        status: "active",
        nextContribution: groupData.nextContribution,
        createdBy: groupData.creator,
        createdAt: new Date().toISOString()
      };
      
      setUserGroups(prev => [...prev, newGroup]);
      console.log("⚠️ Group added locally (storage error):", newGroup.id);
    }
  };

  // Handle wallet disconnection
  useEffect(() => {
    if (!isConnected && userGroups.length > 0) {
      // Clear groups when wallet disconnects
      setUserGroups([])
      setUserAuraPoints(0)
      console.log("🔌 Wallet disconnected, cleared user groups and aura points")
    }
  }, [isConnected, userGroups.length])

  // Calculate Aura Points based on user's contributions (simplified mechanism)
  useEffect(() => {
    if (isConnected && address && userGroups.length > 0) {
      let totalAuraPoints = 0
      
      userGroups.forEach(group => {
        // Find user's contribution in this group
        const userMember = group.members.find(member => 
          member.address.toLowerCase() === address.toLowerCase()
        )
        
        if (userMember) {
          // Each payment gets 10 Aura Points
          const payments = Math.floor(userMember.contributed / group.contributionAmount)
          totalAuraPoints += payments * 10
          
          // Early payments (first 3 members) get 5 extra points
          if (group.members.indexOf(userMember) < 3) {
            totalAuraPoints += 5
          }
        }
      })
      
      setUserAuraPoints(totalAuraPoints)
      console.log("💫 Calculated Aura Points:", totalAuraPoints)
    }
  }, [isConnected, address, userGroups])

  // Auto-switch to dashboard when wallet connects
  useEffect(() => {
    // Only redirect if connected AND auto-redirect hasn't happened yet
    if (isConnected && !autoRedirectDone && address) {
      // If currently on the home tab, perform the redirect
      if (activeTab === "home") {
        setTimeout(() => {
          setActiveTab("dashboard")
          setAutoRedirectDone(true) // Mark redirect as done
          console.log("🔄 Auto-redirecting to dashboard after wallet connection");
          
          // Show welcome message
          toast({
            title: "🔗 Wallet Connected",
            description: "Welcome back! Your dashboard is loading from BNB Greenfield...",
            duration: 3000,
          });
        }, 1500) // Increased delay to allow data loading
      }
    }
    // If disconnected, redirect to home and reset the flag
    if (!isConnected && activeTab !== "home") {
      setActiveTab("home")
      setAutoRedirectDone(false)
      console.log("🔌 Wallet disconnected, redirected to home page");
    }
  }, [isConnected, activeTab, autoRedirectDone, address, toast])

  useEffect(() => {
    const handleNavigateToCreate = () => {
      setActiveTab("create")
      window.scrollTo({ top: 0, behavior: "smooth" })
    }

    window.addEventListener("navigateToCreate", handleNavigateToCreate)
    return () => window.removeEventListener("navigateToCreate", handleNavigateToCreate)
  }, [])

  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Group Savings",
      description: "Create savings groups with 2-10 friends for shared goals like trips, concerts, or events.",
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: "Smart Contract Security",
      description: "Funds are locked in smart contracts and can only be withdrawn when the group agrees.",
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Aura Points System",
      description: "Earn streak rewards for consistent contributions and build trust within your group.",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Milestone Celebrations",
      description: "Unlock fun rewards and celebrations when your group hits savings milestones.",
    },
  ]

  const howItWorks = [
    {
      step: "01",
      title: "Connect Your Wallet",
      description: "Connect MetaMask to get started with secure blockchain savings",
    },
    {
      step: "02",
      title: "Create Your Group",
      description: "Set contribution amount and invite 2-10 friends to join",
    },
    {
      step: "03",
      title: "Lock & Save Together",
      description: "Funds are secured in smart contracts for your chosen duration",
    },
    {
      step: "04",
      title: "Achieve Your Goal",
      description: "Withdraw funds when everyone agrees and celebrate together!",
    },
  ]

  const scrollToContribution = () => {
    if (isConnected) {
      setActiveTab("create")
      // Scroll to top when switching tabs
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      document.getElementById("connect-section")?.scrollIntoView({
        behavior: "smooth",
      })
    }
  }

  const handleGroupCreated = async (groupId: string, txHash: `0x${string}`, contractData: any) => {
    console.log("🎉 Group created successfully! Navigating to dashboard...")
    
    const parsedContributionAmount = Number.parseFloat(contributionAmount)

    // Calculate end date from withdrawal date or duration
    const endDate =
      withdrawalDate ||
      new Date(
        Date.now() +
          (duration === "1-month" ? 30 : duration === "3-months" ? 90 : duration === "6-months" ? 180 : 365) *
            24 *
            60 *
            60 *
            1000,
      )
        .toISOString()
        .split("T")[0]

    // Calculate next contribution date based on due day
    const nextContributionDate = dueDay
      ? new Date(new Date().getFullYear(), new Date().getMonth() + 1, Number.parseInt(dueDay))
          .toISOString()
          .split("T")[0]
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    const newGroup = {
      id: groupId,
      name: teamName || "Unnamed Group",
      description: groupDescription || "No description provided.",
      creator: address || "",
      contributionAmount: parsedContributionAmount,
      currentAmount: parsedContributionAmount,
      targetAmount: parsedContributionAmount * 10,
      goal: groupDescription || "No description provided.",
      duration: duration,
      endDate: endDate,
      withdrawalDate: contractData.withdrawalDate,
      dueDay: dueDay,
      isActive: true,
      status: "active",
      createdBy: address || "",
      members: [
        {
          address: address || "0xYourAddress",
          nickname: "You",
          contributed: parsedContributionAmount,
          auraPoints: 10,
          status: "active",
        },
      ],
      nextContribution: nextContributionDate,
      greenfieldObjectId: contractData.greenfieldObjectId,
      greenfieldMetadataHash: contractData.greenfieldMetadataHash,
      txHash: txHash, // Pass transaction hash for blockchain data
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      // Save to Greenfield first
      await saveGroup(newGroup);
      
      // Show success toast with more details
      toast({
        title: "🎉 Payment Confirmed & Group Created!",
        description: `"${newGroup.name}" is now live on BNB Greenfield. Your data is permanently stored and accessible anytime.`,
        duration: 6000,
      })

      // Navigate to dashboard immediately after payment confirmation
    setActiveTab("dashboard")
      
      // Scroll to top of dashboard
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }, 100)

    // Clear form fields
    setTeamName("")
    setGroupDescription("")
    setContributionAmount("")
    setDuration("")
    setWithdrawalDate("")
    setDueDay("")

      console.log("✅ Successfully navigated to dashboard after payment confirmation");
    } catch (error) {
      console.error("❌ Error in group creation flow:", error);
      toast({
        title: "⚠️ Group Created but Storage Failed",
        description: "Group was created on blockchain but there was an issue saving to BNB Greenfield. Please refresh the page.",
        duration: 8000,
      });
      
      // Still navigate to dashboard even if Greenfield save fails
      setActiveTab("dashboard")
    }
  }

  const handleDeleteGroup = async (groupId: string) => {
    try {
      // Delete from hybrid storage
      const result = await hybridStorageService.deleteGroup(groupId);
      if (result.success) {
        console.log("✅ Group deleted from hybrid storage:", groupId);
        // Reload groups after deletion
        const groups = await hybridStorageService.loadGroups();
        
        // Filter groups where the current user is either creator or member
        const userGroups = groups.filter((group: any) => {
          const isCreator = group.creator?.toLowerCase() === address?.toLowerCase();
          const isMember = group.members?.some((member: any) => 
            member.address?.toLowerCase() === address?.toLowerCase()
          );
          return isCreator || isMember;
        });

        const formattedGroups: SavingsGroup[] = userGroups.map((group: any) => ({
          id: group.id,
          name: group.name || "Unnamed Group",
          goal: group.description || group.goal || "No description",
          targetAmount: group.targetAmount || 0,
          currentAmount: group.currentAmount || 0,
          contributionAmount: (group.targetAmount || 0) / 10,
          duration: group.duration,
          endDate: group.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          members: group.members ? group.members.map((member: any) => ({
            address: member.address,
            nickname: member.nickname || "Member",
            contributed: member.contributed || 0,
            auraPoints: member.auraPoints || 0,
            status: member.status || "active"
          })) : [],
          status: group.status || "active",
          nextContribution: group.nextContribution || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          createdBy: group.createdBy || group.creator || "",
          createdAt: group.createdAt || new Date().toISOString()
        }));
        
        setUserGroups(formattedGroups);
      } else {
        console.error("Failed to delete group from hybrid storage:", result.error);
      }
    } catch (error) {
      console.error("Error deleting group from hybrid storage:", error);
    }
  }

  const handleContribution = async (groupId: string, amount: number) => {
    setIsContributing(true)
    try {
      // Simulate smart contract contribution
      console.log(`Contributing ${amount} BNB to group ${groupId}`)

      // Update the group's current amount
      setUserGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === groupId
            ? {
                ...group,
                currentAmount: group.currentAmount + amount,
                nextContribution: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Next month
              }
            : group,
        ),
      )

      alert(`Successfully contributed ${amount} BNB to the group!`)
    } catch (error) {
      console.error("Contribution failed:", error)
      alert("Contribution failed. Please try again.")
    } finally {
      setIsContributing(false)
    }
  }

  return (
    <div className="min-h-screen bg-concordia-dark-blue relative">
      {" "}
      {/* Added relative for SparkleBackground positioning */}
      <SparkleBackground /> {/* Add the sparkle background here */}
      {/* Navigation */}
      <nav className="border-b border-concordia-light-purple/20 bg-concordia-dark-blue/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* New Logo */}
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

          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => setActiveTab("home")}
              className={
                "font-medium transition-colors " +
                (activeTab === "home" ? "text-concordia-pink" : "text-white/80 hover:text-concordia-pink")
              }
            >
              {"Home"}
            </button>
            <ClientOnly>
              {isConnected && (
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={
                    "font-medium transition-colors " +
                    (activeTab === "dashboard" ? "text-concordia-pink" : "text-white/80 hover:text-concordia-pink")
                  }
                >
                  {"Dashboard"}
                </button>
              )}
              {isConnected && (
                <button
                  onClick={() => setActiveTab("create")}
                  className={
                    "font-medium transition-colors " +
                    (activeTab === "create" ? "text-concordia-pink" : "text-white/80 hover:text-concordia-pink")
                  }
                >
                  {"Create Group"}
                </button>
              )}
              {isConnected && (
                <button
                  onClick={() => setActiveTab("aura")}
                  className={
                    "font-medium transition-colors " +
                    (activeTab === "aura" ? "text-concordia-pink" : "text-white/80 hover:text-concordia-pink")
                  }
                >
                  {"Aura Rewards"}
                </button>
              )}
              {isConnected && (
                <button
                  onClick={() => setActiveTab("nfts")}
                  className={
                    "font-medium transition-colors " +
                    (activeTab === "nfts" ? "text-concordia-pink" : "text-white/80 hover:text-concordia-pink")
                  }
                >
                  {"My NFTs"}
                </button>
              )}
            </ClientOnly>
          </div>

          <div className="flex items-center space-x-4">
            <WalletConnection />
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="home" className="space-y-20">
            {/* Hero Section */}
            <section className="text-center py-12">
              <div className="max-w-4xl mx-auto">
                <Badge className="mb-6 bg-concordia-light-purple/20 text-concordia-pink border-concordia-pink/30 font-semibold">
                  {"Built on opBNB • Low Fees • Fast Transactions"}
                </Badge>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                  {"Save Money"}
                  <span className="bg-gradient-to-r from-concordia-pink to-concordia-light-purple bg-clip-text text-transparent">
                    {" Together"}
                  </span>
                </h1>
                <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                  {
                    "Concordia helps small groups of friends save money together for shared goals. Lock funds in smart contracts, earn Aura Points for consistency, and achieve your dreams collectively."
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={scrollToContribution}
                    className="bg-gradient-to-r from-concordia-pink to-concordia-light-purple hover:from-concordia-pink/80 hover:to-concordia-light-purple/80 text-white px-8 py-6 text-lg font-semibold"
                  >
                    {isConnected ? "Start Saving Together" : "Connect & Get Started"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <ClientOnly>
                    {isConnected && (
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => setActiveTab("dashboard")}
                        className="border-concordia-light-purple text-concordia-light-purple hover:bg-concordia-light-purple/10 px-8 py-6 text-lg bg-transparent font-semibold"
                      >
                        {"View Dashboard"}
                      </Button>
                    )}
                  </ClientOnly>
                </div>
              </div>
            </section>

            {/* Connect Wallet CTA Section */}
            <ClientOnly>
              {!isConnected && (
                <section id="connect-section" className="py-16">
                  <Card className="max-w-2xl mx-auto bg-gradient-to-r from-concordia-pink/10 to-concordia-light-purple/10 border-concordia-pink/30 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <Wallet className="h-16 w-16 text-concordia-pink mx-auto mb-6" />
                      <h3 className="text-white text-2xl font-bold mb-4">{"Connect Your MetaMask Wallet"}</h3>
                      <p className="text-white/80 mb-6 text-lg">
                        {
                          "Connect your MetaMask wallet to start creating savings groups and managing your funds securely on the blockchain."
                        }
                      </p>
                      <WalletConnection />
                      <div className="mt-4 text-sm text-white/60">{"Make sure you're connected to opBNB Testnet"}</div>
                    </CardContent>
                  </Card>
                </section>
              )}
            </ClientOnly>

            {/* Stats Section */}
            <section className="py-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-4xl font-bold text-concordia-pink mb-2">{"2-10"}</div>
                  <div className="text-white/80 font-medium">{"Friends per Group"}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-concordia-light-purple mb-2">{"100%"}</div>
                  <div className="text-white/80 font-medium">{"Secure & Transparent"}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-concordia-pink mb-2">{"0.001"}</div>
                  <div className="text-white/80 font-medium">{"BNB Transaction Fees"}</div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">
                  {"Why Choose "}
                  <span className="text-concordia-pink">{"CONCORDIA"}</span>?
                </h2>
                <p className="text-white/80 text-lg max-w-2xl mx-auto">
                  {"Built for friends who want to save together without the hassle of traditional methods"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <Card
                    key={index}
                    className="bg-concordia-purple/20 border-concordia-light-purple/30 hover:border-concordia-pink/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-concordia-pink/20 to-concordia-light-purple/20 rounded-lg w-fit text-concordia-pink">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-white text-lg font-semibold">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-white/70 text-center">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* How It Works */}
            <section className="py-20">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">{"How It Works"}</h2>
                <p className="text-white/80 text-lg">{"Simple steps to start saving with your friends"}</p>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {howItWorks.map((step, index) => (
                    <div key={index} className="text-center">
                      <div className="mb-6">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-concordia-pink to-concordia-light-purple rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {step.step}
                        </div>
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-3">{step.title}</h3>
                      <p className="text-white/70">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="dashboard">
            <ClientOnly>
              <GroupDashboard
                groups={userGroups}
                onDeleteGroup={handleDeleteGroup}
                onContribute={handleContribution}
                isContributing={isContributing}
                setUserGroups={setUserGroups}
              />
              {isLoadingGroups && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center space-x-2 text-white">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-concordia-pink"></div>
                    <span>Loading your groups from BNB Greenfield...</span>
                  </div>
                </div>
              )}
            </ClientOnly>
          </TabsContent>

          <TabsContent value="create">
            {/* Group Contribution Section */}
            <section id="contribution-section" className="py-20">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    {"Create Your "}
                    <span className="text-concordia-pink">{"Savings Group"}</span>
                  </h2>
                  <p className="text-white/80 text-lg">
                    {"Set your contribution amount and duration to start saving with friends"}
                  </p>
                </div>

                <Card className="bg-concordia-dark-blue/80 border-concordia-light-purple/30 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <CardTitle className="text-white text-2xl flex items-center justify-center">
                      <Coins className="h-6 w-6 text-concordia-pink mr-2" />
                      {"Group Configuration"}
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      {"Configure your group savings parameters"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="teamName" className="text-white font-semibold">
                        {"Team Name"}
                      </Label>
                      <Input
                        id="teamName"
                        type="text"
                        placeholder="My Awesome Savings Team"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="bg-concordia-dark-blue border-concordia-light-purple/50 text-white placeholder:text-white/50 focus:border-concordia-pink focus:ring-concordia-pink/20"
                      />
                      <p className="text-sm text-white/60">{"A memorable name for your savings group"}</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="groupDescription" className="text-white font-semibold">
                        {"Group Goal/Description"}
                      </Label>
                      <Input
                        id="groupDescription"
                        type="text"
                        placeholder="Saving for a trip to Bali!"
                        value={groupDescription}
                        onChange={(e) => setGroupDescription(e.target.value)}
                        className="bg-concordia-dark-blue border-concordia-light-purple/50 text-white placeholder:text-white/50 focus:border-concordia-pink focus:ring-concordia-pink/20"
                      />
                      <p className="text-sm text-white/60">{"What are you saving for?"}</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contribution" className="text-white font-semibold">
                        {"Contribution Amount (BNB)"}
                      </Label>
                      <Input
                        id="contribution"
                        type="number"
                        placeholder="0.1"
                        step="0.01"
                        min="0"
                        value={contributionAmount}
                        onChange={(e) => setContributionAmount(e.target.value)}
                        className="bg-concordia-dark-blue border-concordia-light-purple/50 text-white placeholder:text-white/50 focus:border-concordia-pink focus:ring-concordia-pink/20"
                      />
                      <p className="text-sm text-white/60">{"Amount each member contributes per period"}</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-white font-semibold">
                        {"Savings Duration"}
                      </Label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger className="bg-concordia-dark-blue border-concordia-light-purple/50 text-white focus:border-concordia-pink focus:ring-concordia-pink/20">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                                                  <SelectContent className="bg-concordia-dark-blue border-concordia-light-purple/50">
                          <SelectItem value="1-month" className="text-white hover:bg-concordia-light-purple/20">
                            {"1 Month"}
                          </SelectItem>
                          <SelectItem value="3-months" className="text-white hover:bg-concordia-light-purple/20">
                            {"3 Months"}
                          </SelectItem>
                          <SelectItem value="6-months" className="text-white hover:bg-concordia-light-purple/20">
                            {"6 Months"}
                          </SelectItem>
                          <SelectItem value="12-months" className="text-white hover:bg-concordia-light-purple/20">
                            {"12 Months"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-white/60">{"How long funds will be locked in the smart contract"}</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="withdrawalDate" className="text-white font-semibold">
                        {"Final Withdrawal Date (Optional)"}
                      </Label>
                      <Input
                        id="withdrawalDate"
                        type="date"
                        value={withdrawalDate}
                        onChange={(e) => setWithdrawalDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="bg-concordia-dark-blue border-concordia-light-purple/50 text-white focus:border-concordia-pink focus:ring-concordia-pink/20"
                      />
                      <p className="text-sm text-white/60">
                        {"Specific date when funds can be withdrawn (overrides duration)"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dueDay" className="text-white font-semibold">
                        {"Monthly Due Day"}
                      </Label>
                      <Select value={dueDay} onValueChange={setDueDay}>
                        <SelectTrigger className="bg-concordia-dark-blue border-concordia-light-purple/50 text-white focus:border-concordia-pink focus:ring-concordia-pink/20">
                          <SelectValue placeholder="Select day of month" />
                        </SelectTrigger>
                        <SelectContent className="bg-concordia-dark-blue border-concordia-light-purple/50">
                          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                            <SelectItem
                              key={day}
                              value={day.toString()}
                              className="text-white hover:bg-concordia-light-purple/20"
                            >
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-white/60">{"Which day of each month contributions are due"}</p>
                    </div>

                    <div className="bg-concordia-light-purple/10 rounded-lg p-4 border border-concordia-light-purple/20">
                      <div className="flex items-start space-x-3">
                        <Shield className="h-5 w-5 text-concordia-pink mt-0.5" />
                        <div>
                          <h4 className="text-white font-semibold text-sm">{"Withdrawal Policy"}</h4>
                          <p className="text-white/70 text-sm">
                            {
                              "Funds will be locked in a smart contract. Withdrawal requires agreement from all group members (implemented via smart contract logic, e.g., multi-sig or voting)."
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    <SmartContractIntegration
                      teamName={teamName}
                      groupDescription={groupDescription}
                      contributionAmount={contributionAmount}
                      duration={duration}
                      withdrawalDate={withdrawalDate}
                      dueDay={dueDay}
                      onSuccess={handleGroupCreated}
                      onDeleteSuccess={(groupId, txHash) => handleDeleteGroup(groupId)}
                    />
                  </CardContent>
                </Card>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="aura">
            <ClientOnly>
              <AuraRewards 
                userAuraPoints={userAuraPoints}
                onAuraPointsUpdate={setUserAuraPoints}
                onBackToDashboard={() => setActiveTab("dashboard")}
              />
            </ClientOnly>
          </TabsContent>

          <TabsContent value="nfts">
            <ClientOnly>
              <NFTWalletDisplay />
            </ClientOnly>
          </TabsContent>
        </Tabs>
      </div>
      {/* Footer */}
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
                  onClick={() => setActiveTab("home")}
                  className="block text-white/70 hover:text-concordia-pink transition-colors"
                >
                  {"Features"}
                </button>
                <button
                  onClick={() => setActiveTab("create")}
                  className="block text-white/70 hover:text-concordia-pink transition-colors"
                >
                  {"Create Group"}
                </button>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className="block text-white/70 hover:text-concordia-pink transition-colors"
                >
                  {"Dashboard"}
                </button>
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
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  )
}
