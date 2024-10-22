import { ScrollArea, Button } from "@mantine/core";
import ChatMessage from "./ChatMessage";
import { useState, useEffect, useRef } from "react";

export default function ChatMessages() {
  const [messages, setMessages] = useState([
    { text: "Hello there!", fromUser: false, timestamp: "2024-10-20 14:20" },
    { text: "Hi! How are you?", fromUser: true, timestamp: "2024-10-20 14:21" },
    {
      text: "I'm doing well, thanks! What about you?",
      fromUser: false,
      timestamp: "2024-10-20 14:22",
    },
    {
      text: "I'm okay, just finding this economy really tough.",
      fromUser: true,
      timestamp: "2024-10-20 14:23",
    },
    {
      text: "Yeah, it's definitely challenging. How are you managing?",
      fromUser: false,
      timestamp: "2024-10-20 14:24",
    },
    {
      text: "Cutting back on non-essentials, trying to save more.",
      fromUser: true,
      timestamp: "2024-10-20 14:25",
    },
    {
      text: "Smart move. Any tips for others in the same boat?",
      fromUser: false,
      timestamp: "2024-10-20 14:26",
    },
    {
      text: "Track your expenses and look for deals where you can.",
      fromUser: true,
      timestamp: "2024-10-20 14:27",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div>
      <ScrollArea style={{ height: "70vh", padding: "1rem" }}>
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg.text}
            fromUser={msg.fromUser}
            timestamp={msg.timestamp}
          />
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>
    </div>
  );
}
