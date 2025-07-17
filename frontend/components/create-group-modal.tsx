"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { SmartContractIntegration } from "@/components/smart-contract-integration"
import { CheckCircle } from "lucide-react"

interface CreateGroupModalProps {
  isOpen: boolean
  onClose: () => void
  onGroupCreated: (groupData: {
    name: string
    description: string
    targetAmount: number
    numMembers: number
    contributionFrequency: "weekly" | "monthly"
    lockDuration: number
  }) => void
}

export function CreateGroupModal({ isOpen, onClose, onGroupCreated }: CreateGroupModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    groupName: "",
    groupDescription: "",
    targetAmount: "",
    numMembers: 2,
    contributionFrequency: "weekly",
    lockDuration: 30,
  })

  const totalSteps = 4

  const handleNext = () => {
    // Basic validation for current step before moving to next
    if (step === 1 && (!formData.groupName || !formData.groupDescription)) {
      alert("Please fill in group name and description.")
      return
    }
    if (step === 2 && (Number(formData.targetAmount) <= 0 || formData.numMembers < 2 || formData.numMembers > 10)) {
      alert("Please enter a valid target amount and number of members (2-10).")
      return
    }
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleCreateGroupSuccess = () => {
    onGroupCreated({
      name: formData.groupName,
      description: formData.groupDescription,
      targetAmount: Number(formData.targetAmount),
      numMembers: formData.numMembers,
      contributionFrequency: formData.contributionFrequency as "weekly" | "monthly",
      lockDuration: formData.lockDuration,
    })
    setStep(1) // Reset for next time
    setFormData({
      groupName: "",
      groupDescription: "",
      targetAmount: "",
      numMembers: 2,
      contributionFrequency: "weekly",
      lockDuration: 30,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-concordia-purple border-concordia-light-purple/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-concordia-pink text-2xl">{"Create New Savings Group"}</DialogTitle>
          <DialogDescription className="text-white/70">
            {"Follow the steps to configure your group savings."}
          </DialogDescription>
        </DialogHeader>

        <Progress value={(step / totalSteps) * 100} className="w-full h-2 bg-concordia-light-purple/20 mb-4" />

        <div className="grid gap-4 py-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="groupName" className="text-white">
                  {"Group Name"}
                </Label>
                <Input
                  id="groupName"
                  value={formData.groupName}
                  onChange={handleInputChange}
                  placeholder="e.g., Goa Trip 2025"
                  className="bg-concordia-dark-blue/50 border-concordia-light-purple/50 text-white placeholder:text-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="groupDescription" className="text-white">
                  {"Description"}
                </Label>
                <Textarea
                  id="groupDescription"
                  value={formData.groupDescription}
                  onChange={handleInputChange}
                  placeholder="A short description of your group's savings goal."
                  className="bg-concordia-dark-blue/50 border-concordia-light-purple/50 text-white placeholder:text-white/50"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="targetAmount" className="text-white">
                  {"Target Savings Amount (BNB)"}
                </Label>
                <Input
                  id="targetAmount"
                  type="number"
                  value={formData.targetAmount}
                  onChange={handleInputChange}
                  placeholder="10.0"
                  step="0.1"
                  min="0.1"
                  className="bg-concordia-dark-blue/50 border-concordia-light-purple/50 text-white placeholder:text-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numMembers" className="text-white">
                  {"Number of Members (including yourself)"}
                </Label>
                <Input
                  id="numMembers"
                  type="number"
                  value={formData.numMembers}
                  onChange={handleInputChange}
                  min="2"
                  max="10"
                  className="bg-concordia-dark-blue/50 border-concordia-light-purple/50 text-white placeholder:text-white/50"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contributionFrequency" className="text-white">
                  {"Contribution Frequency"}
                </Label>
                <Select
                  value={formData.contributionFrequency}
                  onValueChange={(value) => handleSelectChange("contributionFrequency", value)}
                >
                  <SelectTrigger className="bg-concordia-dark-blue/50 border-concordia-light-purple/50 text-white">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent className="bg-concordia-purple border-concordia-light-purple/50 text-white">
                    <SelectItem value="weekly">{"Weekly"}</SelectItem>
                    <SelectItem value="monthly">{"Monthly"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lockDuration" className="text-white">
                  {"Lock Duration (Days)"}
                </Label>
                <Select
                  value={String(formData.lockDuration)}
                  onValueChange={(value) => handleSelectChange("lockDuration", Number(value))}
                >
                  <SelectTrigger className="bg-concordia-dark-blue/50 border-concordia-light-purple/50 text-white">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-concordia-purple border-concordia-light-purple/50 text-white">
                    <SelectItem value="30">{"30 Days"}</SelectItem>
                    <SelectItem value="60">{"60 Days"}</SelectItem>
                    <SelectItem value="90">{"90 Days"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-concordia-light-purple/10 rounded-lg p-4 border border-concordia-light-purple/20 text-sm text-white/70">
                <p>
                  {"Funds will be locked for "}
                  <span className="font-semibold text-concordia-pink">{formData.lockDuration + " days"}</span>
                  {" and can only be withdrawn when all "}
                  <span className="font-semibold text-concordia-pink">{formData.numMembers + " members"}</span>
                  {" approve."}
                </p>
              </div>
            </div>
          )}

          {step === totalSteps + 1 && ( // Final summary/confirmation step
            <div className="space-y-4 text-white/80">
              <h3 className="text-xl font-semibold text-concordia-pink mb-4">{"Confirm Group Details"}</h3>
              <p>
                <span className="font-medium text-white">{"Group Name:"}</span> {formData.groupName}
              </p>
              <p>
                <span className="font-medium text-white">{"Description:"}</span> {formData.groupDescription}
              </p>
              <p>
                <span className="font-medium text-white">{"Target Amount:"}</span> {formData.targetAmount + " BNB"}
              </p>
              <p>
                <span className="font-medium text-white">{"Number of Members:"}</span> {formData.numMembers}
              </p>
              <p>
                <span className="font-medium text-white">{"Contribution Frequency:"}</span>{" "}
                {formData.contributionFrequency}
              </p>
              <p>
                <span className="font-medium text-white">{"Lock Duration:"}</span> {formData.lockDuration + " days"}
              </p>

              <SmartContractIntegration
                contributionAmount={String(Number(formData.targetAmount) / formData.numMembers)} // Initial contribution per member
                duration={String(formData.lockDuration)} // Pass lock duration as string
                onSuccess={handleCreateGroupSuccess}
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between items-center">
          {step > 1 && step <= totalSteps && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="border-concordia-light-purple/50 text-concordia-light-purple hover:bg-concordia-light-purple/10 bg-transparent"
            >
              {"Back"}
            </Button>
          )}
          <div className="flex-1"></div> {/* Spacer */}
          {step <= totalSteps && (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-concordia-pink to-concordia-light-purple hover:from-concordia-pink/80 hover:to-concordia-light-purple/80 text-white"
            >
              {"Next"}
            </Button>
          )}
          {step === totalSteps + 1 && (
            <Button
              onClick={handleCreateGroupSuccess} // This button is now handled by SmartContractIntegration
              disabled // Disable this button as SmartContractIntegration handles the actual creation
              className="bg-gradient-to-r from-concordia-pink to-concordia-light-purple hover:from-concordia-pink/80 hover:to-concordia-light-purple/80 text-white"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {"Create Group"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
