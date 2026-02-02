import { useEffect, useState, useRef } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { useAppContext } from "@/context/context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Paperclip, X, Download } from "lucide-react";
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
          text: typeof msg.message === 'string' ? msg.message : (msg.message?.message || 'Message'),
          sender: msg.sender_id == userInfo.id ? "Me" : "Them",
          timestamp: msg.created_at,
          isFile: msg.is_file === 1 || msg.is_file === true,
          fileUrl: msg.is_file ? (typeof msg.message === 'string' ? msg.message : msg.message?.message || null) : null,
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
      const messageText = typeof e.message === 'string' ? e.message : (e.message?.message || 'Message');
      setChatHistory((prev) => [
        ...prev,
        {
          text: messageText,
          sender: "Them",
          timestamp: new Date(),
          isFile: e.is_file === 1 || e.is_file === true,
          fileUrl: e.is_file ? messageText : null,
        },
      ]);
    });

    return () => {
      channel.stopListening(".message.sent");
      echo.leave(`chat.${userInfo.id}`);
    };
  }, [accessToken, userInfo, receiver]);

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Remove selected file
  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Get file name from URL
  const getFileNameFromUrl = (url) => {
    try {
      const urlParts = url.split("/");
      return urlParts[urlParts.length - 1];
    } catch {
      return "file";
    }
  };

  // send Message (text or file)
  const sendMessage = async () => {
    if ((!message.trim() && !selectedFile) || !accessToken || isSending) return;

    setIsSending(true);

    try {
      let requestBody;
      let headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      // If there's a file, use FormData
      if (selectedFile) {
        const formData = new FormData();
        formData.append("receiver_id", receiver?.user_id);
        formData.append("file", selectedFile);
        formData.append("is_file", "1");
        if (message.trim()) {
          formData.append("message", message);
        }

        requestBody = formData;
        // Don't set Content-Type for FormData - browser will set it with boundary
      } else {
        // Regular text message
        headers["Content-Type"] = "application/json";
        requestBody = JSON.stringify({
          receiver_id: receiver?.user_id,
          message: message,
          is_file: 0,
        });
      }

      // Optimistic update
      const optimisticMessage = {
        text: selectedFile ? selectedFile.name : message,
        sender: "Me",
        timestamp: new Date(),
        isFile: !!selectedFile,
        fileUrl: selectedFile ? URL.createObjectURL(selectedFile) : null,
      };
      setChatHistory((prev) => [...prev, optimisticMessage]);

      const response = await fetch("https://api.sosay.org/api/v1/chat/send", {
        method: "POST",
        headers: headers,
        body: requestBody,
      });

      if (response.ok) {
        queryClient.invalidateQueries({
          queryKey: [`/chat/inbox`],
        });

        // Get the actual file URL from response if it's a file
        if (selectedFile) {
          const responseData = await response.json();
          const fileUrl = responseData?.data?.message;
          
          // Update the optimistic message with the real URL
          if (fileUrl) {
            setChatHistory((prev) =>
              prev.map((msg, idx) =>
                idx === prev.length - 1 ? { ...msg, text: fileUrl, fileUrl } : msg
              )
            );
          }
        }

        setMessage("");
        removeSelectedFile();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove optimistic message on error
      setChatHistory((prev) => prev.slice(0, -1));
      alert("Failed to send message");
    } finally {
      setIsSending(false);
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
                    {msg.isFile ? (
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4" />
                        <a
                          href={msg.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm underline break-all hover:opacity-80"
                        >
                          {getFileNameFromUrl(msg.fileUrl || msg.text)}
                        </a>
                        <a
                          href={msg.fileUrl}
                          download
                          className="hover:opacity-80"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </div>
                    ) : (
                      <p className="text-sm break-words">{msg.text}</p>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t p-4 bg-card lg:rounded-b-xl">
            {/* File Preview */}
            {selectedFile && (
              <div className="mb-2 p-2 bg-muted rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  <span className="text-sm truncate max-w-[200px]">
                    {selectedFile.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={removeSelectedFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="flex gap-2">
              {/* File Upload Button */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSending}
              >
                <Paperclip className="h-4 w-4" />
              </Button>

              {/* Text Input */}
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={selectedFile ? "Add a caption (optional)..." : "Type a message..."}
                className="flex-1"
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && sendMessage()
                }
                disabled={isSending}
              />

              {/* Send Button */}
              <Button
                onClick={sendMessage}
                size="icon"
                disabled={(!message.trim() && !selectedFile) || isSending}
                className="bg-secondary"
              >
                {isSending ? (
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center h-[80vh] bg-background rounded-xl shadow-sm">
          <p className="text-muted-foreground">
            Select a chat to start messaging
          </p>
        </div>
      )}
    </section>
  );
}