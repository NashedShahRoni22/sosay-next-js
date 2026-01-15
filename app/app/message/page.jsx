"use client";
import { useEffect, useState, useRef } from "react";
import { useAppContext } from "@/context/context";
import { fetchWithToken, postWithToken } from "@/helpers/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, ArrowLeft } from "lucide-react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Setup Echo for real-time messaging
if (typeof window !== "undefined") {
  window.Pusher = Pusher;
}

const echo = new Echo({
  broadcaster: "reverb",
  key: "k9tfoyoxjqydldgg2w6y",
  wsHost: "localhost",
  wsPort: 8080,
  wssPort: 8080,
  forceTLS: false,
  enabledTransports: ["ws", "wss"],
});

// Message List Skeleton
function MessageListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="border rounded-lg p-4 animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-200 rounded-full w-16 h-16" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Chat Skeleton
function ChatSkeleton() {
  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4 animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-200 rounded-full w-12 h-12" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
      <div className="flex-1 p-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex">
            <div className="h-10 bg-gray-200 rounded-lg w-2/3 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MessagingPage() {
  const { accessToken, userInfo } = useAppContext();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  // Fetch message list
  const { data: messageData, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["/chat/inbox", accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  const messageDataList = messageData?.data || [];

  // Fetch chat history when user is selected
  const { data: historyData, isLoading: isLoadingHistory } = useQuery({
    queryKey: [`/chat/history/${selectedUser?.user_id}`, accessToken],
    queryFn: fetchWithToken,
    enabled: !!selectedUser && !!accessToken,
  });

  // Initialize chat history from API
  useEffect(() => {
    if (historyData?.data) {
      const formattedHistory = historyData.data.map((msg) => ({
        id: msg.id,
        text: msg.message,
        sender: msg.sender_id === userInfo?.id ? "Me" : "Them",
        time: msg.created_at,
        isFile: msg.is_file || false,
      }));
      setChatHistory(formattedHistory);
    }
  }, [historyData, userInfo?.id]);

  // MAIN REAL-TIME LISTENER - Always active for inbox updates
  useEffect(() => {
    if (!userInfo?.id) return;

    const channel = echo.channel(`chat.${userInfo.id}`);

    channel.listen(".message.sent", (e) => {
      console.log("Real-time Message received:", e);
      
      // If chat is open with the sender, add message to chat history
      if (selectedUser && e.sender_id === selectedUser.user_id) {
        setChatHistory((prev) => [
          ...prev,
          {
            id: e.id || Date.now(),
            text: e.message,
            sender: "Them",
            time: e.created_at || new Date().toISOString(),
            isFile: e.is_file || false,
          },
        ]);
      }

      // Always refresh inbox to show new messages in the list
      queryClient.invalidateQueries(["/chat/inbox"]);
    });

    return () => {
      channel.stopListening(".message.sent");
      echo.leave(`chat.${userInfo.id}`);
    };
  }, [userInfo?.id, selectedUser, queryClient]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData) => {
      const formData = new FormData();
      formData.append("receiver_id", selectedUser.user_id);
      formData.append("message", messageData.message);
      
      return await postWithToken("/chat/send", formData, accessToken);
    },
    onSuccess: (data) => {
      if (data.status === true) {
        // Refresh inbox
        queryClient.invalidateQueries(["/chat/inbox"]);
      }
    },
  });

  const handleSendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    // Optimistic update
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: "Me",
      time: new Date().toISOString(),
      isFile: false,
    };

    setChatHistory((prev) => [...prev, newMessage]);
    
    sendMessageMutation.mutate({ message });
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBackToList = () => {
    setSelectedUser(null);
  };

  return (
    <div className="w-full h-screen lg:h-[calc(100vh-8rem)] lg:max-w-7xl lg:mx-auto lg:mt-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-4 h-full">
        {/* Left Sidebar - Message List (Hidden on mobile when chat is open) */}
        <div
          className={`${
            selectedUser ? "hidden lg:block" : "block"
          } lg:col-span-4 bg-white lg:rounded-lg lg:shadow p-4 lg:p-6 overflow-y-auto h-full`}
        >
          <div className="mb-6">
            <h1 className="text-2xl md:text-2xl font-bold mb-2">Messages</h1>
            <p className="text-gray-600 text-sm">
              Chat with your friends and connections
            </p>
          </div>

          {isLoadingMessages ? (
            <MessageListSkeleton />
          ) : messageDataList.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <p>No messages yet</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {messageDataList.map((msgUser) => (
                <li
                  key={msgUser.user_id}
                  onClick={() => setSelectedUser(msgUser)}
                  className={`border rounded-lg p-3 lg:p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedUser?.user_id === msgUser.user_id
                      ? "bg-secondary/10 border-secondary"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 lg:h-14 lg:w-14 flex-shrink-0">
                      <AvatarImage src={msgUser.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-secondary to-purple-600 text-white font-semibold">
                        {msgUser.name?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-sm lg:text-base truncate">
                        {msgUser.name}
                      </h2>
                      <p className="text-gray-600 text-xs lg:text-sm truncate">
                        {msgUser.last_message}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {msgUser.time}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right Panel - Chat Area (Full screen on mobile when open) */}
        <div
          className={`${
            selectedUser ? "block" : "hidden lg:block"
          } lg:col-span-8 bg-white lg:rounded-lg lg:shadow flex flex-col h-full`}
        >
          {!selectedUser ? (
            <div className="flex-1 flex flex-col h-full items-center justify-center text-gray-500 p-4">
                <p className="text-lg font-medium">Select a conversation</p>
                <p className="text-sm mt-2">
                  Choose a message from the list to start chatting
                </p>
            </div>
          ) : isLoadingHistory ? (
            <ChatSkeleton />
          ) : (
            <>
              {/* Chat Header */}
              <div className="border-b p-3 lg:p-4 flex items-center space-x-3 sticky top-0 bg-white z-10">
                {/* Back button for mobile */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToList}
                  className="lg:hidden flex-shrink-0"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>

                <Avatar className="h-10 w-10 lg:h-12 lg:w-12 flex-shrink-0">
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-secondary to-purple-600 text-white font-semibold">
                    {selectedUser.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-sm lg:text-base truncate">
                    {selectedUser.name}
                  </h2>
                  <p className="text-xs text-gray-500">Active now</p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-3 bg-gray-50">
                {chatHistory.length === 0 ? (
                  <div className="text-center text-gray-500 mt-10">
                    <p className="text-sm lg:text-base">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                ) : (
                  chatHistory.map((msg, index) => (
                    <div
                      key={msg.id || index}
                      className={`flex ${
                        msg.sender === "Me" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] lg:max-w-[70%] rounded-lg px-3 py-2 lg:px-4 lg:py-2 ${
                          msg.sender === "Me"
                            ? "bg-secondary text-white"
                            : "bg-white border"
                        }`}
                      >
                        <p className="text-xs lg:text-sm break-words">
                          {msg.text}
                        </p>
                        <p
                          className={`text-[10px] lg:text-xs mt-1 ${
                            msg.sender === "Me"
                              ? "text-white/70"
                              : "text-gray-500"
                          }`}
                        >
                          {new Date(msg.time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t p-3 lg:p-4 bg-white sticky bottom-0">
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 text-sm lg:text-base"
                    disabled={sendMessageMutation.isPending}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={
                      !message.trim() || sendMessageMutation.isPending
                    }
                    className="bg-secondary hover:bg-secondary/90 flex-shrink-0"
                    size="icon"
                  >
                    {sendMessageMutation.isPending ? (
                      <Loader2 className="h-4 w-4 lg:h-5 lg:w-5 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 lg:h-5 lg:w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}