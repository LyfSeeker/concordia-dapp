"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Users, Lock, Trophy, Target, ArrowRight, Wallet, ChevronDown, Plus, Menu, X } from "lucide-react"
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi"
import { opBNBTestnet } from "wagmi/chains"
import { GroupDashboard, type SavingsGroup } from "@/components/group-dashboard"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SparkleBackground } from "@/components/sparkle-background"
import { useRouter, useSearchParams } from "next/navigation"
import { WalletConnection } from "@/components/wallet-connection"

export default function HomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("home")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { isConnected, address } = useAccount()
  const [userGroups, setUserGroups] = useState<SavingsGroup[]>([])

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Update activeTab if URL param changes - handle hydration safely
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    } else if (!tab && activeTab !== "home") {
      setActiveTab("home")
    }
  }, [searchParams, activeTab])

  // Handle new group data from create-group page - optimized
  useEffect(() => {
    // Only run after client-side hydration is complete
    if (!isClient) return
    
    const newGroupData = searchParams.get("newGroup")
    if (newGroupData) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(newGroupData))
        const now = Date.now()
        const newMockGroup: SavingsGroup = {
          id: String(now), // Use timestamp for unique ID
          name: parsedData.name,
          description: parsedData.description,
          goal: parsedData.description,
          targetAmount: parsedData.targetAmount,
          currentAmount: parsedData.targetAmount / parsedData.numMembers,
          contributionAmount: parsedData.targetAmount / parsedData.numMembers,
          duration: parsedData.lockDuration + " days",
          endDate: new Date(now + parsedData.lockDuration * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          nextContribution: new Date(
            now + (parsedData.contributionFrequency === "weekly" ? 7 : 30) * 24 * 60 * 60 * 1000,
          )
            .toISOString()
            .split("T")[0],
          status: "active",
          contributionFrequency: parsedData.contributionFrequency || "weekly",
          lockDuration: parsedData.lockDuration || 30,
          members: Array.from({ length: parsedData.numMembers }).map((_, i) => ({
            address: i === 0 ? address || "0xYourAddress" : `0xMockMember${i + 1}`,
            nickname: i === 0 ? "You" : `Member ${i + 1}`,
            contributed: i === 0 ? parsedData.targetAmount / parsedData.numMembers : 0,
            auraPoints: i === 0 ? 10 : 0,
            status: i === 0 ? "active" : "pending",
            hasApprovedWithdrawal: false,
          })),
          approvalStatus: parsedData.numMembers > 0 ? { [address || "0xYourAddress"]: false } : {},
        }
        setUserGroups((prevGroups) => [...prevGroups, newMockGroup])
        // Clear the URL param after processing
        router.replace("/?tab=dashboard", undefined)
      } catch (error) {
        console.error("Error parsing new group data:", error)
        router.replace("/?tab=dashboard", undefined)
      }
    }
  }, [searchParams, address, router, isClient]) // Added isClient dependency

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
      router.push("/create-group")
    } else {
      document.getElementById("connect-section")?.scrollIntoView({
        behavior: "smooth",
      })
    }
  }

  const handleApproveWithdrawal = (groupId: string, memberAddress: string) => {
    setUserGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              approvalStatus: {
                ...group.approvalStatus,
                [memberAddress]: true,
              },
            }
          : group,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-concordia-dark-blue relative">
      <SparkleBackground />
      {/* Navigation */}
      <nav className="border-b border-concordia-light-purple/20 bg-concordia-dark-blue/95 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Optimized Logo */}
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
                </defs>
                {/* Simplified "C" shape */}
                <path
                  d="M20 10C14.4772 10 10 14.4772 10 20C10 25.5228 14.4772 30 20 30C25.5228 30 30 25.5228 30 20C30 14.4772 25.5228 10 20 10ZM20 14C23.3137 14 26 16.6863 26 20C26 23.3137 23.3137 26 20 26C16.6863 26 14 23.3137 14 20C14 16.6863 16.6863 14 20 14Z"
                  fill="url(#logoGradientNew)"
                  opacity="0.8"
                />
                <circle cx="20" cy="20" r="3" fill="url(#logoGradientNew)" />
                <circle cx="20" cy="20" r="1.5" fill="white" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-concordia-pink/20 to-concordia-light-purple/20 rounded-lg blur-sm -z-10"></div>
            </div>
            <span className="text-white font-orbitron font-bold text-2xl tracking-wider uppercase">CONCORDIA</span>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => {
                setActiveTab("home")
                router.push("/?tab=home", undefined)
              }}
              className={
                "font-medium transition-colors " +
                (activeTab === "home" ? "text-concordia-pink" : "text-white/80 hover:text-concordia-pink")
              }
            >
              {"Home"}
            </button>
            <button
              onClick={() => {
                if (isConnected) {
                  setActiveTab("dashboard")
                  router.push("/?tab=dashboard", undefined)
                }
              }}
              className={
                "font-medium transition-colors " +
                (activeTab === "dashboard" ? "text-concordia-pink" : "text-white/80 hover:text-concordia-pink") +
                (!isConnected ? " opacity-50 cursor-not-allowed" : "")
              }
              title={!isConnected ? "Connect wallet to access dashboard" : ""}
            >
              {"Dashboard"}
            </button>
            <button
              onClick={() => isConnected ? router.push("/create-group") : null}
              className={
                "font-medium transition-colors " +
                "text-white/80 hover:text-concordia-pink" +
                (!isConnected ? " opacity-50 cursor-not-allowed" : "")
              }
              title={!isConnected ? "Connect wallet to create a group" : ""}
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
                  setActiveTab("home")
                  router.push("/?tab=home", undefined)
                  setMobileMenuOpen(false)
                }}
                className={
                  "block w-full text-left py-2 px-3 rounded-lg transition-colors " +
                  (activeTab === "home" ? "text-concordia-pink bg-concordia-pink/10" : "text-white/80 hover:text-concordia-pink hover:bg-concordia-pink/10")
                }
              >
                {"Home"}
              </button>
              <button
                onClick={() => {
                  if (isConnected) {
                    setActiveTab("dashboard")
                    router.push("/?tab=dashboard", undefined)
                    setMobileMenuOpen(false)
                  }
                }}
                className={
                  "block w-full text-left py-2 px-3 rounded-lg transition-colors " +
                  (activeTab === "dashboard" ? "text-concordia-pink bg-concordia-pink/10" : "text-white/80 hover:text-concordia-pink hover:bg-concordia-pink/10") +
                  (!isConnected ? " opacity-50 cursor-not-allowed" : "")
                }
                title={!isConnected ? "Connect wallet to access dashboard" : ""}
              >
                {"Dashboard"}
              </button>
              <button
                onClick={() => {
                  if (isConnected) {
                    router.push("/create-group")
                    setMobileMenuOpen(false)
                  }
                }}
                className={
                  "block w-full text-left py-2 px-3 rounded-lg transition-colors " +
                  "text-white/80 hover:text-concordia-pink hover:bg-concordia-pink/10" +
                  (!isConnected ? " opacity-50 cursor-not-allowed" : "")
                }
                title={!isConnected ? "Connect wallet to create a group" : ""}
              >
                {"Create Group"}
              </button>
            </div>
          </div>
        )}
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
                  <span className="bg-gradient-to-r from-concordia-pink via-concordia-light-purple to-concordia-pink bg-clip-text text-transparent">
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
                    className="bg-gradient-to-r from-concordia-pink via-concordia-light-purple to-concordia-pink hover:from-concordia-pink/90 hover:via-concordia-light-purple/90 hover:to-concordia-pink/90 text-white px-8 py-6 text-lg font-semibold shadow-lg"
                  >
                    {isConnected ? "Start Saving Together" : "Connect & Get Started"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  {isConnected && (
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => {
                        setActiveTab("dashboard")
                        router.push("/?tab=dashboard", undefined)
                      }}
                      className="border-concordia-light-purple text-concordia-light-purple hover:bg-concordia-light-purple/10 px-8 py-6 text-lg bg-transparent font-semibold"
                    >
                      {"View Dashboard"}
                    </Button>
                  )}
                </div>
              </div>
            </section>

            {/* Connect Wallet CTA Section */}
            {!isConnected && (
              <section id="connect-section" className="py-16">
                <Card className="max-w-2xl mx-auto bg-concordia-dark-blue border-concordia-pink/40 backdrop-blur-sm shadow-2xl">
                  <CardContent className="p-8 text-center">
                    <div className="relative mb-6">
                      <Wallet className="h-16 w-16 text-concordia-pink mx-auto relative z-10" />
                      <div className="absolute inset-0 bg-gradient-to-r from-concordia-pink/30 to-concordia-light-purple/30 rounded-full blur-xl -z-10"></div>
                    </div>
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
                    className="bg-concordia-dark-blue border-concordia-light-purple/30 hover:border-concordia-pink/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-lg"
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-concordia-pink/30 via-concordia-light-purple/20 to-concordia-pink/30 rounded-lg w-fit text-concordia-pink relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-concordia-pink/10 to-concordia-light-purple/10 rounded-lg blur-sm"></div>
                        <div className="relative z-10">{feature.icon}</div>
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
                        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-concordia-pink via-concordia-light-purple to-concordia-pink rounded-full flex items-center justify-center text-white font-bold text-xl relative shadow-lg">
                          <div className="absolute inset-0 bg-gradient-to-r from-concordia-pink/20 to-concordia-light-purple/20 rounded-full blur-md"></div>
                          <div className="relative z-10">{step.step}</div>
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
            <GroupDashboard groups={userGroups} onApproveWithdrawal={handleApproveWithdrawal} />
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
                  onClick={() => {
                    setActiveTab("home")
                    router.push("/?tab=home", undefined)
                  }}
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
                  onClick={() => {
                    if (isConnected) {
                      setActiveTab("dashboard")
                      router.push("/?tab=dashboard", undefined)
                    }
                  }}
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
