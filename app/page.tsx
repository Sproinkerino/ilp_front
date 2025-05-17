"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push("/chat")
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      <div className="text-gray-100">Redirecting to chat...</div>
    </div>
  )
}