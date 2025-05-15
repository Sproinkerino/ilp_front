import { Avatar } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Loader2 } from "lucide-react"

interface ChatMessageProps {
  content: string
  isUser?: boolean
  timestamp?: string
  isLoading?: boolean
}

export default function ChatMessage({
  content,
  isUser = false,
  timestamp = "Just now",
  isLoading = false,
}: ChatMessageProps) {
  return (
    <div className={cn("flex gap-4 mb-6", isUser ? "flex-row-reverse" : "flex-row")}>
      <Avatar className="h-10 w-10 shrink-0 border border-gray-700">
        <Image
          src={isUser ? "/user-avatar.svg" : "/ai-avatar.svg"}
          alt={isUser ? "User" : "AI Assistant"}
          width={40}
          height={40}
          className="rounded-full"
        />
      </Avatar>
      <div className={cn("flex flex-col max-w-[80%]", isUser ? "items-end" : "items-start")}>
        <div className={cn(
          "px-4 py-3 rounded-lg min-h-[44px] flex items-center",
          isUser ? "bg-gray-700 text-gray-100" : "bg-gray-800 text-gray-100"
        )}>
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          ) : (
            <p>{content}</p>
          )}
        </div>
        <span className="text-xs text-gray-400 mt-1">{timestamp}</span>
      </div>
    </div>
  )
}
