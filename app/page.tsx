"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Lock, Trophy, Target, Zap, TrendingUp, Star, ArrowRight, CheckCircle } from "lucide-react"
import { WalletConnect } from "@/components/wallet-connect"

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0)

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
      title: "Create Your Group",
      description: "Invite 2-10 friends and set your shared savings goal",
    },
    {
      step: "02",
      title: "Set Contribution Schedule",
      description: "Choose weekly or monthly contributions that work for everyone",
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

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="border-b border-[#7226FF]/20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <svg width="32" height="32" viewBox="0 0 32 32" className="relative z-10">
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F042FF" />
                      <stop offset="50%" stopColor="#7226FF" />
                      <stop offset="100%" stopColor="#160078" />
                    </linearGradient>
                  </defs>
                  {/* Outer ring representing unity */}
                  <circle
                    cx="16"
                    cy="16"
                    r="15"
                    fill="none"
                    stroke="url(#logoGradient)"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                  {/* Inner connected nodes representing friends */}
                  <circle cx="16" cy="8" r="3" fill="#F042FF" />
                  <circle cx="24" cy="16" r="3" fill="#7226FF" />
                  <circle cx="16" cy="24" r="3" fill="#F042FF" />
                  <circle cx="8" cy="16" r="3" fill="#7226FF" />
                  {/* Connection lines */}
                  <line x1="16" y1="8" x2="24" y2="16" stroke="url(#logoGradient)" strokeWidth="1.5" opacity="0.8" />
                  <line x1="24" y1="16" x2="16" y2="24" stroke="url(#logoGradient)" strokeWidth="1.5" opacity="0.8" />
                  <line x1="16" y1="24" x2="8" y2="16" stroke="url(#logoGradient)" strokeWidth="1.5" opacity="0.8" />
                  <line x1="8" y1="16" x2="16" y2="8" stroke="url(#logoGradient)" strokeWidth="1.5" opacity="0.8" />
                  {/* Center node representing the goal */}
                  <circle cx="16" cy="16" r="2" fill="#F042FF" />
                </svg>
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#F042FF]/20 to-[#7226FF]/20 rounded-full blur-sm -z-10"></div>
              </div>
              <span className="text-white font-bold text-xl tracking-wide">Concordia</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-white/80 hover:text-[#F042FF] transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-white/80 hover:text-[#F042FF] transition-colors">
              How It Works
            </a>
            <a href="#roadmap" className="text-white/80 hover:text-[#F042FF] transition-colors">
              Roadmap
            </a>
          </div>
          <WalletConnect />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-[#7226FF]/20 text-[#F042FF] border-[#F042FF]/30">
            Built on opBNB • Low Fees • Fast Transactions
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Save Money
            <span className="bg-gradient-to-r from-[#F042FF] to-[#7226FF] bg-clip-text text-transparent">
              {" "}
              Together
            </span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Concordia helps small groups of friends save money together for shared goals. Lock funds in smart contracts,
            earn Aura Points for consistency, and achieve your dreams collectively.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#F042FF] to-[#7226FF] hover:from-[#F042FF]/80 hover:to-[#7226FF]/80 text-white px-8 py-6 text-lg"
            >
              Start Saving Together
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#7226FF] text-[#7226FF] hover:bg-[#7226FF]/10 px-8 py-6 text-lg bg-transparent"
            >
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#F042FF] mb-2">2-10</div>
            <div className="text-white/80">Friends per Group</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#7226FF] mb-2">100%</div>
            <div className="text-white/80">Secure & Transparent</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#F042FF] mb-2">0.001</div>
            <div className="text-white/80">BNB Transaction Fees</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose <span className="text-[#F042FF]">Concordia</span>?
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Built for friends who want to save together without the hassle of traditional methods
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-black/40 border-[#7226FF]/30 hover:border-[#F042FF]/50 transition-all duration-300 hover:scale-105"
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-[#F042FF]/20 to-[#7226FF]/20 rounded-lg w-fit text-[#F042FF]">
                  {feature.icon}
                </div>
                <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/70 text-center">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-white/80 text-lg">Simple steps to start saving with your friends</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-[#F042FF] to-[#7226FF] rounded-full flex items-center justify-center text-white font-bold text-xl">
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

      {/* Aura Points Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-[#F042FF]/20 text-[#F042FF] border-[#F042FF]/30">Aura Points System</Badge>
              <h2 className="text-4xl font-bold text-white mb-6">
                Build Trust Through
                <span className="text-[#F042FF]"> Consistency</span>
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Earn Aura Points for timely contributions and consistent participation. Build your reputation within the
                community and unlock exclusive benefits.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-[#7226FF]" />
                  <span className="text-white">Streak rewards for consistent contributions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-[#7226FF]" />
                  <span className="text-white">Trust score visible to group members</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-[#7226FF]" />
                  <span className="text-white">Unlock future benefits and recognition</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Card className="bg-gradient-to-br from-[#160078]/50 to-[#010030]/50 border-[#7226FF]/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Star className="h-6 w-6 text-[#F042FF] mr-2" />
                    Your Aura Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-[#F042FF] mb-2">847</div>
                    <div className="text-white/80 mb-4">Aura Points</div>
                    <div className="bg-[#7226FF]/20 rounded-full h-2 mb-4">
                      <div className="bg-gradient-to-r from-[#F042FF] to-[#7226FF] h-2 rounded-full w-3/4"></div>
                    </div>
                    <div className="text-sm text-white/70">Next milestone: 1000 points</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            The Future of <span className="text-[#7226FF]">Concordia</span>
          </h2>
          <p className="text-white/80 text-lg">Expanding beyond savings into a complete financial ecosystem</p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-black/40 border-[#7226FF]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Trophy className="h-6 w-6 text-[#F042FF] mr-2" />
                Milestone Celebrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/70">
                Trigger fun on-chain rewards and visual celebrations when groups hit their savings goals.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-[#7226FF]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="h-6 w-6 text-[#7226FF] mr-2" />
                DAO-style Governance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/70">
                Voting mechanisms for bigger teams to make collective decisions about withdrawals and goals.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-[#7226FF]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="h-6 w-6 text-[#F042FF] mr-2" />
                Tiered Saving Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/70">
                Flexible contribution options based on member preferences and income levels.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-[#7226FF]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="h-6 w-6 text-[#7226FF] mr-2" />
                Community Leaderboards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/70">
                Cross-group competitions and community rewards to encourage friendly competition.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Saving Together?</h2>
          <p className="text-white/80 text-lg mb-8">
            Join the future of group savings and achieve your goals with friends.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#F042FF] to-[#7226FF] hover:from-[#F042FF]/80 hover:to-[#7226FF]/80 text-white px-12 py-6 text-lg"
          >
            Launch App
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#7226FF]/20 bg-black/20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <svg width="32" height="32" viewBox="0 0 32 32" className="relative z-10">
                    <defs>
                      <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F042FF" />
                        <stop offset="50%" stopColor="#7226FF" />
                        <stop offset="100%" stopColor="#160078" />
                      </linearGradient>
                    </defs>
                    {/* Outer ring representing unity */}
                    <circle
                      cx="16"
                      cy="16"
                      r="15"
                      fill="none"
                      stroke="url(#footerLogoGradient)"
                      strokeWidth="2"
                      opacity="0.6"
                    />
                    {/* Inner connected nodes representing friends */}
                    <circle cx="16" cy="8" r="3" fill="#F042FF" />
                    <circle cx="24" cy="16" r="3" fill="#7226FF" />
                    <circle cx="16" cy="24" r="3" fill="#F042FF" />
                    <circle cx="8" cy="16" r="3" fill="#7226FF" />
                    {/* Connection lines */}
                    <line
                      x1="16"
                      y1="8"
                      x2="24"
                      y2="16"
                      stroke="url(#footerLogoGradient)"
                      strokeWidth="1.5"
                      opacity="0.8"
                    />
                    <line
                      x1="24"
                      y1="16"
                      x2="16"
                      y2="24"
                      stroke="url(#footerLogoGradient)"
                      strokeWidth="1.5"
                      opacity="0.8"
                    />
                    <line
                      x1="16"
                      y1="24"
                      x2="8"
                      y2="16"
                      stroke="url(#footerLogoGradient)"
                      strokeWidth="1.5"
                      opacity="0.8"
                    />
                    <line
                      x1="8"
                      y1="16"
                      x2="16"
                      y2="8"
                      stroke="url(#footerLogoGradient)"
                      strokeWidth="1.5"
                      opacity="0.8"
                    />
                    {/* Center node representing the goal */}
                    <circle cx="16" cy="16" r="2" fill="#F042FF" />
                  </svg>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#F042FF]/20 to-[#7226FF]/20 rounded-full blur-sm -z-10"></div>
                </div>
                <span className="text-white font-bold text-xl tracking-wide">Concordia</span>
              </div>
              <p className="text-white/70">Empowering friends to save money together through blockchain technology.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                <a href="#" className="block text-white/70 hover:text-[#F042FF]">
                  Features
                </a>
                <a href="#" className="block text-white/70 hover:text-[#F042FF]">
                  How It Works
                </a>
                <a href="#" className="block text-white/70 hover:text-[#F042FF]">
                  Roadmap
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <div className="space-y-2">
                <a href="#" className="block text-white/70 hover:text-[#F042FF]">
                  Discord
                </a>
                <a href="#" className="block text-white/70 hover:text-[#F042FF]">
                  Twitter
                </a>
                <a href="#" className="block text-white/70 hover:text-[#F042FF]">
                  Telegram
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <div className="space-y-2">
                <a href="#" className="block text-white/70 hover:text-[#F042FF]">
                  Documentation
                </a>
                <a href="#" className="block text-white/70 hover:text-[#F042FF]">
                  Smart Contracts
                </a>
                <a href="#" className="block text-white/70 hover:text-[#F042FF]">
                  Security
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-[#7226FF]/20 mt-8 pt-8 text-center">
            <p className="text-white/70">© 2024 Concordia. Built on opBNB. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
