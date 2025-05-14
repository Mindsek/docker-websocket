"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSocket } from "@/hooks/use-socket";
import type { Message } from "@/types/message";
import { useEffect, useState } from "react";
import MessageInput from "./message-input";
import MessageList from "./message-list";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { socket, connected } = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Écouter les nouveaux messages
    socket.on("createMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Récupérer tous les messages au chargement
    socket.emit("findAllMessages", {}, (response: Message[]) => {
      if (Array.isArray(response)) {
        setMessages(response);
      }
    });

    return () => {
      socket.off("createMessage");
    };
  }, [socket]);

  const sendMessage = (content: string) => {
    if (!socket || !content.trim()) return;

    socket.emit("createMessage", {
      content,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-muted/50 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Messages</CardTitle>
          <Badge variant={connected ? "default" : "destructive"}>
            {connected ? "Connecté" : "Déconnecté"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-[70vh] flex flex-col">
        <MessageList messages={messages} />
        <MessageInput onSendMessage={sendMessage} disabled={!connected} />
      </CardContent>
    </Card>
  );
}
