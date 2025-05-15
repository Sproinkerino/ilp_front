import { cn } from "../lib/utils"

interface ChatMessageProps {
  content: string
  isUser?: boolean
  timestamp?: string
  avatar?: string
}

export default function ChatMessage({
  content,
  isUser = false,
  timestamp = "Just now",
  avatar = "/placeholder.svg?height=40&width=40",
}: ChatMessageProps) {
  return (
    <div className={cn("flex gap-4 mb-6", isUser ? "flex-row-reverse" : "flex-row")}>
      <div className="h-10 w-10 shrink-0 border border-gray-700 rounded-full overflow-hidden">
        <img
          src={avatar || "/placeholder.svg"}
          alt={isUser ? "User" : "AI Assistant"}
          className="w-full h-full object-cover"
        />
      </div>
      <div className={cn("flex flex-col max-w-[80%]", isUser ? "items-end" : "items-start")}>
        <div className={cn("px-4 py-3 rounded-lg", isUser ? "bg-gray-700 text-gray-100" : "bg-gray-800 text-gray-100")}>
          <p>{content}</p>
        </div>
        <span className="text-xs text-gray-400 mt-1">{timestamp}</span>
      </div>
    </div>
  )
} 