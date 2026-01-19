import { useEffect, useState, useRef } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { useAppContext } from "@/context/context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

// Setup Echo to listen to Reverb
if (typeof window !== "undefined") {
  window.Pusher = Pusher;
}

const echo = new Echo({
  broadcaster: "reverb",
  key: "k9tfoyoxjqydldgg2w6y",
  wsHost: "api.sosay.org",
  wsPort: 8080,
  wssPort: 443,
  forceTLS: true,
  enabledTransports: ["ws", "wss"],
});

export default function Chatpanel({ receiver, setShowChatPanel }) {
  const { accessToken, userInfo } = useAppContext();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  //   get message
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    if (!accessToken || !userInfo?.id) return;

    // Load old messages from DB
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://api.sosay.org/api/v1/chat/history/${receiver?.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response) {
          queryClient.invalidateQueries({
            queryKey: [`/chat/inbox`],
          });
        }

        const data = await response.json();
        const messages = Array.isArray(data) ? data : data.data;

        if (!messages) {
          console.error("Unexpected data format", data);
          return;
        }

        const formattedHistory = messages.map((msg) => ({
          text: msg.message,
          sender: msg.sender_id == userInfo.id ? "Me" : "Them",
          timestamp: msg.created_at,
        }));

        setChatHistory(formattedHistory);
      } catch (error) {
        console.error("Could not fetch history", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();

    // Listen for new real-time messages
    const channel = echo.channel(`chat.${userInfo.id}`);

    channel.listen(".message.sent", (e) => {
      console.log("Real-time Message received:", e);
      setChatHistory((prev) => [
        ...prev,
        { text: e.message, sender: "Them", timestamp: new Date() },
      ]);
    });

    return () => {
      channel.stopListening(".message.sent");
      echo.leave(`chat.${userInfo.id}`);
    };
  }, [accessToken, userInfo, receiver]);

  // send Message
  const sendMessage = async () => {
    if (!message.trim() || !accessToken) return;

    const optimisticMessage = {
      text: message,
      sender: "Me",
      timestamp: new Date(),
    };
    setChatHistory((prev) => [...prev, optimisticMessage]);

    try {
      const response = await fetch("https://api.sosay.org/api/v1/chat/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver_id: receiver?.user_id,
          message: message,
        }),
      });

      if (response) {
        queryClient.invalidateQueries({
          queryKey: [`/chat/inbox`],
        });
      }

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove optimistic message on error
      setChatHistory((prev) => prev.filter((msg) => msg !== optimisticMessage));
      alert("Failed to send message");
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section className="w-full h-full">
      {receiver ? (
        <div className="flex flex-col h-full lg:h-[calc(100dvh-90px)] bg-card shadow-sm lg:rounded-xl">
          {/* Chat Header */}
          <div className="border-b px-4 py-3 flex items-center gap-3 bg-card lg:rounded-t-xl">
            <button
              className="lg:hidden"
              onClick={() => setShowChatPanel(false)}
            >
              <ArrowLeft className="text-gray-400" />
            </button>
            <Avatar className="h-10 w-10">
              <AvatarImage src={receiver?.avatar} alt={receiver?.name} />
              <AvatarFallback className="capitalize bg-gradient-to-br from-secondary to-purple-600 text-white text-sm font-semibold">
                {getInitials(receiver?.name || "")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-lg">{receiver?.name}</h2>
              <p className="text-xs text-muted-foreground">
                {receiver?.is_online ? (
                  "Active now"
                ) : (
                  <span className="text-xs text-muted-foreground mt-1">
                    {receiver?.last_seen}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading messages...</p>
              </div>
            ) : chatHistory.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "Me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      msg.sender === "Me"
                        ? "bg-secondary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm break-words">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t p-4 bg-card lg:rounded-b-xl">
            <div className="flex gap-2">
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && sendMessage()
                }
              />
              <Button
                onClick={sendMessage}
                size="icon"
                disabled={!message.trim()}
                className="bg-secondary"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center h-screen bg-background">
          <p className="text-muted-foreground">
            Select a chat to start messaging
          </p>
        </div>
      )}
    </section>
  );
}