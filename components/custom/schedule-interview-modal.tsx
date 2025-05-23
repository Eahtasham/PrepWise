"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, FileText, Mic, ArrowLeft, Loader2 } from "lucide-react"

// This is a standalone version of the interview modal that doesn't rely on context
export function ScheduleInterviewModal({user}: {user: any}) {
    const [isOpen, setIsOpen] = useState(false)
    const [currentStep, setCurrentStep] = useState<"options" | "manual-form">("options")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    

    // Mock user data
    const mockUser = {
        id: "mock-user-123",
        name: "Mock User",
        email: "mock@example.com",
    }

    // Form state
    const [formData, setFormData] = useState({
        type: "",
        role: "",
        level: "",
        techstack: "",
        amount: "",
        company: "",
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setIsLoading(true)
        try {
            console.log("Submitting form with data:", {
                ...formData,
                userid: user.id,
                amount: Number.parseInt(formData.amount) || 5,
            })

            // Simulate API call
            const response = await fetch("/api/vapi/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    userid: user.id,
                    amount: Number.parseInt(formData.amount) || 5, // Default to 5 questions if not specified
                }),
            })

            // Reset form and close modal
            if (response.ok) {
                // Reset form and close modal
                setFormData({
                    type: "",
                    role: "",
                    level: "",
                    techstack: "",
                    amount: "",
                    company: "",
                })
                setCurrentStep("options")
                setIsOpen(false)

                // Optionally redirect to interviews page
                router.push("/dashboard/scheduled")
            } else {
                console.error("Failed to create interview")
            }

            // Optionally redirect
            // router.push("/dashboard/scheduled")
        } catch (error) {
            console.error("Error creating interview:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const resetModal = () => {
        setCurrentStep("options")
        setFormData({
            type: "",
            role: "",
            level: "",
            techstack: "",
            amount: "",
            company: "",
        })
    }

    return (
        <>
            <Button onClick={() => setIsOpen(true)} className="bg-teal-500 hover:bg-teal-600 text-white">
                Schedule Interview
            </Button>

            <Dialog
                open={isOpen}
                onOpenChange={(open: any) => {
                    console.log("Modal state changing to:", open)
                    setIsOpen(open)
                    if (!open) {
                        resetModal()
                    }
                }}
            >
                <DialogContent className="sm:max-w-[600px] bg-stone-950  border-teal-800 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-white">
                            {currentStep === "options" ? "Create New Interview" : "Manual Interview Setup"}
                        </DialogTitle>
                    </DialogHeader>

                    {currentStep === "options" && (
                        <div className="space-y-6 py-4">
                            <div className="grid gap-4">
                                {/* Manual Form Filling - Available */}
                                <Card
                                    className="bg-stone-950 dark-gradient border-teal-800 hover:bg-gray-750 transition-colors cursor-pointer"
                                    onClick={() => setCurrentStep("manual-form")}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-teal-900 rounded-lg">
                                                    <FileText className="h-5 w-5 text-teal-400" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-white">Manual Form Filling</CardTitle>
                                                    <CardDescription className="text-gray-400">
                                                        Create interview by filling out a detailed form
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <Badge className="bg-teal-900 text-teal-400 hover:bg-teal-900">Available</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-300">
                                            Customize your interview experience by manually selecting role, difficulty, tech stack, and more.
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Resume Parsed - Coming Soon */}
                                <Card className="bg-stone-950 dark-gradient border-teal-800 opacity-60 cursor-not-allowed">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-gray-700 rounded-lg">
                                                    <CalendarDays className="h-5 w-5 text-gray-500" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-gray-400">Resume Parsed</CardTitle>
                                                    <CardDescription className="text-gray-500">
                                                        Auto-generate interview based on your resume
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className="bg-gray-700 text-gray-400">
                                                Coming Soon
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-500">
                                            Upload your resume and let AI create a personalized interview experience.
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Voice Interacted - Coming Soon */}
                                <Card className="bg-stone-950 dark-gradient border-teal-800 opacity-60 cursor-not-allowed">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-gray-700 rounded-lg">
                                                    <Mic className="h-5 w-5 text-gray-500" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-gray-400">Voice Interacted</CardTitle>
                                                    <CardDescription className="text-gray-500">
                                                        Create interview through voice commands
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className="bg-gray-700 text-gray-400">
                                                Coming Soon
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-500">
                                            Simply speak your requirements and let AI set up your interview.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {currentStep === "manual-form" && (
                        <div className="space-y-6 py-4 ">
                            <div className="flex items-center space-x-2 mb-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setCurrentStep("options")}
                                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    Back
                                </Button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Interview Type */}
                                    <div className="space-y-2">
                                        <Label htmlFor="type" className="text-gray-300">
                                            Interview Type *
                                        </Label>
                                        <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:ring-teal-500">
                                                <SelectValue placeholder="Select interview type" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                                <SelectItem value="technical">Technical</SelectItem>
                                                <SelectItem value="behavioral">Behavioral</SelectItem>
                                                <SelectItem value="mixed">Mixed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Role */}
                                    <div className="space-y-2">
                                        <Label htmlFor="role" className="text-gray-300">
                                            Role *
                                        </Label>
                                        <Input
                                            id="role"
                                            value={formData.role}
                                            onChange={(e) => handleInputChange("role", e.target.value)}
                                            placeholder="e.g., Frontend Developer"
                                            className="bg-gray-800 border-gray-700 text-white focus-visible:ring-teal-500"
                                            required
                                        />
                                    </div>

                                    {/* Experience Level */}
                                    <div className="space-y-2">
                                        <Label htmlFor="level" className="text-gray-300">
                                            Experience Level *
                                        </Label>
                                        <Select value={formData.level} onValueChange={(value) => handleInputChange("level", value)}>
                                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:ring-teal-500">
                                                <SelectValue placeholder="Select experience level" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                                <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                                                <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                                                <SelectItem value="senior">Senior Level (5+ years)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Company */}
                                    <div className="space-y-2">
                                        <Label htmlFor="company" className="text-gray-300">
                                            Company
                                        </Label>
                                        <Input
                                            id="company"
                                            value={formData.company}
                                            onChange={(e) => handleInputChange("company", e.target.value)}
                                            placeholder="e.g., Google, Microsoft"
                                            className="bg-gray-800 border-gray-700 text-white focus-visible:ring-teal-500"
                                        />
                                    </div>
                                </div>

                                {/* Tech Stack */}
                                <div className="space-y-2">
                                    <Label htmlFor="techstack" className="text-gray-300">
                                        Tech Stack *
                                    </Label>
                                    <Input
                                        id="techstack"
                                        value={formData.techstack}
                                        onChange={(e) => handleInputChange("techstack", e.target.value)}
                                        placeholder="e.g., React, Node.js, TypeScript (comma separated)"
                                        className="bg-gray-800 border-gray-700 text-white focus-visible:ring-teal-500"
                                        required
                                    />
                                    <p className="text-xs text-gray-400">Enter technologies separated by commas</p>
                                </div>

                                {/* Number of Questions */}
                                <div className="space-y-2">
                                    <Label htmlFor="amount" className="text-gray-300">
                                        Number of Questions
                                    </Label>
                                    <Select value={formData.amount} onValueChange={(value) => handleInputChange("amount", value)}>
                                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:ring-teal-500">
                                            <SelectValue placeholder="Select number of questions" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                            <SelectItem value="3">3 Questions</SelectItem>
                                            <SelectItem value="5">5 Questions</SelectItem>
                                            <SelectItem value="10">10 Questions</SelectItem>
                                            <SelectItem value="15">15 Questions</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end space-x-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setCurrentStep("options")}
                                        className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isLoading || !formData.type || !formData.role || !formData.level || !formData.techstack}
                                        className="bg-teal-500 hover:bg-teal-600 text-white"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            "Create Interview"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
