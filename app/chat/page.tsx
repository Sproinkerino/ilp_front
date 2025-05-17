"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [session, setSession] = useState<any>(null)
  const userId = useRef<string>(crypto.randomUUID())

  // Add initial focus
  useEffect(() => {
    console.log('Initial focus effect running')
    if (inputRef.current) {
      console.log('Focusing input on mount')
      inputRef.current.focus()
    } else {
      console.log('Input ref not available on mount')
    }
  }, [])

  // Add focus effect when loading state changes
  useEffect(() => {
    console.log('Loading state changed:', isLoading)
    if (!isLoading && inputRef.current) {
      console.log('Attempting to focus after loading')
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        if (inputRef.current) {
          console.log('Focusing input after loading')
          inputRef.current.focus()
        } else {
          console.log('Input ref not available after loading')
        }
      }, 100)
    }
  }, [isLoading])

  const scrollToBottom = () => {
    console.log('Scrolling to bottom')
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    console.log('Messages updated, scrolling')
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (message: string = inputMessage) => {
    console.log('=== Starting handleSendMessage ===')
    console.log('Input message:', message)
    console.log('Current session:', session)
    console.log('User ID:', userId.current)

    if (!message.trim()) return

    const userMessage: Message = {
      content: message.replace(/\n/g, '<br>'),
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
      const requestBody = {
        user_id: userId.current,
        session: session,
        message: message,
      }
      console.log('=== API Request ===')
      console.log('Request URL:', "https://ins-api-unrz.onrender.com/api/chat/")
      console.log('Request Body:', JSON.stringify(requestBody, null, 2))

      const response = await fetch("https://ins-api-unrz.onrender.com/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'API request failed')
      }

      const data = await response.json()
      console.log('Response data:', JSON.stringify(data, null, 2))
      
      // Update session state
      setSession(data.session)
      console.log('Updated session:', data.session)
      
      // Replace the loading message with the actual response
      setMessages((prev) => {
        const newMessages = [...prev]
        const responseContent = data.assistant_message || data.message
        if (!responseContent) {
          console.warn('No response content found in API response:', data)
        }
        
        // Clean the response content
        const cleanContent = responseContent
          ? responseContent
              .replace(/```html\n?/g, '') // Remove ```html
              .replace(/```\n?/g, '')     // Remove closing ```
          : "No response received from the server. Please try again."

        newMessages[newMessages.length - 1] = {
          content: cleanContent,
          isUser: false,
          timestamp: new Date(),
        }
        return newMessages
      })

      // If the conversation is done, show a summary
      if (data.done) {
        console.log('Conversation complete, showing summary')
        if (!data.session?.answers) {
          console.warn('No answers found in session data:', data.session)
        }
        const summaryMessage: Message = {
          content: `Thank you for providing all the information. Here's a summary of what we've collected:

<div class="bg-gray-800 p-4 rounded-lg mt-2">
<pre class="text-sm text-gray-200">${JSON.stringify(data.session?.answers || {}, null, 2)}</pre>
</div>`,
          isUser: false,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, summaryMessage])
      }
    } catch (error) {
      console.error("=== API Error ===")
      console.error("Error details:", error)
      // Replace loading message with error message
      setMessages((prev) => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1] = {
          content: error instanceof Error 
            ? `Error: ${error.message}`
            : "Sorry, there was an error processing your request. Please try again.",
          isUser: false,
          timestamp: new Date(),
        }
        return newMessages
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    console.log('Quick question clicked:', question) // Log quick question
    setInputMessage(question)
    handleSendMessage(question)
  }

  // Rest of the component remains the same...
  return (
    <div className="flex h-screen flex-col bg-gray-950 text-gray-100">
      <ChatHeader />

      <main className="flex-1 flex flex-col p-4 md:p-8 max-w-4xl mx-auto w-full h-[calc(100vh-8rem)]">
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
          <div className="flex-1 overflow-y-auto mb-4 space-y-6 pr-2" style={{ maxHeight: 'calc(100vh - 12rem)' }}>
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

        <div className="relative mt-auto">
          <Textarea
            ref={inputRef}
            placeholder="Ask a question"
            className="pr-24 py-6 text-base rounded-lg border border-gray-700 bg-gray-900 text-gray-100 resize-none min-h-[60px] max-h-[200px]"
            value={inputMessage}
            onChange={(e) => {
              console.log('Input changed:', e.target.value)
              setInputMessage(e.target.value)
            }}
            onKeyDown={(e) => {
              console.log('Key pressed:', e.key)
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            onFocus={() => console.log('Input focused')}
            onBlur={() => console.log('Input blurred')}
            disabled={isLoading}
            suppressHydrationWarning
          />
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
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