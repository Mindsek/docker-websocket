"use client";

import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { toast } from "sonner";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [backendUrl, setBackendUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/env")
      .then((res) => res.json())
      .then((data) => {
        setBackendUrl(data.API_URL);
      });
  }, []);

  useEffect(() => {
    if (!backendUrl) {
      return;
    }

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
  }, [backendUrl, toast]);

  return { socket, connected };
}
