"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Target, Plus, Copy, CheckCircle, XCircle, Hourglass } from "lucide-react" // Added Hourglass, CheckCircle, XCircle
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation" // Import useRouter

interface GroupMember {
  address: string
  nickname: string
  contributed: number
  auraPoints: number
  status: "active" | "pending" | "missed"
  hasApprovedWithdrawal?: boolean // New field for withdrawal approval
}

export interface SavingsGroup {
  id: string
  name: string
  description: string // New field
  goal: string // Kept for existing mock data, can be removed if description replaces it
  targetAmount: number
  currentAmount: number
  contributionAmount: number
  duration: string // e.g., "60 days"
  endDate: string
  nextContribution: string
  status: "active" | "completed" | "pending"
  members: GroupMember[]
  contributionFrequency: "weekly" | "monthly" // New field
  lockDuration: number // New field (in days)
  approvalStatus: Record<string, boolean> // New field: memberAddress -> boolean (approved or not)
}

interface GroupDashboardProps {
  groups: SavingsGroup[]
  onApproveWithdrawal: (groupId: string, memberAddress: string) => void // Callback for approval
}

export function GroupDashboard({ groups, onApproveWithdrawal }: GroupDashboardProps) {
  const { address } = useAccount()
  const router = useRouter() // Initialize useRouter
  const [selectedGroup, setSelectedGroup] = useState<SavingsGroup | null>(null)

  const handleContribute = (groupId: string) => {
    console.log("Contributing to group:", groupId)
    // Smart contract interaction would go here
  }

  const handleInviteFriend = (groupId: string) => {
    const inviteLink = window.location.origin + "/join/" + groupId
    navigator.clipboard.writeText(inviteLink)
    alert("Invite link copied to clipboard!")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "missed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Up to date"
      case "pending":
        return "Payment due"
      case "missed":
        return "Payment missed"
      default:
        return "Unknown"
    }
  }

  const calculateLockCountdown = (endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 0) {
      return "Unlocked"
    } else if (diffDays === 1) {
      return "1 day left"
    } else {
      return `${diffDays} days left`
    }
  }

  const totalActiveGroups = groups.length
  const totalSaved = groups.reduce((sum, group) => sum + group.currentAmount, 0)
  const totalAuraPoints = groups.reduce(
    (sum, group) => sum + group.members.reduce((memberSum, member) => memberSum + member.auraPoints, 0),
    0,
  )
  const onTimeRate =
    groups.length > 0 ? (groups.filter((group) => group.status === "active").length / groups.length) * 100 : 0

  if (!address) {
    return (
      <div className="text-center py-12">
        <h3 className="text-white text-xl mb-4">{"Connect your wallet to view your savings groups"}</h3>
        <p className="text-white/70">{"You need to connect your wallet to access the dashboard"}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          {"Your "}
          <span className="text-concordia-pink">{"Savings Dashboard"}</span>
        </h2>
        <p className="text-white/80 text-lg">{"Manage your active savings groups and track progress"}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-concordia-purple/20 border-concordia-light-purple/30 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-concordia-pink mb-2">{totalActiveGroups}</div>
            <div className="text-white/80 text-sm">{"Active Groups"}</div>
          </CardContent>
        </Card>
        <Card className="bg-concordia-purple/20 border-concordia-light-purple/30 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-concordia-light-purple mb-2">{totalSaved.toFixed(2) + " BNB"}</div>
            <div className="text-white/80 text-sm">{"Total Saved"}</div>
          </CardContent>
        </Card>
        <Card className="bg-concordia-purple/20 border-concordia-light-purple/30 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-concordia-pink mb-2">{totalAuraPoints}</div>
            <div className="text-white/80 text-sm">{"Aura Points"}</div>
          </CardContent>
        </Card>
        <Card className="bg-concordia-purple/20 border-concordia-light-purple/30 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-concordia-light-purple mb-2">{onTimeRate.toFixed(0) + "%"}</div>
            <div className="text-white/80 text-sm">{"On-time Rate"}</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Groups */}
      {groups.length === 0 ? (
        <Card className="bg-concordia-purple/20 border-concordia-light-purple/30 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 text-concordia-pink mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">{"No Active Savings Groups"}</h3>
            <p className="text-white/70 mb-6">
              {"You haven't created or joined any savings groups yet. Start one to achieve your goals!"}
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-concordia-pink to-concordia-light-purple hover:from-concordia-pink/80 hover:to-concordia-light-purple/80 text-white"
              onClick={() => router.push("/create-group")} // Navigate to new page
            >
              <Plus className="h-5 w-5 mr-2" />
              {"Create Your First Group"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {groups.map((group) => {
            const allMembersApproved = group.members.every((member) => group.approvalStatus[member.address])
            const isUserMember = group.members.some((member) => member.address === address)
            const userHasApproved = isUserMember && group.approvalStatus[address!]

            return (
              <Card
                key={group.id}
                className="bg-concordia-purple/20 border-concordia-light-purple/30 backdrop-blur-sm hover:border-concordia-pink/50 transition-all"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white text-xl">{group.name}</CardTitle>
                      <CardDescription className="text-white/70">{group.description || group.goal}</CardDescription>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{group.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/80">{"Progress"}</span>
                      <span className="text-concordia-pink font-semibold">
                        {group.currentAmount + " / " + group.targetAmount + " BNB"}
                      </span>
                    </div>
                    <Progress
                      value={(group.currentAmount / group.targetAmount) * 100}
                      className="h-2 bg-concordia-light-purple/20"
                    />
                    <div className="text-xs text-white/60 mt-1">
                      {Math.round((group.currentAmount / group.targetAmount) * 100) + "% complete"}
                    </div>
                  </div>

                  {/* Group Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm text-white/70">
                    <div>
                      <div className="font-semibold text-white">{"Frequency"}</div>
                      <div>{group.contributionFrequency}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-white">{"Lock Duration"}</div>
                      <div>{group.lockDuration + " days"}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-white">{"End Date"}</div>
                      <div>{group.endDate}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-white">{"Countdown"}</div>
                      <div className="flex items-center gap-1">
                        <Hourglass className="h-4 w-4 text-concordia-pink" />
                        {calculateLockCountdown(group.endDate)}
                      </div>
                    </div>
                  </div>

                  {/* Group Members */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-semibold text-sm">
                        {"Members (" + group.members.length + ")"}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleInviteFriend(group.id)}
                        className="border-concordia-light-purple/50 text-concordia-light-purple hover:bg-concordia-light-purple/10 text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {"Invite"}
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {group.members.map((member, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-concordia-dark-blue/30 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-concordia-light-purple/20 text-concordia-pink text-xs">
                                {member.nickname[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-white text-sm font-medium">{member.nickname}</div>
                              <div className="text-white/60 text-xs">
                                {member.address.slice(0, 6) + "..." + member.address.slice(-4)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={"w-2 h-2 rounded-full " + getStatusColor(member.status)}></div>
                            <span className="text-xs text-white/70">{getStatusText(member.status)}</span>
                            {group.approvalStatus[member.address] ? (
                              <CheckCircle className="h-4 w-4 text-green-400" title="Approved Withdrawal" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-400" title="Pending Withdrawal Approval" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next Contribution */}
                  <div className="bg-concordia-light-purple/10 rounded-lg p-4 border border-concordia-light-purple/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-semibold text-sm">{"Next Contribution"}</div>
                        <div className="text-white/70 text-xs">{"Due: " + group.nextContribution}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-concordia-pink font-bold">{group.contributionAmount + " BNB"}</div>
                        <Button
                          size="sm"
                          onClick={() => handleContribute(group.id)}
                          className="bg-gradient-to-r from-concordia-pink to-concordia-light-purple hover:from-concordia-pink/80 hover:to-concordia-light-purple/80 text-white text-xs mt-1"
                        >
                          {"Contribute Now"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Group Actions */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedGroup(group)}
                      className="flex-1 border-concordia-light-purple/50 text-concordia-light-purple hover:bg-concordia-light-purple/10"
                    >
                      {"View Details"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-concordia-pink/50 text-concordia-pink hover:bg-concordia-pink/10 bg-transparent"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Withdraw Button */}
                  <div className="pt-4 border-t border-concordia-light-purple/20">
                    <Button
                      onClick={() => console.log("Withdraw funds for group:", group.id)}
                      disabled={!allMembersApproved}
                      className={
                        "w-full py-3 text-lg font-semibold " +
                        (allMembersApproved
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-500/80 hover:to-emerald-600/80 text-white"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed")
                      }
                    >
                      {"Withdraw Funds"}
                    </Button>
                    {!allMembersApproved && (
                      <p className="text-center text-sm text-white/60 mt-2">{"All members must approve withdrawal."}</p>
                    )}
                    {isUserMember && !userHasApproved && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onApproveWithdrawal(group.id, address!)}
                        className="w-full mt-2 bg-concordia-pink/20 text-concordia-pink hover:bg-concordia-pink/30"
                      >
                        {"Approve Withdrawal"}
                      </Button>
                    )}
                    {isUserMember && userHasApproved && (
                      <p className="text-center text-sm text-green-400 mt-2">{"You have approved withdrawal."}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Create New Group CTA */}
      {groups.length > 0 && ( // Only show if there are existing groups
        <Card className="bg-gradient-to-r from-concordia-pink/10 to-concordia-light-purple/10 border-concordia-pink/30 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 text-concordia-pink mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">{"Ready for Another Goal?"}</h3>
            <p className="text-white/70 mb-6">{"Create a new savings group and invite your friends to join"}</p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-concordia-pink to-concordia-light-purple hover:from-concordia-pink/80 hover:to-concordia-light-purple/80 text-white"
              onClick={() => router.push("/create-group")} // Navigate to new page
            >
              <Plus className="h-5 w-5 mr-2" />
              {"Create New Group"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
