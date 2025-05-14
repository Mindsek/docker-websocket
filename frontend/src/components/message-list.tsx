"use client"

import { useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { Message } from "@/types/message"

interface MessageListProps {
  messages: Message[]
}

export default function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll automatique vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <ScrollArea className="flex-1 p-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Aucun message. Soyez le premier à écrire !
        </div>
      ) : (
        messages.map((message, index) => {
          // Alternance des couleurs pour différencier les messages
          const isEven = index % 2 === 0

          return (
            <div key={index} className="mb-4">
              <div
                className={cn(
                  "rounded-lg px-4 py-2",
                  isEven ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                <div>{message.content}</div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(message.createdAt).toLocaleTimeString()}
              </div>
            </div>
          )
        })
      )}
      <div ref={messagesEndRef} />
    </ScrollArea>
  )
}
