import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import Image from "next/image"

interface ProjectSuggestionProps {
  title: string
  image: string
  forks: string
  avatarSrc: string
}

export default function ProjectSuggestion({ title, image, forks, avatarSrc }: ProjectSuggestionProps) {
  return (
    <Card className="overflow-hidden group cursor-pointer transition-all hover:shadow-md">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <Image src={avatarSrc || "/placeholder.svg"} alt="Avatar" width={32} height={32} className="rounded-full" />
          </Avatar>
          <span className="font-medium">{title}</span>
        </div>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3" />
            <path d="M18 4h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-3" />
            <path d="M16 8V4H8" />
            <path d="M4 16h8v4" />
          </svg>
          {forks} Forks
        </div>
      </div>
    </Card>
  )
}
