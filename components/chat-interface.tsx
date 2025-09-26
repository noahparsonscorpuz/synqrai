"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Heart, Brain, Activity, AlertCircle, CheckCircle } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  type?: "diagnosis" | "recommendation" | "warning" | "success"
}

interface ChatInterfaceProps {
  userRole: "patient" | "doctor"
}

export function ChatInterface({ userRole }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        userRole === "patient"
          ? "Hello! I'm your AI health assistant. I can help you understand symptoms, provide health insights, and answer medical questions. How can I help you today?"
          : "Welcome, Doctor! I'm your AI diagnostic assistant. I can help analyze patient cases, suggest differential diagnoses, and provide clinical decision support. What case would you like to discuss?",
      sender: "ai",
      timestamp: new Date(),
      type: "success",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const patientResponses = [
    "Based on your symptoms, this could be related to several conditions. I recommend monitoring your symptoms and consulting with a healthcare provider if they persist.",
    "Your symptoms suggest you might be experiencing stress-related issues. Consider relaxation techniques and ensure you're getting adequate sleep.",
    "These symptoms could indicate a minor infection. Stay hydrated, rest well, and consider seeing a doctor if symptoms worsen.",
    "Your description suggests possible allergic reactions. Try to identify potential triggers and consider antihistamines if appropriate.",
    "This sounds like it could be related to dietary factors. Consider keeping a food diary to identify potential triggers.",
  ]

  const doctorResponses = [
    "Based on the clinical presentation, the differential diagnosis should include: 1) Primary condition with 85% likelihood, 2) Secondary condition with 12% likelihood, 3) Rare condition with 3% likelihood. Recommend further testing.",
    "The patient's symptoms and history suggest a complex case. Consider ordering CBC, CMP, and imaging studies. The presentation is consistent with inflammatory processes.",
    "This case presents interesting diagnostic challenges. The symptom constellation points toward autoimmune etiology. Recommend ANA, ESR, and CRP testing.",
    "Clinical decision support suggests this patient would benefit from multidisciplinary approach. Consider cardiology and endocrinology consultations.",
    "The AI analysis indicates high probability of treatment success with current protocol. Monitor biomarkers and adjust dosing based on patient response.",
  ]

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = userRole === "patient" ? patientResponses : doctorResponses
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: "ai",
        timestamp: new Date(),
        type: userRole === "doctor" ? "diagnosis" : "recommendation",
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const getMessageIcon = (message: Message) => {
    if (message.sender === "user") return <User className="h-4 w-4" />

    switch (message.type) {
      case "diagnosis":
        return <Brain className="h-4 w-4 text-purple-500" />
      case "recommendation":
        return <Heart className="h-4 w-4 text-blue-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Bot className="h-4 w-4" />
    }
  }

  const getMessageBadge = (message: Message) => {
    if (message.sender === "user") return null

    switch (message.type) {
      case "diagnosis":
        return (
          <Badge variant="secondary" className="text-xs">
            AI Diagnosis
          </Badge>
        )
      case "recommendation":
        return (
          <Badge variant="secondary" className="text-xs">
            Recommendation
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="destructive" className="text-xs">
            Warning
          </Badge>
        )
      case "success":
        return (
          <Badge variant="default" className="text-xs">
            AI Assistant
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            AI
          </Badge>
        )
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI {userRole === "patient" ? "Health Assistant" : "Diagnostic Assistant"}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">Online</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "ai" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {getMessageIcon(message)}
                    </div>
                  )}

                  <div className={`max-w-[80%] ${message.sender === "user" ? "order-first" : ""}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {getMessageBadge(message)}
                      <span className="text-xs text-muted-foreground">{message.timestamp.toLocaleTimeString()}</span>
                    </div>
                    <div
                      className={`rounded-lg px-4 py-3 ${
                        message.sender === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>

                  {message.sender === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted rounded-lg px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-6">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  userRole === "patient"
                    ? "Describe your symptoms or ask a health question..."
                    : "Enter patient case details or diagnostic question..."
                }
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {userRole === "patient"
                ? "This AI assistant provides general health information and is not a substitute for professional medical advice."
                : "AI diagnostic support tool for clinical decision making. Always verify with clinical judgment."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
