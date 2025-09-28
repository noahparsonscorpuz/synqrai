"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Calendar, Users, Settings, Sparkles, Copy, Send, Plus, X, AlertCircle } from "lucide-react"

interface User {
  id: string
  name: string
  role: string
  organization: string
  type: string
}

interface MeetingCreatorProps {
  user: User
}

interface Constraint {
  id: string
  type: "time" | "day" | "duration" | "location" | "custom"
  description: string
  value: string
}

export function MeetingCreator({ user }: MeetingCreatorProps) {
  const [currentStep, setCurrentStep] = useState<"basic" | "constraints" | "participants" | "review">("basic")
  const [meetingData, setMeetingData] = useState({
    title: "",
    description: "",
    type: "",
    duration: 60,
    maxParticipants: 10,
    deadline: "",
    location: "",
    isRecurring: false,
    recurringPattern: "weekly",
  })
  const [constraints, setConstraints] = useState<Constraint[]>([])
  const [participants, setParticipants] = useState<string[]>([])
  const [newParticipant, setNewParticipant] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [inviteLink, setInviteLink] = useState("")

  const meetingTypes = [
    { value: "team-meeting", label: "Team Meeting", icon: Users },
    { value: "study-group", label: "Study Group", icon: Calendar },
    { value: "club-event", label: "Club Event", icon: Calendar },
    { value: "interview", label: "Interview", icon: Users },
    { value: "networking", label: "Networking", icon: Users },
    { value: "workshop", label: "Workshop", icon: Settings },
    { value: "one-on-one", label: "1:1 Meeting", icon: Users },
    { value: "custom", label: "Custom", icon: Settings },
  ]

  const constraintTypes = [
    { value: "time", label: "Time Restrictions", description: "Limit to specific hours" },
    { value: "day", label: "Day Restrictions", description: "Exclude certain days" },
    { value: "duration", label: "Duration Limits", description: "Min/max meeting length" },
    { value: "location", label: "Location Requirements", description: "Physical or virtual constraints" },
    { value: "custom", label: "Custom Rule", description: "Advanced scheduling rules" },
  ]

  const addConstraint = (type: string) => {
    const newConstraint: Constraint = {
      id: Date.now().toString(),
      type: type as any,
      description: "",
      value: "",
    }
    setConstraints([...constraints, newConstraint])
  }

  const removeConstraint = (id: string) => {
    setConstraints(constraints.filter((c) => c.id !== id))
  }

  const updateConstraint = (id: string, field: string, value: string) => {
    setConstraints(constraints.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  const addParticipant = () => {
    if (newParticipant && !participants.includes(newParticipant)) {
      setParticipants([...participants, newParticipant])
      setNewParticipant("")
    }
  }

  const removeParticipant = (email: string) => {
    setParticipants(participants.filter((p) => p !== email))
  }

  const createMeeting = async () => {
    setIsCreating(true)
    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: meetingData.title,
          description: meetingData.description,
          duration: meetingData.duration,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Failed to create meeting (${res.status})`)
      }
      const { meeting } = await res.json()
      setInviteLink(`${window.location.origin}/invite/${meeting.id}`)
    } catch (e) {
      console.error("Create meeting failed", e)
    } finally {
      setIsCreating(false)
    }
  }

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
  }

  if (inviteLink) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[var(--thermal-1)] to-[var(--thermal-3)] flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Meeting Created Successfully!</h1>
          <p className="text-muted-foreground">Your AI-powered scheduling event is ready to collect availability</p>
        </div>

        <Card className="max-w-2xl mx-auto border-[var(--thermal-2)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {meetingData.title}
            </CardTitle>
            <CardDescription>{meetingData.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">{meetingData.duration} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Participants:</span>
                <span className="font-medium">{meetingData.maxParticipants}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Response Deadline:</span>
                <span className="font-medium">{meetingData.deadline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Constraints:</span>
                <span className="font-medium">{constraints.length} rules</span>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-medium mb-2 block">Invite Link</Label>
              <div className="flex gap-2">
                <Input value={inviteLink} readOnly className="bg-muted" />
                <Button onClick={copyInviteLink} variant="outline">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() =>
                  window.open(
                    `mailto:?subject=You're invited: ${meetingData.title}&body=Please share your availability: ${inviteLink}`,
                  )
                }
                className="flex-1 bg-gradient-to-r from-[var(--thermal-1)] to-[var(--thermal-3)] text-white border-0"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Email Invites
              </Button>
              <Button onClick={() => setInviteLink("")} variant="outline">
                Create Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Create New Meeting</h1>
        <p className="text-muted-foreground">Set up an AI-powered scheduling event with custom rules and constraints</p>
      </div>

      <Tabs value={currentStep} onValueChange={(value) => setCurrentStep(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="constraints">Rules & Constraints</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="review">Review & Create</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Meeting Details
              </CardTitle>
              <CardDescription>Basic information about your meeting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Meeting Title *</Label>
                  <Input
                    id="title"
                    value={meetingData.title}
                    onChange={(e) => setMeetingData({ ...meetingData, title: e.target.value })}
                    placeholder="Weekly Team Standup"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Meeting Type</Label>
                  <Select
                    value={meetingData.type}
                    onValueChange={(value) => setMeetingData({ ...meetingData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select meeting type" />
                    </SelectTrigger>
                    <SelectContent>
                      {meetingTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={meetingData.description}
                  onChange={(e) => setMeetingData({ ...meetingData, description: e.target.value })}
                  placeholder="Describe the purpose and agenda of this meeting..."
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={meetingData.duration}
                    onChange={(e) => setMeetingData({ ...meetingData, duration: Number(e.target.value) })}
                    min="15"
                    max="480"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={meetingData.maxParticipants}
                    onChange={(e) => setMeetingData({ ...meetingData, maxParticipants: Number(e.target.value) })}
                    min="2"
                    max="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Response Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={meetingData.deadline}
                    onChange={(e) => setMeetingData({ ...meetingData, deadline: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  value={meetingData.location}
                  onChange={(e) => setMeetingData({ ...meetingData, location: e.target.value })}
                  placeholder="Conference Room A, Zoom, or leave blank for TBD"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="recurring"
                  checked={meetingData.isRecurring}
                  onCheckedChange={(checked) => setMeetingData({ ...meetingData, isRecurring: checked })}
                />
                <Label htmlFor="recurring">Recurring Meeting</Label>
              </div>

              {meetingData.isRecurring && (
                <div className="space-y-2">
                  <Label>Recurrence Pattern</Label>
                  <Select
                    value={meetingData.recurringPattern}
                    onValueChange={(value) => setMeetingData({ ...meetingData, recurringPattern: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="constraints" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Scheduling Rules & Constraints
              </CardTitle>
              <CardDescription>Define rules to guide the AI optimization engine</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {constraintTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant="outline"
                    onClick={() => addConstraint(type.value)}
                    className="h-auto p-4 flex flex-col items-start gap-2"
                  >
                    <div className="font-medium">{type.label}</div>
                    <div className="text-xs text-muted-foreground text-left">{type.description}</div>
                  </Button>
                ))}
              </div>

              {constraints.length > 0 && (
                <div className="space-y-3">
                  <Separator />
                  <h4 className="font-medium">Active Constraints</h4>
                  {constraints.map((constraint) => (
                    <Card key={constraint.id} className="border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{constraint.type}</Badge>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeConstraint(constraint.id)}
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="space-y-2">
                              <Input
                                placeholder="Constraint description..."
                                value={constraint.description}
                                onChange={(e) => updateConstraint(constraint.id, "description", e.target.value)}
                              />
                              <Input
                                placeholder="Constraint value (e.g., 9:00-17:00, Mon-Fri, etc.)"
                                value={constraint.value}
                                onChange={(e) => updateConstraint(constraint.id, "value", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {constraints.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No constraints added yet</p>
                  <p className="text-sm">Add rules above to guide the AI scheduling optimization</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Invite Participants
              </CardTitle>
              <CardDescription>Add email addresses of people to invite</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter email address..."
                  value={newParticipant}
                  onChange={(e) => setNewParticipant(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addParticipant()}
                />
                <Button onClick={addParticipant}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {participants.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Invited Participants ({participants.length})</h4>
                  <div className="space-y-2">
                    {participants.map((email) => (
                      <div key={email} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                        <span className="text-sm">{email}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeParticipant(email)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {participants.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No participants added yet</p>
                  <p className="text-sm">Add email addresses above to send invitations</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Review & Create Meeting
              </CardTitle>
              <CardDescription>Review your settings before creating the AI-powered scheduling event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Meeting Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Title:</span>
                      <span className="font-medium">{meetingData.title || "Untitled"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">{meetingData.type || "Not selected"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{meetingData.duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max Participants:</span>
                      <span className="font-medium">{meetingData.maxParticipants}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deadline:</span>
                      <span className="font-medium">{meetingData.deadline || "Not set"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Configuration</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Constraints:</span>
                      <span className="font-medium">{constraints.length} rules</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Participants:</span>
                      <span className="font-medium">{participants.length} invited</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Recurring:</span>
                      <span className="font-medium">{meetingData.isRecurring ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium">{meetingData.location || "TBD"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <Button
                onClick={createMeeting}
                disabled={!meetingData.title || isCreating}
                className="w-full bg-gradient-to-r from-[var(--thermal-1)] to-[var(--thermal-3)] text-white border-0 shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                {isCreating ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Meeting...
                  </div>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Create AI-Powered Meeting
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
