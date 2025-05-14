"use client";

import { clientEnv } from "@/config/env-config";
import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { toast } from "sonner";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const backendUrl = clientEnv.NEXT_PUBLIC_API_URL;

    const socketInstance = io(backendUrl, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      console.log("Connected to WebSocket server");
      setConnected(true);
      toast.success("Connexion établie");
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
      setConnected(false);
      toast.error("Déconnecté");
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Connection error:", err);
      setConnected(false);
      toast.error("Erreur de connexion");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [toast]);

  return { socket, connected };
}
