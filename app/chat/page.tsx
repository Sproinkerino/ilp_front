"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Paperclip, ArrowUp } from "lucide-react"
import ChatHeader from "@/components/chat-header"
import ChatMessage from "@/components/chat-message"

interface Message {
  content: string
  isUser: boolean
  timestamp: Date
}

export default function ChatInterface() {
  console.log('Component rendered') // Log when component renders

  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Add initial focus
  useEffect(() => {
    console.log('Initial focus effect running') // Log when initial focus runs
    inputRef.current?.focus()
  }, [])

  const scrollToBottom = () => {
    console.log('Scrolling to bottom') // Log when scrolling
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    console.log('Messages updated, scrolling') // Log when messages change
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (message: string = inputMessage) => {
    console.log('Sending message:', message) // Log when sending message
    if (!message.trim()) return

    const userMessage: Message = {
      content: message,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // Add a temporary loading message
    const tempMessage: Message = {
      content: "",
      isUser: false,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, tempMessage])

    try {
      console.log('Making API request') // Log before API call
      const response = await fetch("https://ins-api-unrz.onrender.com/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
        }),
      })

      const data = await response.json()
      console.log('API response:', data) // Log API response
      
      // Replace the loading message with the actual response
      setMessages((prev) => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1] = {
          content: data.response || data.message || "No response",
          isUser: false,
          timestamp: new Date(),
        }
        return newMessages
      })
    } catch (error) {
      console.error("API Error:", error) // This was already here
      // Replace loading message with error message
      setMessages((prev) => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1] = {
          content: "Sorry, there was an error processing your request.",
          isUser: false,
          timestamp: new Date(),
        }
        return newMessages
      })
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        console.log('Focusing input after message') // Log when focusing
        inputRef.current?.focus()
      }, 0)
    }
  }

  const handleQuickQuestion = (question: string) => {
    console.log('Quick question clicked:', question) // Log quick question
    setInputMessage(question)
    handleSendMessage(question)
  }

  // Rest of the component remains the same...
  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-gray-100">
      <ChatHeader />

      <main className="flex-1 flex flex-col p-4 md:p-8 max-w-4xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
              What can I help you with?
            </h1>

            <div className="flex flex-wrap gap-2 justify-center mb-12">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-gray-700 text-gray-200 hover:bg-gray-800 hover:text-gray-100"
                onClick={() => handleQuickQuestion("Should I cancel my ILP?")}
                suppressHydrationWarning
              >
                Should I cancel my ILP?
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-gray-700 text-gray-200 hover:bg-gray-800 hover:text-gray-100"
                onClick={() => handleQuickQuestion("Should I buy an ILP?")}
                suppressHydrationWarning
              >
                Should I buy an ILP?
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-gray-700 text-gray-200 hover:bg-gray-800 hover:text-gray-100"
                onClick={() => handleQuickQuestion("What is an ILP?")}
                suppressHydrationWarning
              >
                What is an ILP?
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-gray-700 text-gray-200 hover:bg-gray-800 hover:text-gray-100"
                onClick={() => handleQuickQuestion("ILP vs Term Insurance")}
                suppressHydrationWarning
              >
                ILP vs Term Insurance
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto mb-4 space-y-6">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                content={message.content}
                isUser={message.isUser}
                timestamp={message.timestamp.toLocaleTimeString()}
                isLoading={!message.isUser && isLoading && index === messages.length - 1}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="relative">
          <Input
            ref={inputRef}
            placeholder="Ask a question"
            className="pr-24 py-6 text-base rounded-lg border border-gray-700 bg-gray-900 text-gray-100"
            value={inputMessage}
            onChange={(e) => {
              console.log('Input changed:', e.target.value) // Log input changes
              setInputMessage(e.target.value)
            }}
            onKeyPress={(e) => {
              console.log('Key pressed:', e.key) // Log key presses
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            disabled={isLoading}
            suppressHydrationWarning
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-gray-100"
              disabled={isLoading}
              suppressHydrationWarning
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              className="h-8 w-8 rounded-full bg-gray-700 hover:bg-gray-600"
              onClick={() => handleSendMessage()}
              disabled={isLoading}
              suppressHydrationWarning
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}